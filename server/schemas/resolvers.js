const { User, Coin } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    getAllCoins: async () => {
      const coins = await Coin.find({});
      return coins.map(coin => ({
        ...coin.toObject(),
        _id: coin._id.toString()
      }));
    }
    ,
  getSavedCoins: async (parent, args, context) => {
    if (context.user) {
        const user = await User.findById(context.user._id).populate('savedCoins');
        
        if (user) {
            return user.savedCoins;
        } else {
            throw new Error('User not found!');
        }
    } else {
        throw new AuthenticationError('You need to be logged in!');
    }
}
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
    
        // Check if the coin exists
        let coin = await Coin.findOne({ coinId });
    
        // If the coin doesn't exist, create a new one
        if (!coin) {
          coin = await Coin.create(content);
        }
    
        // Add the coin ID to the user's savedCoins array
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedCoins: coin._id } },
          { new: true }
        ).populate('savedCoins');
    
        return updatedUser;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    
    removeCoin: async (parent, { coinId }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedCoins: { coinId } } },
          { new: true }
        );
        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
