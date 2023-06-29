const { gql } = require("apollo-server-express");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const typeDefs = `#graphql
  type Coin {
    _id: ID!
    coinId: ID!
    current_price: Float
    image: String
    symbol: String
    ath: Float
    market_cap: Float
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

  type SaveCoinResult {
    user: User
    coin: Coin
  }

  input CoinContent {
    coinId: ID!
    current_price: Float
    image: String
    symbol: String
    ath: Float
    market_cap: Float
  }

  type Query {
    me: User
    getAPICoins(page: Int, number: Int):[Coin]
    getSavedCoins: [Coin]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveCoin(content: CoinContent!): SaveCoinResult
    removeCoin(coinId: ID!): User
  }
`;

module.exports = typeDefs;
