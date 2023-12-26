import { gql } from "@apollo/client";

export const GET_DAILY_ATTENDANCE_REPORT = gql`
  query GetDailyAttendanceReport($date: Date!, $shift: String!) {
    getDailyAttendanceReport(date: $date, shift: $shift) {
      _id
      profileImage
      latinName
      attendance
      fine
      reason
    }
  }
`;
