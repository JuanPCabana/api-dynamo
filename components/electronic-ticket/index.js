const buildmakeSendElectronicTicket =require("./electronic-ticket") 
const buildmakeSendElectronicTicketOffice =require("./electronic-ticket-office") 
const { registerFont, createCanvas, loadImage } =require("canvas") 
const bwipjs =require("bwip-js") 
const path =require("path") 
const moment =require("moment") 

const makeElectronicTicket = buildmakeSendElectronicTicket({
  registerFont: registerFont,
  canvasLoader: createCanvas,
  imageLoader: loadImage,
  barcodeWriter: bwipjs,
  path: path,
  moment
})

const makeSendElectronicTicketOffice = buildmakeSendElectronicTicketOffice({
  registerFont: registerFont,
  canvasLoader: createCanvas,
  imageLoader: loadImage,
  barcodeWriter: bwipjs,
  path: path,
  moment
})

module.exports = {makeElectronicTicket, makeSendElectronicTicketOffice }
