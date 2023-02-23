function buildmakeSendElectronicTicketOffice({
  registerFont,
  canvasLoader,
  imageLoader,
  barcodeWriter,
  path
}) {
  return async function makeSendElectronicTicketOffice(ticket, reservation, seatMapInfo) {
    const ticketImage = await imageLoader(
      path.resolve(__dirname, "../../public/img/ELECTORNIC-TICKET-OFFICE.jpg")
    )
    registerFont(path.resolve(__dirname, "../../files/Roboto-Bold.ttf"), {
      family: "Roboto"
    })

    // Make the canvas the same size as the image
    const canvas = canvasLoader(ticketImage.width, ticketImage.height)

    let electronicTicket = canvas.getContext("2d")
    electronicTicket.font = "50px Roboto"

    // Fill the canvas with the Boarding Pass image
    electronicTicket.drawImage(ticketImage, 0, 0)
    electronicTicket.font = "50px Roboto"

    electronicTicket.fillText(`${seatMapInfo.sector}`, 130, 620)
    electronicTicket.fillText(`${seatMapInfo.zone}`, 525, 620)
    //electronicTicket.fillText(`${seatMapInfo.section}`, 200, 1087)

    electronicTicket.fillText(`${seatMapInfo.row}`, 130, 740)
    electronicTicket.fillText(`${seatMapInfo.seat ? seatMapInfo.seat : "Libre"}`, 525, 740)

    electronicTicket.fillStyle = "#fff"
    electronicTicket.font = "70px Roboto"
    //electronicTicket.fillText(`Ticket Electrónico`,228, 520);

    const logo = await imageLoader(
      path.resolve(
        __dirname,
        `../../public/img/${reservation.event
          ? reservation.event.eventPlanner.code
          : reservation.seasonTicket.eventPlanner.code
        }.png`
      )
    )
    electronicTicket.fillStyle = "#fffs"
    electronicTicket.fillRect(150, 140, logo.width, logo.height)
    electronicTicket.drawImage(logo, 150, 140)
    const QRcode = await makeQr(barcodeWriter, ticket.ticketCode)
    const pp = await imageLoader(QRcode)
    electronicTicket.fillRect(260, 820, pp.width, pp.height)
    electronicTicket.drawImage(pp, 260, 820)

    return Object.freeze({
      toBuffer: async () => canvas.toBuffer("image/jpeg")
    })
  }

  async function makeQr(barcodeWriter, text) {
    const info = {
      bcid: "qrcode",
      text: text,
      height: 65,
      width: 65
    }
    const buffer = await new Promise((resolve, reject) => {
      barcodeWriter.toBuffer(info, (err, png) => (!err ? resolve(png) : reject(err)))
    })
    //console.log(buffer.toString("base64"))
    //image.append(buffer.toString('base64'))*/

    return buffer
  }
}


module.exports = buildmakeSendElectronicTicketOffice