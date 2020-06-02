import { ApolloClient, InMemoryCache } from 'apollo-boost'
//import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'
import { createUploadLink } from 'apollo-upload-client'
import config from '../config'
let apolloClient = null


if (!process.browser) { global["fetch"] = fetch }

function create(initialState, { getToken }) {
  const httpLink = createUploadLink({ uri: `${config.serverURL()}/graphql`, credentials: 'include' })
  const authLink = setContext((_, { headers }) => {
    const token = getToken()
    return { headers: { ...headers, authorization: token ? `Bearer ${token}` : '' } }
  })


  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(httpLink),
    //cache: new InMemoryCache().restore(initialState || {})
    cache: new InMemoryCache({ dataIdFromObject: object => object["key"] || null }).restore(initialState || {})
  })
}

export default function initApollo(initialState, options) {
  if (!process.browser) { return create(initialState, options) }
  if (!apolloClient) { apolloClient = create(initialState, options) }
  return apolloClient
}