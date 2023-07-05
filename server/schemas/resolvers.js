const { User, Coin } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedCoins");
        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    getAPICoins: async (parent, { offset, limit }, { dataSources }) => {
      try {
        const response = await dataSources.coinGeckoAPI.getAPICoins(
          offset,
          limit
        );
        return response;
      } catch (error) {
        console.error("Error occurred while fetching API coins:", error);
        return [];
      }
    },

    getSavedCoins: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate(
          "savedCoins"
        );

        if (user) {
          return user.savedCoins;
        } else {
          throw new Error("User not found!");
        }
      } else {
        throw new AuthenticationError("You need to be logged in!");
      }
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveCoin: async (parent, { content }, context) => {
      if (context.user) {
        const { coinId } = content;
        // Check if the coin exists and update it or create a new one if it doesn't
        let coin = await Coin.findOneAndUpdate(
          { coinId },
          { $addToSet: { users: context.user._id }, $set: content }, // update users array and other fields
          { new: true, upsert: true } // use 'upsert: true' to create a new coin if it doesn't exist
        );

        // Add the coin ID to the user's savedCoins array
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedCoins: content } },
          { new: true }
        ).populate("savedCoins");
        // // Populate users associated with the coin
        coin = await Coin.findOne({ _id: coin._id }).populate("users");

        return { user: updatedUser, coin };
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    removeCoin: async (parent, { coinId }, context) => {
      if (context.user) {
        // Find the coin in the database using the coinId
        const coin = await Coin.findOne({ coinId });

        if (!coin) {
          throw new Error("Coin not found");
        }

        // Update the user document by pulling the coin's ObjectId from the savedCoins array
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedCoins: { coinId } } },
          { new: true }
        );

        if (!user) {
          throw new AuthenticationError("User not found");
        }

        // Check if users field exists in the coin document and it is an array
        if (Array.isArray(coin.users)) {
          // Update the coin document
          const users = coin.users.filter(
            (userId) => userId.toString() !== context.user._id.toString()
          );

          if (users.length > 0) {
            coin.users = users;
            await coin.save();
          } else {
            await Coin.deleteOne({ _id: coin._id });
          }
        } else {
          // If the users field does not exist or is not an array, delete the coin document
          await Coin.deleteOne({ _id: coin._id });
        }

        return user;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
