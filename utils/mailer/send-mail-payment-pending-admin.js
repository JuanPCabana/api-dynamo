module.exports = function makeSendMailPaymentPendingAdmin({
  serverMail,
  domParser,
  fs,
  path,
}) {
  return async function sendMailPaymentPendingAdmin(
    email,
    name,
    ref,
    method
  ) {
    const htmlTemplate = await getEmailTemplate();
    const buildEmailTemplate = buildEmailBodyTemplate({
      htmlTemplate,
      email,
      name,
      ref,
      method
    });
    const info = await serverMail.sendMail({
      from: `"Dynamo" <account@back9.com.ve>`,
      to: process.env.SMTP_USER,
      subject: "Nuevo pago registrado",
      html: buildEmailTemplate,
    });
    console.log("Message sent: %s", info.messageId);
  };
  async function getEmailTemplate() {
    const requestFile = await new Promise((resolve, reject) =>
      fs.readFile(
        path.resolve(__dirname, "../../files/payment-pending-admin.html"),
        "utf8",
        (err, content) => (err ? reject(err) : resolve(content))
      )
    );
    return requestFile;
  }
  function buildEmailBodyTemplate({
    htmlTemplate,
    ref,
    name,
    email,
    method
  }) {

    const dom = domParser.load(htmlTemplate);
    dom('#refNumber').text(ref)
    dom('#name').text(name)
    dom('#email').text(email)
    dom('#method').text(method)
    return dom.html();
  }
}