 function makeAttachmentDownloadOffice({ makeFile }) {
  return async function attachmentDownloadOffice({ electronicTickets, dataCallback, endCallback }) {
    return await new Promise(async function(resolve, reject) {
      const file = new makeFile({ size: [886, 2055], margin: 0, bufferPages: true })

      file.on("data", dataCallback)
      file.on("end", endCallback)

      for (const [i, electronicTicket] of electronicTickets.entries()) {
        // PDF by default comes with a first page created
        if (i != 0) {
          file.addPage({ size: [886, 2055], margin: 0 })
        }
        file.image(await electronicTicket.toBuffer())
      }
      file.end()
    })
  }
}

module.exports = makeAttachmentDownloadOffice
