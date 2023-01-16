const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const now = require('../../utils/helpers/now')
const userController = require('../user/controller')

const addOrder = async ({ ammount, user }) => {

    if (!user) return Promise.reject(boom.badRequest("Usuario Invalido"))
    if (!ammount) return Promise.reject(boom.badRequest("Monto Invalido"))

    const order = {
        ammount,
        user,
        date: now()
    }

    const day = new Date().getDate()
    const month = new Date().getMonth() + 2

    const paymentDay = `${day}/${month}`

    const response = await store.add(order)

    await userController.replace(user, { newPaymentDate: paymentDay })


    return response

}

const listAllOrders = () => {

    return new Promise(async (resolve, reject) => {
        const orderList = await store.listAll()

        return resolve(orderList)
    })

}


const listUserOrders = (user) => {
    return new Promise(async (resolve, reject) => {

        if (!user.sub) {
            return reject(boom.badRequest('Id invalido'))
        }

        const userList = await store.list(user.sub)

        return resolve(userList)
    })

}


module.exports = {
    add: addOrder,
    listAll: listAllOrders,
    list: listUserOrders
}