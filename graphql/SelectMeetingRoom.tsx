import { gql } from "@apollo/client";

export const GETMEETINGROOM = gql`
  query SelectMeetingRoom {
    selectMeetingRoom {
      _id
      value
      profileImage
    }
  }
`;
