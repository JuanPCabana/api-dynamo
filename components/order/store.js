const Model = require('./model')

const addOrder = async (order) => {
    const myOrder = new Model(order);
    return await myOrder.save()
}

const listAllOrders = () => {
   
    return Model.find({})

}
const listUserOrders = (id) => {
    let filter = { user: id }
    return Model.find(filter).populate('user')

}

module.exports = {
    add: addOrder,
    listAll: listAllOrders,
    list: listUserOrders
}