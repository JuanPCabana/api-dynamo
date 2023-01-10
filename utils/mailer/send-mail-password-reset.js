module.exports = function makeSendMailPasswordReset({
    serverMail,
    domParser,
    fs,
    path
  }) {
    return async function sendMailPasswordReset(email, token) {
      const htmlTemplate = await getEmailTemplate();
      const buildEmailTemplate = buildEmailBodyTemplate({
        htmlTemplate,
        token
      });
      const info = await serverMail.sendMail({
        from: '"Test" <juanpc3399@gmail.com>',
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
    function buildEmailBodyTemplate({ htmlTemplate, token }) {
      const dom = domParser.load(htmlTemplate);
      dom("#token").text(token);
      return dom.html();
    }
  }
  