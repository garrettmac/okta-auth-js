"use strict";

exports.createApiError = createApiError;
exports.getAllValues = getAllValues;
exports.getRequiredValues = getRequiredValues;
exports.findRemediationByName = findRemediationByName;
exports.getIdxRemediation = getIdxRemediation;
exports.isErrorResponse = isErrorResponse;
exports.titleCase = titleCase;

var _errors = require("../errors");

function createApiError(res) {
  let allErrors = [];

  if (res.messages && Array.isArray(res.messages.value)) {
    allErrors = res.messages.value.map(o => o.message);
  }

  return new _errors.AuthApiError({
    errorSummary: allErrors.join('. '),
    errorCauses: allErrors
  });
}

function getAllValues(idxRemediation) {
  return idxRemediation.value.map(r => r.name);
}

function getRequiredValues(idxRemediation) {
  return idxRemediation.value.reduce((required, cur) => {
    if (cur.required) {
      required.push(cur.name);
    }

    return required;
  }, []);
}

function findRemediationByName(idxRemediation, name) {
  return idxRemediation.value.find(value => {
    if (value.name === name) {
      return true;
    }
  });
} // Return first match idxRemediation in allowed remediators


function getIdxRemediation(remediators, idxRemediations) {
  return idxRemediations.find(idxRemediation => Object.keys(remediators).includes(idxRemediation.name));
}

function isErrorResponse(idxResponse) {
  const rawIdxState = idxResponse.rawIdxState;

  if (rawIdxState.messages && rawIdxState.messages.value && rawIdxState.messages.value.length > 0) {
    return true;
  }

  return false;
}

function titleCase(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}
//# sourceMappingURL=util.js.map