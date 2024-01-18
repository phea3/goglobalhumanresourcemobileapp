import { gql } from "@apollo/client";

export const GETCHAIRMAN = gql`
  query SelectChairman($limit: Int!) {
    selectChairman(limit: $limit) {
      _id
      value
      profileImage
    }
  }
`;
