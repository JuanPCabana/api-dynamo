const METHODS = {
    VES: "Pagomovil",
    ZELLE: "Zelle",
    CASH: "Efectivo"

}

const getPaymentMethod = (method) => {
    return METHODS[method]
}

module.exports = getPaymentMethod