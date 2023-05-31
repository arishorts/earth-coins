const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Coin {
    coinId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
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
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveCoin(content: CoinContent!): User
    removeCoin(coinId: ID!): User
  }
`;

module.exports = typeDefs;
