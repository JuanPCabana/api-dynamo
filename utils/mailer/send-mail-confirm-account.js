module.exports = function makeSendMailConfirmAccount({
  serverMail,
  domParser,
  fs,
  path
}) {
  return async function sendMailConfirmAccount(email, name, token) {
    const htmlTemplate = await getEmailTemplate();
    const buildEmailTemplate = buildEmailBodyTemplate({
      htmlTemplate,
      token,
      email, 
      name,
    });
    const info = await serverMail.sendMail({
      from: '"Test" <juanpc3399@gmail.com>',
      to: email,
      subject: "Confirma tu cuenta",
      html: buildEmailTemplate
    });
    console.log("Message sent: %s", info.messageId);
  };
  async function getEmailTemplate() {
    const requestFile = await new Promise((resolve, reject) =>
      fs.readFile(
        path.resolve(__dirname,"../../files/acount.html"),
        "utf8",
        (err, content) => (err ? reject(err) : resolve(content))
      )
    );
    return requestFile;
  }
  function buildEmailBodyTemplate({ htmlTemplate, token, email, name }) {
    const dom = domParser.load(htmlTemplate);
    dom("#name").text(`${name}`)
    dom("#tokenId").text(`${token}`)
    dom("#email").text(`${email}`.toLocaleLowerCase())
    dom("#link").attr("href", `https://consumo.back9.com.ve/login?token=${token}`);
    return dom.html();
  }
}
