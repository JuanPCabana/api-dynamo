module.exports = function makeSendMailPasswordReset({
    serverMail,
    domParser,
    fs,
    path
  }) {
    return async function sendMailPasswordReset(email, token, id) {
      const htmlTemplate = await getEmailTemplate();
      const buildEmailTemplate = buildEmailBodyTemplate({
        htmlTemplate,
        token,
        id
      });
      const info = await serverMail.sendMail({
        from: `"Dynamo" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Restablecer contraseña",
        html: buildEmailTemplate
      });
      console.log("Message sent: %s", info.messageId);
    };
    async function getEmailTemplate() {
      const requestFile = await new Promise((resolve, reject) =>
        fs.readFile(
          path.resolve(__dirname,"../../files/reset-password.html"),
          "utf8",
          (err, content) => (err ? reject(err) : resolve(content))
        )
      );
      return requestFile;
    }
    function buildEmailBodyTemplate({ htmlTemplate, token, id }) {
      const dom = domParser.load(htmlTemplate);
      dom("#token").text(token);
      dom("#link").attr("href", `https://dynamotest.vercel.app/nueva_contrasena?token=${token}&id=${id}`)
      dom("#link").text(`https://dynamotest.vercel.app/nueva_contrasena?token=${token}&id=${id}`)
      return dom.html();
    }
  }
  