const cron = require('cron').CronJob;
import {
  db
} from '../db';
import * as utils from '../utils';

let logFileName = 'src/cron/index.js';

const firstJob = new cron('0 7 */3 * *', function () {

  utils.logData(`${logFileName} Running a task Every 3 day at 07:00`, utils.LOGLEVELS.INFO);

  try {

    let sqlStr = 'select * from util.send_email_reminder_for_reviewing();';

    db.one(sqlStr).then(async function (data) {
      utils.logData(`${logFileName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
    }).catch(function (error) {
      utils.logData(`${logFileName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
    });

  } catch (error) {

    utils.logData(`${logFileName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);

  }
}, null, true, 'Asia/Kolkata');
firstJob.start();



