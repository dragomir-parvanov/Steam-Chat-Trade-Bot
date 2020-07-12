/* eslint-disable no-var */
"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
process.on("message", function(message) {
  if (process.send) {
    var transaction = {
      transactionId: message.transactionId,
      message: "message from child proccess"
    };
    console.log("child process");
    process.send(transaction);
  } else {
    throw new Error();
  }
});
setInterval(function() {
  axios_1["default"].get("http://localhost:3000/");
}, 500);
