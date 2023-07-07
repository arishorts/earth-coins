const { gql } = require("apollo-server-express");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const typeDefs = `#graphql
  type Coin {
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
    ath: Float
    image: String
    current_price: Float
    symbol: String
    market_cap: Float
  }

# Contains a cursor to the last item in the list. Pass this cursor to the launches query to fetch results after these.
# Define the connection type for paginated coins
type CoinConnection {
  edges: [CoinEdge!]!
  pageInfo: PageInfo!
}

# Define the edge type for a coin in the connection
type CoinEdge {
  cursor: String!
  node: Coin
}

  type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

  type Query {
    me: User
    getCoinList(first: Int, after: String, last: Int, before: String): CoinConnection!
    getTotalCoins:[Coin]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveCoin(content: CoinContent!): SaveCoinResult
    removeCoin(coinId: ID!): User
  }
`;

module.exports = typeDefs;
