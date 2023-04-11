const deleteOrderPassword = (orderList) => {
    const response = orderList.map((order) => {
        const auxOrder = order.toObject()
        delete auxOrder?.user?.password
        if (auxOrder) return auxOrder
        else return

    })
    return response
}

module.exports = {
    deleteOrderPassword
}