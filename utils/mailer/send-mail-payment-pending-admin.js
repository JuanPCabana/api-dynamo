module.exports = function makeSendMailPaymentPendingAdmin({ serverMail, domParser, fs, path }) {
  return async function sendMailPaymentPendingAdmin(name, order, products) {
    const htmlTemplate = await getEmailTemplate()
    const buildEmailTemplate = buildEmailBodyTemplate({
      htmlTemplate,
      name,
      order,
      products
    })
    const info = await serverMail.sendMail({
      from: '"Test" <juanpc3399@gmail.com>',
      to: "cusicalivegerencia@gmail.com",
      subject: "Nuevo pago en proceso",
      html: buildEmailTemplate
    })
    console.log("Message sent: %s", info.messageId)
  }
  async function getEmailTemplate() {
    const requestFile = await new Promise((resolve, reject) =>
      fs.readFile(
        path.resolve(__dirname, "../../files/payment-pending-admin.html"),
        "utf8",
        (err, content) => (err ? reject(err) : resolve(content))
      )
    )
    return requestFile
  }
  function buildEmailBodyTemplate({ htmlTemplate, products, order, name }) {
    const currency = order.currency === "USD" ? "$" : "BS"
    const dom = domParser.load(htmlTemplate)
    dom("#ref").text(`${order.payment.ref}`)
    dom("#method").text(`${order.payment.type}`.toLocaleUpperCase())
    dom("#amount").text(`${currency} ${order.amount}`)
    dom("#currency").text(currency)
    dom("#name").text(`${name}`)
    let domProductsInfo = dom("#productInfo")
    dom(domProductsInfo).remove()
    let domTotalAmountContainer = dom("#totalAmountTr")
    dom(domTotalAmountContainer).remove()
    products.forEach((product) => {
      let domProduct = domProductsInfo.clone()
      dom("#productQuantity", domProduct).text(`${product.quantity}`)
      dom("#productName", domProduct).text(`${product.name}`)
      dom("#productPrice", domProduct).text(`${currency} ${product.price}`)
      dom("#products").append(domProduct)
    })
    dom("#products").append(domTotalAmountContainer)
    return dom.html()
  }
}
