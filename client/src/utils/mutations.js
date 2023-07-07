import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_COIN = gql`
  mutation saveCoin($content: CoinContent!) {
    saveCoin(content: $content) {
      user {
        _id
        username
        email
        savedCoins {
          coinId
          current_price
          image
          symbol
        }
        coinCount
      }
      coin {
        coinId
        ath
        image
        current_price
        symbol
        market_cap
        savedBy {
          _id
          username
          email
        }
      }
    }
  }
`;

export const REMOVE_COIN = gql`
  mutation removeCoin($coinId: ID!) {
    removeCoin(coinId: $coinId) {
      _id
      username
      email
      coinCount
      savedCoins {
        coinId
      }
    }
  }
`;
