module.exports = function makeSendMailNewBill({
  serverMail,
  domParser,
  fs,
  path,
}) {
  return async function sendMailnewBill(
    email, user

  ) {
    const htmlTemplate = await getEmailTemplate();
    const buildEmailTemplate = buildEmailBodyTemplate({
      htmlTemplate,

    });
    if (email) {
      const info = await serverMail.sendMail({
        from: `"Dynamo" <account@back9.com.ve>`,
        to: email,
        subject: "Nueva Factura Generada",
        html: buildEmailTemplate,
      });
      console.log("Message sent: %s", info.messageId);
    }
    else {
      const info = await serverMail.sendMail({
        from: `"Dynamo" <account@back9.com.ve>`,
        to: 'juanpc3399@gmail.com',
        subject: "usuario con error",
        html: <h1>
          {user}
        </h1>,
      });
      console.log("Message sent: %s", info.messageId);
    }
  };

  async function getEmailTemplate() {
    const requestFile = await new Promise((resolve, reject) =>
      fs.readFile(
        path.resolve(__dirname, "../../files/new-bill.html"),
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
