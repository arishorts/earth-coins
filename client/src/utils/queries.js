import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
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
  }
`;

export const QUERY_GETAPICOINS = gql`
  query getAPICoins($offset: Int, $limit: Int) {
    getAPICoins(offset: $offset, limit: $limit) {
      coinId
      current_price
      image
      symbol
      ath
      market_cap
    }
  }
`;
