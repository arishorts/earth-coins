const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Coin {
    _id: ID!
    coinId: ID!
    current_price: Int
    image: String
    symbol: String
    savedBy: [User]
  }

  type User {
    _id: ID!
    username: String!
    email: String
    savedCoins: [Coin]
    coinCount: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  input CoinContent {
    coinId: ID!
    current_price: Int
    image: String
    symbol: String
  }

  type Query {
    me: User
    getAllCoins: [Coin]
    getSavedCoins: [Coin]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveCoin(content: CoinContent!): User
    removeCoin(coinId: ID!): User
  }
`;

module.exports = typeDefs;
