import config from 'config';

import {
  mergeSchemas,
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  introspectSchema
} from 'graphql-tools';

import {HttpLink} from 'apollo-link-http';
import { split } from 'apollo-link';
import WebSocket from 'ws';
import { SubscriptionClient } from 'subscriptions-transport-ws/dist/client';
import fetch from 'node-fetch';
import { getMainDefinition } from 'apollo-utilities';
import {setContext} from 'apollo-link-context';

import {localSchema} from './schema.local';
import {resolvers} from '../resolvers';
import * as utils from '../../../utils';

let logFileName = 'src/services/graphql/schema/schema.remote.js: ';

export async function getGqlSchema() {

  const executor = async function (resolve, reject) {

    const postgraphileConfig = config.get('postgraphile');
    const postgraphileHostURL = `${postgraphileConfig.protocol}://${postgraphileConfig.host}:${postgraphileConfig.port}${postgraphileConfig.options.graphqlRoute}`;
    const postgraphileWSURL = `ws://${postgraphileConfig.host}:${postgraphileConfig.port}${postgraphileConfig.options.graphqlRoute}`;

    utils.logData(`${logFileName}: postgraphile Host URL: ${postgraphileHostURL}  Ws URL: ${postgraphileWSURL}`, utils.LOGLEVELS.INFO);

    // 1: get local schema
    const localSchemaEXEC = await makeExecutableSchema({
      typeDefs: localSchema,
      resolvers: resolvers
    });

    // 2: http link
    const httpLink = new HttpLink({
      uri: postgraphileHostURL,
      fetch
    });

    // pass the headers to postgraphile
    let contextLink = setContext(async (request, previousContext) => {
      let headers = {};
      if (previousContext) {
        if (previousContext.graphqlContext) {

          let isBlocked = previousContext.graphqlContext.isBlocked || '';

          if (isBlocked === true) {
            throw new Error('USER_IS_BLOCKED');
          }
        }
      }
      return headers;
    });
    contextLink = contextLink.concat(httpLink);

    // 3: Subscription link
    const wsLink = new SubscriptionClient(postgraphileWSURL, {
      reconnect: true
    }, WebSocket);

    const link = split(
      // split based on operation type
      ({
        query
      }) => {
        const {
          kind,
          operation
        } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      contextLink,
    );

    // 4: get scheme from remote url
    await introspectSchema(link).then((remoteSchemaDef) => {

      // 4.1: Make remote executable schema
      const remoteSchemaEXEC = makeRemoteExecutableSchema({
        schema: remoteSchemaDef,
        link
      });

      // 5: merge both remote and local schema
      const schema = mergeSchemas({
        schemas: [localSchemaEXEC, remoteSchemaEXEC]
      });

      resolve(schema);

    }).catch((error) => {

      reject(`Failed to Get remote schema from ${postgraphileHostURL} as ${error}`);

    });

  };

  return new Promise(executor);

}
