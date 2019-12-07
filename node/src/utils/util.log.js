import fs from 'fs';
import {utilGetPlatform} from './util.platform';

export const LOGLEVELS = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO'
};

export function logData(message, logLevel) {
  let fileDir = '/var/log/chef/';

  let logTime = new Date();

  let logLevelDesc = LOGLEVELS[`${logLevel}`];
  let logMessage = `${logLevelDesc}:\t${logTime}:\t${message}\n`;

  if (utilGetPlatform() == 'WINDOWS') {
    fileDir = 'c:/temp/';
  }

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, '0744');
  }

  let filePath = `${fileDir}node_server.log`;
  fs.appendFileSync(filePath, logMessage);

}
