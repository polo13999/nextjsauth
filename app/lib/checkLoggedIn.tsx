import gql from 'graphql-tag'
import _ from 'lodash'
export default async (apolloClient) => {

  await apolloClient.resetStore()
  try {
    const result = await apolloClient.query({
      query: gql`
        query meQuery {
          meQuery {
            id
            name
          }
        }
      `
    })
    return { loggedInUser: _.get(result, 'data.meQuery') }
  } catch (err) {
    console.log('前端登入拿使用者資料中,但失敗了')
    return { loggedInUser: null }
  }
}

