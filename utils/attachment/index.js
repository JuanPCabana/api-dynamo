const makeAttachment = require("./attachment") 
const makeAttachmentDownload = require("./attachment-download") 
const makeAttachmentDownloadOffice = require("./Attachment-download-office") 
const PDFKit = require("pdfkit") 
const { Base64Encode } = require("base64-stream") 

const attachment = makeAttachment({
  makeFile: PDFKit,
  streamEncoder: Base64Encode
})

const attachmentDownload = makeAttachmentDownload({
  makeFile: PDFKit
})

const attachmentDownloadOffice = makeAttachmentDownloadOffice({
  makeFile: PDFKit
})

module.exports = { attachmentDownload, attachmentDownloadOffice, attachment }

