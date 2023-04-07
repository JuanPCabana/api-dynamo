const Model = require('./model')

const addPrice = (price) => {
    const myPrice = new Model(price);
    return myPrice.save()
}

const listAllPrices = () => {

    return Model.findOne({})

}

const updatePrice = async (newPrice) => {
    return await Model.updateOne({}, { $set: { ammount: newPrice } })
}

module.exports = {
    add: addPrice,
    listAll: listAllPrices,
    update: updatePrice

}