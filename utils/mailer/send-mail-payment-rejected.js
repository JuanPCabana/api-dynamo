module.exports = function makeSendMailPaymentRejected({
  serverMail,
  domParser,
  fs,
  path,
}) {
  return async function sendMailPaymentRejected(
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
      from: `"Dynamo" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Pago rechazado",
      html: buildEmailTemplate,
    });
    console.log("Message sent: %s", info.messageId);
  };
  async function getEmailTemplate() {
    const requestFile = await new Promise((resolve, reject) =>
      fs.readFile(
        path.resolve(__dirname,"../../files/payment-rejected.htm"),
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