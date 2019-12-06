/** @format */

import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-boost'
import {setContext} from 'apollo-link-context'
import {getENVConfig} from './utils/common'
import {CONFIG} from './config/config'

const getAuthLink = token => {
  // // create an apollo link instance, a network interface for apollo client
  const httpLink = new HttpLink({
    uri: getENVConfig(CONFIG.GQL_ENDPOINT_URI),
  })
  const authLink = setContext(async (_, {headers}) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
        token,
      },
    }
  })
  return authLink.concat(httpLink)
}

const createApolloClient = token => {
  // create an inmemory cache instance for caching graphql data
  const cache = new InMemoryCache()
  // instantiate apollo client with apollo link instance and cache instance
  const client = new ApolloClient({
    link: getAuthLink(token),
    cache,
  })
  return client
}
export default createApolloClient
