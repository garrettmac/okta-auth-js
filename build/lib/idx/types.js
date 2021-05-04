export var IdxStatus;
(function (IdxStatus) {
    IdxStatus[IdxStatus["SUCCESS"] = 0] = "SUCCESS";
    IdxStatus[IdxStatus["PENDING"] = 1] = "PENDING";
    IdxStatus[IdxStatus["FAILED"] = 2] = "FAILED";
})(IdxStatus || (IdxStatus = {}));
export function isRawIdxResponse(obj) {
    return obj && obj.version;
}
