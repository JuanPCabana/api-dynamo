const { deleteOrderPassword } = require('../../utils/helpers/deleteListPassword');
const Model = require('./model')

const addOrder = async (order) => {
    const myOrder = new Model(order);
    return await myOrder.save()
}

const listAllOrders = async (query) => {
    if (query.status) {
        const orderList = await Model.find({ status: query.status }).populate([{ path: 'user' }, { path: 'ammount' }, { path: 'managedBy' }])
        const response = deleteOrderPassword(orderList)

        return {
            docs: response,
            totalDocs: orderList.length
        }

    }
    const orderList = await Model.find({}).populate([{ path: 'user' }, { path: 'ammount' }, { path: 'managedBy' }])
    const response = deleteOrderPassword(orderList)

    return {
        docs: response,
        totalDocs: orderList.length
    }
}
const listUserOrders = async (id, query) => {

    if (query) {
        let filter = { user: id, status: query }
        const orderList = await Model.find(filter).populate([{ path: 'user' }, { path: 'ammount' }])
        const response = deleteOrderPassword(orderList)
        return {
            docs: response,
            totalDocs: orderList.length
        }
    }

    let filter = { user: id }
    const orderList = await Model.find(filter).populate([{ path: 'user' }, { path: 'ammount' }])
    const response = deleteOrderPassword(orderList)

    return {
        docs: response,
        totalDocs: orderList.length
    }
}

const getOrderInfo = (id) => {
    let filter = { _id: id }
    return Model.findOne(filter).populate([{ path: 'user' }, { path: 'ammount' }])

}

const updateOrder = (Id, newProp) => {
    let filter = { _id: Id }
    return Model.updateOne(filter, { $set: { ...newProp } })
}

const multiDelete = async (id) => {

    const multiDeleted = await Model.deleteMany({ user: id })
    return multiDeleted
}

const updatePrice = async (orderId, newPrice) => {

    let filter = { _id: orderId }
    const result = await Model.findOneAndUpdate(filter, { $set: { ammount: newPrice } }).populate([{ path: 'user' }, { path: 'ammount' }, { path: 'managedBy' }])
    return result

}

const deleteOrder = async (id) => {
    let filter = { _id: id }
    const result = await Model.findOneAndDelete(filter)
    return result
}

module.exports = {
    add: addOrder,
    listAll: listAllOrders,
    list: listUserOrders,
    getOrderInfo,
    update: updateOrder,
    multiDelete,
    updatePrice,
    delete: deleteOrder
}