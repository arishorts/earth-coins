const { Schema, model } = require("mongoose");

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedCoins` array in User.js
const coinSchema = new Schema({
  //users that saved this coin by the user id
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  coinId: {
    type: String,
    required: true,
  },
  current_price: {
    type: Number,
  },
  image: {
    type: String,
  },
  symbol: {
    type: String,
  },
});

const Coin = model("Coin", coinSchema);

module.exports = { Coin, coinSchema };
