function statusSuccess(ret = {}) {
  return {
    data: ret,
    status: "SUCCESS",
  };
}

function statusFail(reason) {
  return {
    data: ret,
    status: "FAILED",
    message: reason,
  };
}

module.exports = {
  statusSuccess,
  statusFail,
};
