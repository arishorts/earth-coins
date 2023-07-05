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

"""Simple wrapper around our list of coins   that contains a cursor to the
last item in the list. Pass this cursor to the launches query to fetch results
after these."""
  type CoinConnection { # add this below the Query type as an additional type.
  cursor: String!
  hasMore: Boolean!
  getCoins: [Coin]!
}

  type Query {
    me: User
    getCoins( # replace the current launches query with this one.
    """The number of results to show. Must be >= 1. Default = 20"""
    pageSize: Int
    """If you add a cursor here, it will only return results _after_ this cursor"""
    after: String
  ): CoinConnection!

    getAPICoins(offset: Int, limit: Int):[Coin]
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
