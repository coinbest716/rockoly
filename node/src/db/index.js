import config from 'config';

import {dbListeners} from './db.listeners';

import * as utils from '../utils';

// 1: Get db details from config
const postgresConfig = config.get('postgresDB');
const connectionData = {
  host: postgresConfig.host,
  port: postgresConfig.port,
  database: postgresConfig.dbName,
  user: postgresConfig.user,
  password: postgresConfig.password
};

// 2: set pg-promise with config
const initOptions = {
  noLocking: false,
  capSQL: true,
  noWarnings: false,
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    utils.logData(`Pg-promise: Connected to database: ${cp.database}`, utils.LOGLEVELS.INFO);
  },
  disconnect(client, dc) {
    const cp = client.connectionParameters;
    utils.logData(`Pg-promise: Disconnecting from database: ${cp.database}`, utils.LOGLEVELS.INFO);
  },
  error(err, e) {
    utils.logData(`Pg-promise: Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
  },
  query(e) {
    utils.logData(`Pg-promise: Query: ${e.query}`, utils.LOGLEVELS.INFO);
  },
  receive(data, result, e) {
    utils.logData(`Pg-promise: Receive: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
  }
};

// 3: declare the pg-promise with initOptions
const pgp = require('pg-promise')(initOptions);

// 4: setup the db
const db = pgp(connectionData);

// 5: setup the db for persistent connection
let dbPersistentClient = new pgp.pg.Client(connectionData);
dbPersistentClient.connect();
dbPersistentClient.query('LISTEN "node_watchers"');
dbPersistentClient.on('notification', function (data) {
  utils.logData(`dbPersistentClient notification : data: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
  dbListeners(data);
});

export {db, dbPersistentClient};
