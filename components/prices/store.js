const Model = require('./model')
const userModel = require('../user/model')

const addPrice = (price) => {
    const myPrice = new Model(price);
    return myPrice.save()
}

const listAllPrices = () => {

    return Model.find({})

}

const updatePrice = async (id, newProps) => {

    let filter = { _id: id }
    const result = await Model.updateOne(filter, { $set: { ...newProps } })
    return result

}

const deletePrice = async (id) => {

    let filter = { _id: id }

    const userList = await userModel.updateMany({ membership: id }, { $set: { membership: '63c56873019597f1d03b24e2' } })
    // console.log("🚀 ~ file: store.js:28 ~ deletePrice ~ userList:", userList)

    const result = await Model.findOneAndDelete(filter)
    return result

}

const getOnePrice = async (id) => {

    let filter = { _id: id }

    const priceInfo = await Model.findOne(filter)
    // console.log("🚀 ~ file: store.js:28 ~ deletePrice ~ userList:", userList)

    return priceInfo

}

module.exports = {
    add: addPrice,
    listAll: listAllPrices,
    update: updatePrice,
    delete: deletePrice,
    getOne: getOnePrice
}