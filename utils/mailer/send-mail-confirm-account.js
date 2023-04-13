module.exports = function makeSendMailConfirmAccount({
  serverMail,
  domParser,
  fs,
  path
}) {
  return async function sendMailConfirmAccount(email, name, token, id) {
    console.log(email);
    const htmlTemplate = await getEmailTemplate();
    const buildEmailTemplate = buildEmailBodyTemplate({
      htmlTemplate,
      token,
      email,
      name,
      id
    });
    if (email) {
      const info = await serverMail.sendMail({
        from: `"Dynamo" <administracion@dynamopuertofc.com>`,
        to: email,
        subject: "Confirma tu cuenta",
        html: buildEmailTemplate
      });
    }
    else {
      const info = await serverMail.sendMail({
        from: `"Dynamo" <administracion@dynamopuertofc.com>`,
        to: 'juanpc3399@gmail.com',
        subject: "ERROR CON ESTE CORREO",
        html: buildEmailTemplate
      })
    }
  };
  async function getEmailTemplate() {
    const requestFile = await new Promise((resolve, reject) =>
      fs.readFile(
        path.resolve(__dirname, "../../files/acount.html"),
        "utf8",
        (err, content) => (err ? reject(err) : resolve(content))
      )
    );
    return requestFile;
  }
  function buildEmailBodyTemplate({ htmlTemplate, token, email, name, id }) {
    const dom = domParser.load(htmlTemplate);
    dom("#name").text(`${name}`)
    dom("#tokenId").text(`${token}`)
    dom("#email").text(`${email}`.toLocaleLowerCase())
    dom("#link").attr("href", `https://dynamofc.vercel.app/confirmar_correo?token=${token}&id=${id}`)
    return dom.html();
  }
}
