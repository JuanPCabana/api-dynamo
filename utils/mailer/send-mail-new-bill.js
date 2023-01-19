module.exports = function makeSendMailNewBill({
  serverMail,
  domParser,
  fs,
  path,
}) {
  return async function sendMailnewBill(
    email,
    
  ) {
    const htmlTemplate = await getEmailTemplate();
    const buildEmailTemplate = buildEmailBodyTemplate({
      htmlTemplate,
      
    });
    const info = await serverMail.sendMail({
      from: '"Test" <juanpc3399@gmail.com>',
      to: email,
      subject: "Nueva Factura Generada",
      html: buildEmailTemplate,
    });
    console.log("Message sent: %s", info.messageId);
  };
  async function getEmailTemplate() {
    const requestFile = await new Promise((resolve, reject) =>
      fs.readFile(
        path.resolve(__dirname,"../../files/new-bill.html"),
        "utf8",
        (err, content) => (err ? reject(err) : resolve(content))
      )
    );
    return requestFile;
  }
  function buildEmailBodyTemplate({
    htmlTemplate,
    
  }) {
    const dom = domParser.load(htmlTemplate);
    
    return dom.html();
  }
}
