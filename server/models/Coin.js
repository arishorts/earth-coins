const { Schema, model } = require("mongoose");

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedCoins` array in User.js
const coinSchema = new Schema({
  users: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  // saved coin id from GoogleCoins
  coinId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = coinSchema;
