const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const now = require('../../utils/helpers/now')
const userController = require('../user/controller')
const userStore = require('../user/store')
const sendMailService = require('../../utils/mailer')
const getPaymentMethod = require('../../utils/helpers/getPaymentMethod')

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
        delete auxOrder.user.password

        await store.update(auxOrder._id, { payment: paymentInfo, status: 'pending' })

        await sendMailService.sendMailPaymentPendingAdmin(auxOrder.user.email, `${auxOrder.user.firstName} ${auxOrder.user.lastName}`, auxOrder.payment.ref, getPaymentMethod(method))

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

        delete auxOrder.user.password

        // console.log(auxOrder.user)
        await store.update(auxOrder._id, { status: status })

        if (status === 'approved') {
            await userStore.userModify(auxOrder.user, { active: true })
            await sendMailService.sendMailPaymentApproved(auxOrder.user.email, `${auxOrder?.user?.firstName} ${auxOrder?.user?.lastName}`, auxOrder?.payment?.ref)
        }
        if (status === 'rejected') {
            await sendMailService.sendMailPaymentRejected(auxOrder.user.email, `${auxOrder?.user?.firstName} ${auxOrder?.user?.lastName}`, auxOrder?.payment?.ref)
        }
        if (status === 'pending') {
            await sendMailService.sendMailPaymentPending(auxOrder.user.email, `${auxOrder?.user?.firstName} ${auxOrder?.user?.lastName}`, auxOrder?.payment?.ref)
        }

        return resolve(auxOrder)

    })
}

const listAllOrders = (query) => {

    return new Promise(async (resolve, reject) => {
        const orderList = await store.listAll(query)

        const response = orderList.map((order) => {
            const auxOrder = order.toObject()
            delete auxOrder.user.password
            return auxOrder
        })


        return resolve(response)
    })

}


const listUserOrders = (body, tokenUser) => {
    return new Promise(async (resolve, reject) => {

        if (body.user && tokenUser.role === 'student') {
            return reject(boom.badRequest('Id invalido'))
        }

        const userOrderList = await store.list(body.user? body.user : tokenUser.sub, body.status)

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