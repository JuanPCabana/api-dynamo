const moment = require("moment");

function now(date) {
  if (date) {
    return moment(date).format("YYYY-MM-DDTHH:mm:ss");
  }
  return moment().format("YYYY-MM-DDTHH:mm:ss");
}

module.exports = now
