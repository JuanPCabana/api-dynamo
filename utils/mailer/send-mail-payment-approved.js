module.exports = function makeSendMailPaymentApproved({
  serverMail,
  domParser,
  fs,
  path,
}) {
  return async function sendMailPaymentApproved(
    email,
    name,
    ref,
    
  ) {
    const htmlTemplate = await getEmailTemplate();
    const buildEmailTemplate = buildEmailBodyTemplate({
      htmlTemplate,
      name,
      ref,
      
    });
    const info = await serverMail.sendMail({
      from: `"Dynamo" <account@back9.com.ve>`,
      to: email,
      subject: "Pago aprobado",
      html: buildEmailTemplate,
    });
    console.log("Message sent: %s", info.messageId);
  };
  async function getEmailTemplate() {
    const requestFile = await new Promise((resolve, reject) =>
      fs.readFile(
        path.resolve(__dirname,"../../files/payment-approved.htm"),
        "utf8",
        (err, content) => (err ? reject(err) : resolve(content))
      )
    );
    return requestFile;
  }
  function buildEmailBodyTemplate({
    htmlTemplate,
    ref,
    name
  }) {
    
    const dom = domParser.load(htmlTemplate);
    dom('#refNumber').text(ref)
    dom('#name').text(name)
    return dom.html();
  }
}