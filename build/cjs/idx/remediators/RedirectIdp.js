"use strict";

exports.RedirectIdp = void 0;

var _Base = require("./Base");

class RedirectIdp extends _Base.Base {
  canRemediate() {
    return false;
  }

  getNextStep() {
    const {
      name,
      type,
      idp,
      href
    } = this.remediation;
    return {
      name,
      type,
      idp,
      href
    };
  }

}

exports.RedirectIdp = RedirectIdp;
//# sourceMappingURL=RedirectIdp.js.map