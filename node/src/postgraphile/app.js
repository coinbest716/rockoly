import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import http from 'http';
import config from 'config';
import bodyParser from 'body-parser';
import {
  postgraphile,
  // makePluginHook
} from 'postgraphile';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';

// 26th Oct Postgraphile subscriptions
// only this format works, dont change this to require
// const { default: PgPubsub } = require('@graphile/pg-pubsub');

import * as utils from '../utils';

import {
  connectionFilterAllowedOperators,
  connectionFilterOperatorNames,
  removeDeleteGQLTagsFromSchema
} from './postgraphile.settings';

let postgraphileConfig = config.get('postgraphile');
let postgresDBConfig = config.get('postgresDB');
let bodyLimitConfig = config.get('bodyLimit');

let logFileName = 'src/postgraphile/app.js: ';

// 1: create app
const app = express(feathers());

// 26th Oct Postgraphile subscriptions
// const pluginHook= makePluginHook([PgPubsub]);

app.use(bodyParser.json({
  limit: bodyLimitConfig.limit,
  parameterLimit: bodyLimitConfig.parameterLimit
}));

app.use(bodyParser.urlencoded({
  extended: true,
  limit: bodyLimitConfig.limit,
  parameterLimit: bodyLimitConfig.parameterLimit
}));

// 2: setup postgraphile http server
let postgresDBURL = 'postgres://' + postgresDBConfig.user + ':' + postgresDBConfig.password + '@' + postgresDBConfig.host + ':' + postgresDBConfig.port + '/' + postgresDBConfig.dbName;
utils.logData(logFileName + 'DB URL: ' + postgresDBURL, utils.LOGLEVELS.INFO);

// 3: set options
let pgSettingsOptions = {
  ...postgraphileConfig.options,
  appendPlugins: [removeDeleteGQLTagsFromSchema(), ConnectionFilterPlugin],
  graphileBuildOptions: {
    connectionFilterOperatorNames: connectionFilterOperatorNames,
    connectionFilterAllowedOperators: connectionFilterAllowedOperators
  },
  // 26th Oct Postgraphile subscriptions
  /*
  pluginHook,
  subscriptions: true, // Enable PostGraphile websocket capabilities
  simpleSubscriptions: true, // Add the `listen` subscription field
  websocketMiddlewares: [
    // Add whatever middlewares you need here, note that they should only
    // manipulate properties on req/res, they must not sent response data. e.g.:
    //
    //   require('express-session')(),
    //   require('passport').initialize(),
    //   require('passport').session(),
  ],*/
};

// 5: create a http server
const server = http.createServer(postgraphile(postgresDBURL, postgresDBConfig.schema, pgSettingsOptions));

// 6: console if server started
server.listen(postgraphileConfig.port, postgraphileConfig.host, postgraphileConfig.options.graphqlRoute, () => {
  let url = 'http://' + postgraphileConfig.host + ':' + postgraphileConfig.port + postgraphileConfig.options.graphqlRoute;

  utils.logData(logFileName + 'Postgraphile URL: ' + url, utils.LOGLEVELS.INFO);

});

// 7: Call app.setup to initialize all services and SocketIO
app.setup(server);
