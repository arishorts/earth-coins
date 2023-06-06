const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Coin {
  _id: ID!
  coinId: ID!
  authors: [String]
  description: String
  title: String!
  image: String
  link: String
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
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  type Query {
    me: User
    getAllCoins: [Coin]
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
