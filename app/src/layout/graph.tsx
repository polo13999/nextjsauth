import gql from 'graphql-tag'

export const meQuery = gql`
query meQuery{
  meQuery{ 
    id     
    name    
    account
  }
}
`


