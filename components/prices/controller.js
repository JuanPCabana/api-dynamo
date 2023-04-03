const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const now = require('../../utils/helpers/now')
const { default: mongoose } = require('mongoose')

const addPrice = async ({ ammount, name, inscription }) => {

    if (!ammount) return Promise.reject(boom.badRequest("Monto Invalido"))
    if (!name) return Promise.reject(boom.badRequest("Nombre Invalido"))

    const price = {
        ammount,
        inscription,
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

const updatePrice = async (id, newProps) => {

    const validId = mongoose.Types.ObjectId.isValid(id)
    if (!validId) return Promise.reject(boom.badRequest('Id invalido!'))
    const returnProduct = await store.update(id, newProps)
    if (!returnProduct) return Promise.reject(boom.badRequest('Producto no encontrado!'))
    return returnProduct

}

const deletePrice = async (id) => {

    const validId = mongoose.Types.ObjectId.isValid(id)
    if (!validId) return Promise.reject(boom.badRequest('Id invalido!'))
    const returnProduct = await store.delete(id)
    if (!returnProduct) return Promise.reject(boom.badRequest('Producto no encontrado!'))
    return returnProduct

}

const getOnePrice = async (id) =>{
    const validId = mongoose.Types.ObjectId.isValid(id)
    if (!validId) return Promise.reject(boom.badRequest('Id invalido!'))
    const returnProduct = await store.getOne(id)
    if (!returnProduct) return Promise.reject(boom.badRequest('Producto no encontrado!'))
    return returnProduct
}


module.exports = {
    add: addPrice,
    listAll: listAllPrices,
    update: updatePrice,
    delete: deletePrice,
    getOne:getOnePrice
}