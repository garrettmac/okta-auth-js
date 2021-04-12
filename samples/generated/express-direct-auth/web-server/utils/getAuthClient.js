const OktaAuth = require('@okta/okta-auth-js').OktaAuth;
const uniqueId = require('./uniqueId');

const sampleConfig = require('../../config').webServer;


module.exports = function getAuthClient(options = {}) {
  let authClient;
  try {
    authClient = new OktaAuth({ 
      ...sampleConfig.oidc, 
      storageManager: {
        transaction: {
          storageKey: 'transaction-' + uniqueId()
        }
      },
      ...options
    });
  } catch(e) {
    console.error('Caught exception in OktaAuth constructor: ', e);
  }
  return authClient;
};