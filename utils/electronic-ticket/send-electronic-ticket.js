 function makeSendElectronicTicket({
  makeElectronicTicket,
  attachment,
  sendMailService,
  seatMapInfoForTicket
}) {
  return async function sendElectronicTicket({
    tickets,
    reservation,
    email,
    additionalsAttachment
  } = {}) {
    const electronicTickets = []
    // Use for because foreach ignores async/await
    for (let ticket of tickets) {
      let seatMapInfo = await seatMapInfoForTicket(
        reservation.event
          ? reservation.event.seatMap
          : reservation.seasonTicket.seatMapInfo.seatMap,
        ticket.seatMapInfo
      )
      electronicTickets.push(await makeElectronicTicket(ticket, reservation, seatMapInfo))
    }
    const attachmentPDF = await attachment(electronicTickets)

    return await sendMailService.sendMailElectronicTickets(
      email ? email : reservation.user.email,
      attachmentPDF,
      additionalsAttachment
    )
  }
}

module.exports = makeSendElectronicTicket