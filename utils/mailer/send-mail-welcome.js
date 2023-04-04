module.exports = function makeSendMailWelcome({ serverMail, domParser, fs, path }) {
  return async function sendMailWelcome(email, name, /* pin, */ password) {
    const htmlTemplate = await getEmailTemplate()
    const buildEmailTemplate = buildEmailBodyTemplate({
      htmlTemplate,
      email,
      name,
      /* pin, */
      password
    })
    const info = await serverMail.sendMail({
      from: `"Dynamo" <dynamo@back9.com.ve>`,
      to: email,
      subject: "Bienvenido a Dynamo",
      html: buildEmailTemplate
    })
    console.log("Message sent: %s", info.messageId)
  }
  async function getEmailTemplate() {
    const requestFile = await new Promise((resolve, reject) =>
      fs.readFile(path.resolve(__dirname, "../../files/welcome.html"), "utf8", (err, content) =>
        err ? reject(err) : resolve(content)
      )
    )
    return requestFile
  }
  function buildEmailBodyTemplate({ htmlTemplate, email, name, /* pin, */ password }) {
    const dom = domParser.load(htmlTemplate)
    dom("#name").text(`${name}`)
    dom("#email").text(`${email}`.toLocaleLowerCase())
    /* dom("#pin").text(pin) */
    if (!password) {
      dom("#passwordContainer").remove()
    } else {
      dom("#password").text(password)
    }
    return dom.html()
  }
}
