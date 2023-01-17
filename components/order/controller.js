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

const addPayment = ({ order, method, ref, ammount }) => {
    return new Promise(async (resolve, reject) => {

        if (!method || !ref || !ammount || !order) {
            return reject(boom.badRequest('Datos incompletos'))
        }

        const orderInfo = await store.getOrderInfo(order)

        const auxOrder = orderInfo.toObject()

        paymentInfo = {
            date: now(),
            method,
            ref,
            ammount
        }
        auxOrder.payment = paymentInfo
        auxOrder.status = 'pending'

        console.log(auxOrder)
        await store.update(auxOrder._id, { payment: paymentInfo, status: 'pending' })

        return resolve(auxOrder)

    })
}

const changeOrderStatus = ({ order, status }) => {
    return new Promise(async (resolve, reject) => {

        if (!order || !status) {
            return reject(boom.badRequest('Datos incompletos'))
        }

        const orderInfo = await store.getOrderInfo(order)

        const auxOrder = orderInfo.toObject()

        auxOrder.status = status

        console.log(auxOrder)
        await store.update(auxOrder._id, { status: status })

        return resolve(auxOrder)

    })
}

const listAllOrders = () => {

    return new Promise(async (resolve, reject) => {
        const orderList = await store.listAll()

        return resolve(orderList)
    })

}


const listUserOrders = (body) => {
    return new Promise(async (resolve, reject) => {

        if (!body.user) {
            return reject(boom.badRequest('Id invalido'))
        }

        const userOrderList = await store.list(body.user)

        const response = userOrderList.map((order) => {
            const auxOrder = order.toObject()
            delete auxOrder.user.password
            return auxOrder
        })

        return resolve(response)
    })

}


module.exports = {
    add: addOrder,
    addPayment,
    listAll: listAllOrders,
    list: listUserOrders,
    updateStatus: changeOrderStatus
}