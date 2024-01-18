import { gql } from "@apollo/client";

export const GETMEETINGSMOBILE = gql`
  query GetMeetingsMobile($limit: Int!) {
    getMeetingsMobile(limit: $limit) {
      _id
      topic
      description
      venue
      date
      start
      end
    }
  }
`;
