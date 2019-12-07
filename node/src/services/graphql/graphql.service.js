import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import { ApolloServer } from 'apollo-server-express';
// 26th Oct Postgraphile subscriptions
// import { SubscriptionServer } from 'subscriptions-transport-ws';
// import { execute } from 'graphql';
import {createServer} from 'http';
import config from 'config';

import {PubSub} from 'apollo-server';

import {getGqlSchema} from './schema/schema.remote';

import * as utils from '../../utils';

const graphqlConfig = config.get('graphql');

const app = express(feathers());

let logFileName = 'src/services/graphql/graphql.service.js: ';

async function initGraphQLService(){
  
  // 1: Get newly merged schema
  const schema = await getGqlSchema();

  // 26th Oct Postgraphile subscriptions
  // const postgraphileConfig = config.get('postgraphile');
  // const postgraphileWSURL = `ws://${postgraphileConfig.host}:${postgraphileConfig.port}${postgraphileConfig.options.graphqlRoute}`;

  const pubsub = new PubSub();
  
  const server = new ApolloServer({
    schema : schema,

    /*
    // 26th Oct Postgraphile subscriptions
    subscriptions:{
      path:postgraphileWSURL
    },*/

    context: async ({req, connection}) => {
      let contextRes = {};
      if(req){
        if(req.hasOwnProperty('headers')){
          contextRes.headers = req.headers ;
          contextRes.isBlocked = await utils.isBlocked(req.headers);
        }else{
          contextRes.headers = {};
          contextRes.isBlocked = false;
        }
      }else{
        contextRes.headers = {};
        contextRes.isBlocked = false;
      }
      contextRes.pubsub = pubsub;
      global.pubsub = pubsub;
      return contextRes;
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket, context) => {
        if (connectionParams){
          if(connectionParams.hasOwnProperty('id') && connectionParams.hasOwnProperty('role')){
            let headers = {
              'id':connectionParams.id,
              'role':connectionParams.role
            };
            let isBlocked = await utils.isBlocked(headers);
            if (isBlocked) {
              throw new Error('USER_IS_BLOCKED');
            }
          }
        }
      },
      onOperation(msg, params, webSocket) {
        utils.logData(`${logFileName} subscriptions:onOperation: params: ${params}`, utils.LOGLEVELS.INFO);
        utils.logData(`${logFileName} subscriptions:onOperation: msg: ${msg}`, utils.LOGLEVELS.INFO);
      },
      onOperationComplete(connectionContext, opId) {
        utils.logData(`${logFileName} subscriptions:onOperationComplete: opId: ${opId}`, utils.LOGLEVELS.INFO);
      },
    },
  });
  
  server.applyMiddleware({ app });

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen(graphqlConfig.port, () => {
    utils.logData(`${logFileName} Graphql URL: Port: ${graphqlConfig.port} Path: ${graphqlConfig.path}`, utils.LOGLEVELS.INFO);
    utils.logData(`${logFileName} Subscriptions ready at ws://localhost:${graphqlConfig.port}${server.subscriptionsPath}`, utils.LOGLEVELS.INFO);

    // 26th Oct Postgraphile subscriptions
    // new SubscriptionServer({
    //   execute,
    //   schema
    // }, {
    //   server: httpServer,
    //   path: graphqlConfig.path,
    // });

  });

}

initGraphQLService();
