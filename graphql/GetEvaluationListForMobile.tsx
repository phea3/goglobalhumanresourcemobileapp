import { gql } from "@apollo/client";

export const GETEVALUATIOINLISTFORMOBILE = gql`
  query GetEvaluationListForMobile {
    getEvaluationListForMobile {
      _id
      evaluationDate
      evaluationType
    }
  }
`;
