/** @format */

import React from 'react'
import {Provider} from 'react-redux'
import {ApolloProvider} from 'react-apollo'
import {setContext} from 'apollo-link-context'
import firebase from 'firebase'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import './App.css'
import Route from './containers/routes/routes'
import reducers from './reducers/index'
import {getENVConfig} from './utils/common'
import {CONFIG} from './config/config'
import createApolloClient from './createApolloClient'
import {GetValueFromLocal} from './utils/localStorage'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      client: null,
    }
    //TODO: @suren add underscore on variables name like AUTH_DOMAIN
    const firebaseConfig = {
      apiKey: getENVConfig(CONFIG.FIREBASE_API_KEY),
      authDomain: getENVConfig(CONFIG.AUTHDOMAIN),
      databaseURL: getENVConfig(CONFIG.DATABASEURL),
      projectId: getENVConfig(CONFIG.PROJECTID),
      storageBucket: '',
      messagingSenderId: getENVConfig(CONFIG.MESSAGINGSENDERID),
      appId: getENVConfig(CONFIG.APPID),
    }
    firebase.initializeApp(firebaseConfig)
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const client = createApolloClient(await user.getIdToken())
        this.setState({client})
        // User is signed in.
      } else {
        const client = createApolloClient(null)
        this.setState({client})
        // No user is signed in.
      }
    })
  }

  render() {
    const {client} = this.state
    if (!client) {
      return null
    }
    return (
      <ApolloProvider client={client}>
        <Provider store={createStoreWithMiddleware(reducers)}>
          <Route />
        </Provider>
      </ApolloProvider>
    )
  }
}

export default App
