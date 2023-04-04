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
    const errorTemplate = await getErrorTemplate();
    const buildEmailTemplate = buildEmailBodyTemplate({
      htmlTemplate,
    });

    const buildErrorTemplate = buildEmailBodyTemplate({
      errorTemplate,
      user
    })

    try {
      const info = await serverMail.sendMail({
        from: `"Dynamo" <dynamo@back9.com.ve>`,
        to: email,
        subject: "Nueva Factura Generada",
        html: buildEmailTemplate,
      });
      console.log("Message sent: %s", info.messageId);
    } 
    catch (error) {
      const info = await serverMail.sendMail({
        from: `"Dynamo" <dynamo@back9.com.ve>`,
        to: 'juanpc3399@gmail.com',
        subject: "usuario con error",
        html: buildErrorTemplate,
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
  async function getErrorTemplate() {
    const requestFile = await new Promise((resolve, reject) =>
      fs.readFile(
        path.resolve(__dirname, "../../files/errorlogger.html"),
        "utf8",
        (err, content) => (err ? reject(err) : resolve(content))
      )
    );
    return requestFile;
  }
  function buildEmailBodyTemplate({
    htmlTemplate,
    errorTemplate,
    user

  }) {
    if (htmlTemplate) {
      const dom = domParser.load(htmlTemplate);

      return dom.html();
    }
    else {
      const dom = domParser.load(errorTemplate);
      dom("#message").text(`${user}`);

      return dom.html();
    }
  }
}
