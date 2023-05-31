import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      coinCount
      savedCoins {
        authors
        image
        description
        coinId
        title
        link
      }
    }
  }
`;
