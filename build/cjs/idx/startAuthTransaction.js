"use strict";

exports.startAuthTransaction = startAuthTransaction;

var _tx = require("../tx");

var _interact = require("./interact");

async function startAuthTransaction(authClient, options) {
  const {
    meta
  } = await (0, _interact.interact)(authClient, options);
  const authTransaction = new _tx.AuthTransaction(authClient, meta);
  return authTransaction;
}
//# sourceMappingURL=startAuthTransaction.js.map