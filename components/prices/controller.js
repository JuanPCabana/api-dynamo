const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const now = require('../../utils/helpers/now')

const addPrice = async ({ ammount, name }) => {

   if (!ammount || !name) return Promise.reject(boom.badRequest("Datos Invalidos"))

    const price = {
        ammount,
        name
    }

    return store.add(price)

}

const listAllPrices = () => {

    return new Promise(async (resolve, reject) => {
        const priceList = await store.listAll()

        return resolve(priceList)
    })

}





module.exports = {
    add: addPrice,
    listAll: listAllPrices,
}