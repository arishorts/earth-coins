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

export const QUERY_GETCOINLIST = gql`
  query getCoinList($after: String, $first: Int, $total: Int, $page: Int) {
    getCoinList(after: $after, first: $first, total: $total, page: $page) {
      edges {
        cursor
        node {
          coinId
          ath
          image
          current_price
          symbol
          market_cap
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const QUERY_GETTOTALCOINS = gql`
  query getTotalCoins {
    getTotalCoins {
      coinId
    }
  }
`;
