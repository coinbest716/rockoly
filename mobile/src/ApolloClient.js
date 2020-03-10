/** @format */

import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-boost'
import {setContext} from 'apollo-link-context'
import firebase from 'react-native-firebase'
import {WebSocketLink} from 'apollo-link-ws'
import {getMainDefinition} from 'apollo-utilities'
import {split} from 'apollo-link'
import AsyncStorage from '@react-native-community/async-storage'
import {Config, ConfigKey} from '@config'
import {STORAGE_KEY_NAME} from '@utils'
import {CONSTANTS} from '@common'

const getUser = key => {
  return AsyncStorage.getItem(key)
    .then(res => {
      if (res) {
        return JSON.parse(res)
      }
      return null
    })
    .catch(() => {
      return null
    })
}

const createApolloClient = () => {
  // // create an apollo link instance, a network interface for apollo client
  const httpLink = new HttpLink({
    uri: Config[ConfigKey.GRAPHQL_END_POINT],
  })
  const authLink = setContext(async (_, {headers}) => {
    // get the authentication token from local storage if it exists
    let token = null
    let role = null
    let userId = null
    try {
      const currentUser = await getUser(STORAGE_KEY_NAME.GQL_USER)
      if (currentUser && currentUser.hasOwnProperty('chefId')) {
        role = CONSTANTS.ROLE.CHEF
        userId = currentUser.userId
      } else if (currentUser && currentUser.hasOwnProperty('customerId')) {
        role = CONSTANTS.ROLE.CUSTOMER
        userId = currentUser.userId
      } else {
        role = CONSTANTS.ROLE.CUSTOMER
      }
    } catch (e) {
      role = CONSTANTS.ROLE.CUSTOMER
      // console.log('user not logged in ', e)
    }

    try {
      if (firebase.auth().currentUser) {
        token = await firebase.auth().currentUser.getIdToken()
        console.log('token', token)
      }
    } catch (e) {
      // TODO hari handle error later
      console.log('user not logged in ', e)
    }

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
        token,
        role,
        userId,
      },
    }
  })
  const wsLink = new WebSocketLink({
    uri: Config[ConfigKey.SUBSCRIPTION_END_POINT],
    options: {
      reconnect: true,
      connectionParams: {
        authToken: null,
      },
    },
  })
  const link = split(
    // split based on operation type
    ({query}) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink)
  )
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  }
  // create an inmemory cache instance for caching graphql data
  const cache = new InMemoryCache()
  // instantiate apollo client with apollo link instance and cache instance
  const client = new ApolloClient({
    link,
    cache,
    defaultOptions,
  })
  return client
}
export default createApolloClient
