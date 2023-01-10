const cheerio = require("cheerio") 
const fs = require("fs") 
const path = require("path") 
const serverMail = require("./server-mail") 
const makeSendMailConfirmAccount = require("./send-mail-confirm-account") 
const makeSendMailPasswordReset = require("./send-mail-password-reset") 
const makeSendMailPaymentPending = require("./send-mail-payment-pending") 
const makeSendMailPaymentApproved = require("./send-mail-payment-approved") 
const makeSendMailNewPayment = require("./new-payment") 
const makeSendMailWelcome = require("./send-mail-welcome") 
const makeSendMailPaymentPendingAdmin = require("./send-mail-payment-pending-admin") 

const sendMailConfirmAccount = makeSendMailConfirmAccount({
  serverMail,
  domParser: cheerio,
  fs,
  path
})

const sendMailPasswordReset = makeSendMailPasswordReset({
  serverMail,
  domParser: cheerio,
  fs,
  path
})

const sendMailPaymentPending = makeSendMailPaymentPending({
  serverMail,
  domParser: cheerio,
  fs,
  path
})

const sendMailPaymentApproved = makeSendMailPaymentApproved({
  serverMail,
  domParser: cheerio,
  fs,
  path
})
const sendMailNewPayment = makeSendMailNewPayment({
  serverMail,
  domParser: cheerio,
  fs,
  path
})
const sendMailWelcome = makeSendMailWelcome({
  serverMail,
  domParser: cheerio,
  fs,
  path
})

const sendMailPaymentPendingAdmin = makeSendMailPaymentPendingAdmin({
  serverMail,
  domParser: cheerio,
  fs,
  path
})

const sendMailService = Object.freeze({
  sendMailConfirmAccount,
  sendMailPasswordReset,
  sendMailPaymentPending,
  sendMailPaymentApproved,
  sendMailNewPayment,
  sendMailWelcome,
  sendMailPaymentPendingAdmin
})

module.exports = sendMailService
