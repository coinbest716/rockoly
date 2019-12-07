import React, { useMemo } from 'react';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { GQL_ENDPOINT_URI, WSS_ENDPOINT_URI } = publicRuntimeConfig;

let apolloClient = null;

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=false]
 */
export function withApollo(PageComponent, { ssr = true } = {}) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = useMemo(() => apolloClient || initApolloClient(apolloState), []);
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName = PageComponent.displayName || PageComponent.name || 'Component';

    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.');
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async ctx => {
      const { AppTree } = ctx;

      // Initialize ApolloClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      const apolloClient = (ctx.apolloClient = initApolloClient());

      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/react-ssr');
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
              />
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error);
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
      };
    };
  }

  return WithApollo;
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {Object} initialState
 */
function initApolloClient(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */

// console.log('GQL_ENDPOINT_URI',GQL_ENDPOINT_URI);

const httpLink = createHttpLink({
  uri: GQL_ENDPOINT_URI, // Server URL (must be absolute)
  credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  fetch,
});

// console.log('WSS_ENDPOINT_URI',WSS_ENDPOINT_URI);

const wsLink = process.browser
  ? new WebSocketLink({
      // if you instantiate in the server, the error will be thrown
      uri: `wss://gqldev.neosme.com/graphql`,
      options: {
        reconnect: true,
        connectionParams: {
          authToken: null,
        },
      },
    })
  : console.log('process.browser', process.browser);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  let userId = '';
  // console.log('kjhkhqweqweqweqwe', customerName);
  let tokenValue = '';
  let userRole = '';
  if (typeof window !== 'undefined') {
    tokenValue = localStorage.getItem('current_user_token');
    userId = JSON.parse(localStorage.getItem('user_ids'));
    userRole = localStorage.getItem('user_role');
  }
  let role = '';
  let id = '';
  if (userRole === '"chef"') {
    role = 'CHEF';
    id = userId.chefId;
  }
  if (userRole === '"customer"') {
    role = 'CUSTOMER';
    id = userId.customerId;
  }
  try {
    return {
      headers: {
        ...headers,
        token: tokenValue ? JSON.parse(tokenValue) : '',
        id: id,
        role: role,
      },
    };
  } catch (error) {
    console.log('error', error);
  }
});

// const Errorlink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors)
//   {
//     console.log("graphQLErrors",graphQLErrors)
//     graphQLErrors.map(({ message, locations, path }) =>
//     console.log(
//       `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
//     ),
//   );
//   }
//   if (networkError) console.log(`[Network error]: ${networkError}`);
// });

const link = process.browser
  ? split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      authLink.concat(httpLink)
    )
  : authLink.concat(httpLink);

export function createApolloClient(initialState = {}) {
  try {
    return new ApolloClient({
      ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
      link,
      cache: new InMemoryCache(),
    });
  } catch (error) {
    console.log('error', error);
  }
}
