const Model = require('./model')

const addOrder = async (order) => {
    const myOrder = new Model(order);
    return await myOrder.save()
}

const listAllOrders = (query) => {
    if (query.status) {
        return Model.find({ status: query.status }).populate([{ path: 'user' }, { path: 'ammount' }])
    }
    return Model.find({}).populate([{ path: 'user' }, { path: 'ammount' }])

}
const listUserOrders = (id, query) => {

    if (query) {
        let filter = { user: id, status: query }
        return Model.find(filter).populate([{ path: 'user' }, { path: 'ammount' }])
    }

    let filter = { user: id }
    return Model.find(filter).populate([{ path: 'user' }, { path: 'ammount' }])

}

const getOrderInfo = (id) => {
    let filter = { _id: id }
    return Model.findOne(filter)

}

const updateOrder = (Id, newProp) => {
    let filter = { _id: Id }
    return Model.updateOne(filter, { $set: { ...newProp } })
}

module.exports = {
    add: addOrder,
    listAll: listAllOrders,
    list: listUserOrders,
    getOrderInfo,
    update: updateOrder
}