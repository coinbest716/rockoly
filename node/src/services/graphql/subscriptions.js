/** Local Modules **/
import * as utils from '../../utils';

// check if subscribe be called or not based on subs filters created in client side
export function doSubscribe(payload, variables, subsDefn) {

  let logFileName = 'doSubscribe:';

  utils.logData(`${logFileName} variables: ${JSON.stringify(variables)}`,utils.LOGLEVELS.INFO);
  utils.logData(`${logFileName} payload: ${JSON.stringify(payload)}`,utils.LOGLEVELS.INFO);
  utils.logData(`${logFileName} subsDefn: ${JSON.stringify(subsDefn)}`,utils.LOGLEVELS.INFO);

  // get subscription criteria
  let subscriptionCriteria = subsDefn.subsFilterCriteria;

  // get subscription channel name
  let channelName = subsDefn.subsChannelName;

  // get subscription's payload data
  let payloadData = payload[channelName].data;

  // set publish false
  let publishYN = false;

  // loop all the subscription criteria
  subscriptionCriteria.forEach((criteria, index) => {
    if (criteria && variables[criteria]) {
      // if variables contains that criteria (when subscription was initiated), and data.criteria.value does not match variables.criteria.value, it is NOT a match check for match using operator
      if (utils.checkIfStringMatched(payloadData[criteria], variables[criteria])) {
        publishYN = true;
      }
    }
  });

  // if subscribed with no variables, then pass the whole record
  if (utils.checkIfObjectIsEmpty(variables)) {
    publishYN = true;
  }

  return publishYN;

}
