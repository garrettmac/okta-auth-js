"use strict";

exports.remediate = remediate;

var _errors = require("../errors");

var _types = require("../types");

var _util = require("./util");

/* eslint-disable max-statements */

/* eslint-disable complexity */
// This function is called recursively until it reaches success or cannot be remediated
async function remediate(idxResponse, flow, values) {
  const {
    neededToProceed
  } = idxResponse;
  const idxRemediation = (0, _util.getIdxRemediation)(flow, neededToProceed);

  if (!idxRemediation) {
    throw new _errors.AuthSdkError('No remediation in the idxResponse can be match current flow');
  }

  const name = idxRemediation.name;
  const T = flow[name];

  if (!T) {
    throw new _errors.AuthSdkError('No remediator is registered');
  }

  const remediator = new T(idxRemediation, values); // Recursive loop breaker
  // Three states are handled here:
  // 1. can remediate -> the engine keep running remediation with provided data
  // 2. cannot remediate due to need user interaction -> return nextStep data back to client
  // 3. cannot remediate due to unsupported inputs or policies -> throw error

  if (!remediator.canRemediate()) {
    const nextStep = remediator.getNextStep();
    return {
      idxResponse,
      nextStep
    };
  }

  const data = remediator.getData();

  try {
    idxResponse = await idxResponse.proceed(idxRemediation.name, data);

    if ((0, _util.isErrorResponse)(idxResponse)) {
      throw (0, _util.createApiError)(idxResponse.rawIdxState);
    }

    if (idxResponse.interactionCode) {
      return {
        idxResponse
      };
    }

    return remediate(idxResponse, flow, values); // recursive call
  } catch (e) {
    // Thrown error terminates the interaction with idx
    if ((0, _types.isRawIdxResponse)(e)) {
      // idx responses are sometimes thrown, these will be "raw"
      if (e.messages) {
        // Error in the root level of the response is not handlable, throw it
        throw (0, _util.createApiError)(e);
      } else {
        // Form error is handlable with client side retry, return it
        const nextStep = remediator.getNextStep();
        const formError = remediator.createFormError(e);
        return {
          nextStep,
          formError
        };
      }
    } // throw unknown error


    throw e;
  }
}
//# sourceMappingURL=remediate.js.map