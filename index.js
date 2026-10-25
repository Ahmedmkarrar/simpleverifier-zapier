const authentication = require('./authentication');
const { addApiKey, handleErrors } = require('./middleware');
const verifyEmail = require('./creates/verify_email');
const validatePhone = require('./creates/validate_phone');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  flags: { cleanInputData: false },
  authentication,
  beforeRequest: [addApiKey],
  afterResponse: [handleErrors],
  triggers: {},
  searches: {},
  creates: {
    [verifyEmail.key]: verifyEmail,
    [validatePhone.key]: validatePhone,
  },
};
