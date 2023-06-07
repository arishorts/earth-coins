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
    }
  }
`;
