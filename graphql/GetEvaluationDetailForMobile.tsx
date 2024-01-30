import { gql } from "@apollo/client";

export const GETEVALUATIOINDETAILFORMOBILE = gql`
  query GetEvaluationDetailForMobile($id: ID!) {
    getEvaluationDetailForMobile(_id: $id) {
      _id
      evaluationTitle
      evaluationDate
      employeeName
      position
      department
      evaluationDetailList {
        _id
        evaluation
        result
      }
      overallAverage
    }
  }
`;
