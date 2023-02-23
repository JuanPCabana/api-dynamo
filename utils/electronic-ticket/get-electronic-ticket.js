function makeGetElectronicTicket({
  makeElectronicTicket,
  attachmentDownload,
  
}) {
  return async function getElectronicTicket({
    userInfo,
    dataCallback,
    endCallback
  } = {}) {
    // Use for because foreach ignores async/await
    
      const idCard = await makeElectronicTicket(userInfo)
    
    const attachmentPDF = await attachmentDownload({ idCard, dataCallback, endCallback })
    return attachmentPDF
  }
}
module.exports = makeGetElectronicTicket
