import buildmakeSendElectronicTicket from "./electronic-ticket"
import buildmakeSendElectronicTicketOffice from "./electronic-ticket-office"
import { registerFont, createCanvas, loadImage } from "canvas"
import bwipjs from "bwip-js"
import path from "path"
import moment from "moment"
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
export default makeElectronicTicket

export { makeSendElectronicTicketOffice }
