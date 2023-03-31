const METHODS = {
    VES: "Pagomovil",
    ZELLE: "Zelle",
    CASH: "Efectivo",
    CORT: 'Exonerado'

}

const getPaymentMethod = (method) => {
    return METHODS[method]
}

module.exports = getPaymentMethod