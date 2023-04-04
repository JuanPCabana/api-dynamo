const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const now = require('../../utils/helpers/now')

const addPrice = async ({ ammount }) => {

    if (!ammount) return Promise.reject(boom.badRequest("Monto Invalido"))

    const price = {
        ammount
    }

    return store.add(price)

}

const listAllPrices = () => {

    return new Promise(async (resolve, reject) => {
        const priceList = await store.listAll()

        return resolve(priceList)
    })

}

const updatePrice = async (newPrice) => {

    return await store.update(newPrice)

}



module.exports = {
    add: addPrice,
    getPrice: listAllPrices,
    update: updatePrice
}