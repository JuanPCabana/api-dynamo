module.exports = function makeSendMailNewPayment({
    serverMail,
    domParser,
    fs,
    path,
  }) {
    return async function sendMailNewPayment(
      email,
      product,
      ref,
      method,
      amount,
      currency,
      user
    ) {
      const htmlTemplate = await getEmailTemplate();
      const buildEmailTemplate = buildEmailBodyTemplate({
        htmlTemplate,
        product,
        ref,
        method,
        amount,
        currency,
        user
      });
      const info = await serverMail.sendMail({
        from: '"Beach Tennis Lecheria" <noreply@beachtennislecheria.com>"',
        to: "beachtennislecheria@gmail.com",
        subject: "Pago pendiente",
        html: buildEmailTemplate,
      });
      console.log("Message sent: %s", info.messageId);
    };
    async function getEmailTemplate() {
      const requestFile = await new Promise((resolve, reject) =>
        fs.readFile(
          path.resolve("./files/new-payment.html"),
          "utf8",
          (err, content) => (err ? reject(err) : resolve(content))
        )
      );
      return requestFile;
    }
    function buildEmailBodyTemplate({
      htmlTemplate,
      product,
      ref,
      method,
      amount,
      currency,
      user
    }) {
      const dom = domParser.load(htmlTemplate);
      dom("#user").text(user);
      dom("#product").text(product);
      dom("#ref").text(ref);
      dom("#method").text(method);
      dom("#amount").text(`${amount}`);
      dom("#currency").text(currency);
      return dom.html();
    }
  }
  