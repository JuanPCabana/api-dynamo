 function makeAttachmentDownload({ makeFile }) {
  return async function attachmentDownload({ idCard/* s */, dataCallback, endCallback }) {
    return await new Promise(async function(resolve, reject) {
      const file = new makeFile({ size: [2000, 1295], margin: 0, bufferPages: true })

      file.on("data", dataCallback)
      file.on("end", endCallback)

      /* for (const [i, idCard] of idCards.entries()) {
        // PDF by default comes with a first page created
        if (i != 0) {
          file.addPage({ size: [1046, 1814], margin: 0 })
        } */
        // file.addPage({ size: [2000, 1295], margin: 0 })
        file.image(await idCard.toBuffer())
    /*   } */
      file.end()
    })
  }
}

module.exports = makeAttachmentDownload