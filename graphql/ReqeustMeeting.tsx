import { gql } from "@apollo/client";

export const REQUESTMEETING = gql`
  mutation ReqeustMeeting($input: MeetingInput!) {
    reqeustMeeting(input: $input) {
      message
      status
    }
  }
`;
