 function buildmakeSendElectronicTicket({
  registerFont,
  canvasLoader,
  imageLoader,
  barcodeWriter,
  path,
  moment
}) {
  return async function makeSendElectronicTicket(userInfo) {
   /*  const ticketImage = reservation.event
      ? await imageLoader(path.resolve(__dirname, "../../public/img/Ticket-Online-2.jpg"))
      : await imageLoader(path.resolve(__dirname, "../../public/img/Ticket-Abono-Online.jpg")) */

    const ticketImage =  await imageLoader(path.resolve(__dirname, "../../public/img/CARNET-DYNAMO.jpg"))

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
    // if (reservation.event) {
    //   // electronicTicket.fillText(`${reservation.event.title}`, 45, 280)
    // }
    //else {
    //  electronicTicket.fillText(`${reservation.seasonTicket.name}`, 1400, 170)
    //}
    /* electronicTicket.fillText(
      `${ticket.contactInfo.firstName} ${ticket.contactInfo.lastName}`,
      45,
      400
    ) */
    // electronicTicket.fillText(`${ticket.contactInfo.document}`, 828, 867)
    //if (reservation.event?.start) {
    //  const eventDate = getDate(reservation.event.start.date)
    //  electronicTicket.fillText(`${eventDate.date} ${eventDate.hour}`, 1480, 867)
    //}

    // electronicTicket.fillText(`${seatMapInfo.sector}`, 228, 1087)
    /* if (
      reservation.event?._id.toString() === "63e6acad82d1b5b95e1ae09c" ||
      reservation.event?._id.toString() === "63e698b30750d602fb1d4853"
    ) {
      electronicTicket.fillText(
        `${reservation.user.aditionalInfo?.category?.toUpperCase()}`,
        150,
        470
      )
    } else {
      electronicTicket.fillText(`${seatMapInfo.zone}`, 150, 470)
    }

    electronicTicket.fillText(`${seatMapInfo.section}`, 190, 520)

    electronicTicket.fillText(`${seatMapInfo.row}${seatMapInfo.table}`, 228, 570)
    electronicTicket.fillText(
      `${seatMapInfo.seat ? `${seatMapInfo.seat}${seatMapInfo.chair}` : "Libre"}`,
      190,
      620
    ) */
    // electronicTicket.fillText(`${ticket.ticketCode}`, 1480, 1307)

    // electronicTicket.fillText(`${reservation.seatMapInfo.zone}`,1480, 867);

    // electronicTicket.fillText(`${reservation.seatMapInfo.section}`,228, 1087);
    // electronicTicket.fillText(`${reservation.seatMapInfo.row}`,828, 1087);
    // electronicTicket.fillText(`${ticket.seatMapInfo.seatNumber}`,1480, 1087);
    /* if (reservation.event?.start) {
      const eventDate = getDate(reservation.event.start.date)
      electronicTicket.fillText(`${eventDate.date} ${eventDate.hour}`, 680, 470)
    }
    electronicTicket.fillText(`${seatMapInfo.gate ? seatMapInfo.gate : "Principal"}`, 680, 520)
    electronicTicket.fillText(`${ticket.ticketCode}`, 680, 570)

    if (reservation.event?.address) {
      electronicTicket.fillText(`${reservation.event.address.name}`, 160, 670)
    } else {
      electronicTicket.fillText(`${reservation.seasonTicket.events[0].address.name}`, 680, 470)
    } */
    //electronicTicket.fillStyle = "#fff"
    //electronicTicket.font = "70px Roboto"
    // electronicTicket.fillText(`Ticket Electrónico`,228, 520);

    /* const logo = await imageLoader(
      path.resolve(
        __dirname,
        `../../public/img/${
          reservation.event
            ? reservation.event.eventPlanner.code
            : reservation.seasonTicket.eventPlanner.code
        }.png`
      )
    )
    electronicTicket.fillStyle = "#fffs"
    electronicTicket.fillRect(600, 10, logo.width, logo.height)
    electronicTicket.drawImage(logo, 600, 10) */

    //texto
    electronicTicket.font = "50px Roboto"
    electronicTicket.fillText(`${userInfo.firstName.charAt(0).toUpperCase() + userInfo.firstName.slice(1)}`, 940, 665)
    electronicTicket.fillText(`${userInfo.lastName.charAt(0).toUpperCase() + userInfo.lastName.slice(1)}`, 940, 755)
    electronicTicket.fillText(`${new Date(userInfo?.birthDate).toLocaleDateString("es-VE")}`, 940, 920)

    electronicTicket.font = "30px Roboto"

    // electronicTicket.fillText(`ID: ${userInfo._id.toString()}`, 50, 1280)

    //qr
    const QRcode = await makeQr(barcodeWriter, userInfo._id.toString())
    const pp = await imageLoader(QRcode)
    // electronicTicket.fillRect(250, 740, pp.width, pp.height)
    electronicTicket.drawImage(pp, 1490, 100)

    return Object.freeze({
      toBuffer: async () => canvas.toBuffer("image/jpeg")
    })
  }

  async function makeQr(barcodeWriter, text) {
    const info = {
      bcid: "qrcode",
      text: text,
      height: 70,
      width: 70
    }
    const buffer = await new Promise((resolve, reject) => {
      barcodeWriter.toBuffer(info, (err, png) => (!err ? resolve(png) : reject(err)))
    })
    //console.log(buffer.toString("base64"))
    //image.append(buffer.toString('base64'))*/

    return buffer
  }

  function getDate(eventDate) {
    const date = moment(eventDate).format("DD-MM-YYYY")
    const hour = moment(eventDate).format("HH:mm")

    return {
      date,
      hour: formatAMPM(hour)
    }
  }

  function formatAMPM(hour) {
    const hourFormat = hour.split(":")

    let hours = parseInt(hourFormat[0])
    let minutes = parseInt(hourFormat[1])
    const ampm = hours >= 12 ? "PM" : "AM"

    hours %= 12
    hours = hours || 12
    minutes = minutes < 10 ? `0${minutes}` : minutes
    hours = hours < 10 ? `0${hours}` : hours
    const strTime = `${hours}:${minutes} ${ampm}`

    return strTime
  }
}


module.exports = buildmakeSendElectronicTicket