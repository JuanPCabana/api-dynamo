const attachment = require("../attachment")  
const { attachmentDownload, attachmentDownloadOffice } = require("../attachment") 
const {makeElectronicTicket} = require("../../components/electronic-ticket")
const { makeSendElectronicTicketOffice } = require("../../components/electronic-ticket") 
const sendMailService = require("../mailer") 
const makeSendElectronicTicket = require("./send-electronic-ticket") 
const makeGetElectronicTicket = require("./get-electronic-ticket") 



const getElectronicTicket = makeGetElectronicTicket({
  attachmentDownload,
  makeElectronicTicket,
  
})

module.exports = getElectronicTicket