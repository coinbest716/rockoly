//Need to avoid import or export not defined issue
require('@babel/register');

//Need to avoid regeneratorRuntime not defined issue
require('@babel/polyfill');

const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

const {logData,LOGLEVELS} = require('./utils');

let logFileName = 'src/index.js: ';

process.on('unhandledRejection', (reason, p) =>{
  logData(`${logFileName} Unhandled Rejection at: Promise: ${reason}`, LOGLEVELS.INFO);
});

server.on('listening', () => {
  let url = 'http://'+app.get('host')+':'+port;
  logData(`${logFileName} Feathers application started URL: ${url}`, LOGLEVELS.INFO);
});
