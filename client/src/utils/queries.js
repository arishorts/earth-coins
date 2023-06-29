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
  query getAPICoins($page: Int, $number: Int) {
    getAPICoins(page: $page, number: $number) {
      coinId
      current_price
      image
      symbol
      ath
      market_cap
    }
  }
`;
