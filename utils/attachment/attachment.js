function makeAttachment({ makeFile, streamEncoder }) {
  return async function attachment(electronicTickets) {
    return await new Promise(async function(resolve, reject) {
      const file = new makeFile({ size: [1046, 1814], margin: 0 })

      let fileBase64 = ""

      file
        .pipe(new streamEncoder())
        .on("data", (chunk) => {
          fileBase64 += chunk
        })
        .on("end", (end) => {
          resolve(fileBase64)
        })

      for (const [i, electronicTicket] of electronicTickets.entries()) {
        // PDF by default comes with a first page created
        if (i != 0) {
          file.addPage({ size: [1046, 1814], margin: 0 })
        }
        file.image(await electronicTicket.toBuffer())
      }
      file.end()
    })
  }
}

module.exports  =  makeAttachment         

