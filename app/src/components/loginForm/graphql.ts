import { gql } from "apollo-boost";

export const loginActionGQL = gql`
mutation loginAction($account:String,$password:String){
    loginAction(account:$account,password:$password){
        id
        account
        name
    }
}
`