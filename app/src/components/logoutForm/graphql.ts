import { gql } from "apollo-boost";

export const logoutActionGQL = gql`mutation logoutAction{    logoutAction{       status    }}`