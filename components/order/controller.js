const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const now = require('../../utils/helpers/now')
const userController = require('../user/controller')
const userStore = require('../user/store')
const sendMailService = require('../../utils/mailer')
const getPaymentMethod = require('../../utils/helpers/getPaymentMethod')
const { default: mongoose } = require('mongoose')

const addOrder = async ({ ammount, user }, date) => {

    if (!user) return Promise.reject(boom.badRequest("Usuario Invalido"))
    if (!ammount) return Promise.reject(boom.badRequest("Monto Invalido"))

    const order = {
        ammount,
        user,
        date: now(date ? date : false)
    }

    const day = new Date().getDate()
    const month = new Date().getMonth() + 2

    const paymentDay = `${day}/${month}`

    const response = await store.add(order)

    // await userController.replace(user, { newPaymentDate: paymentDay })


    const freeMemberships = ['63ed213530a02a7af27f43b5', '63ff64c08bacc93143433d97']

    if (freeMemberships.includes(response.ammount.toString())) {
        await changeOrderStatus({ order: response._id.toString(), status: 'approved' }, false, true)
    }
    return response

}

const addPayment = ({ order, method, ref, ammount, email }, inscription) => {
    return new Promise(async (resolve, reject) => {

        if (!method || !ref ||/*  !ammount || */ !order) {
            return reject(boom.badRequest('Datos incompletos'))
        }
        const validId = mongoose.isValidObjectId(order)
        if (!validId) reject(boom.badRequest('Id Invalido!'))

        const orderInfo = await store.getOrderInfo(order)

        const auxOrder = orderInfo.toObject()

        paymentInfo = method === 'ZELLE' || method === 'VES' ? {
            date: now(),
            method,
            ref,
            // ammount,
            email
        }
            :
            {
                date: now(),
                method,
                ref,
                // ammount
            }
        auxOrder.payment = paymentInfo
        auxOrder.status = 'pending'
        delete auxOrder.user.password

        await store.update(auxOrder._id, { payment: paymentInfo, status: 'pending' })
        if (auxOrder.user.email) {
            await sendMailService.sendMailPaymentPendingAdmin(auxOrder.user.email, `${auxOrder.user.firstName} ${auxOrder.user.lastName}`, auxOrder.payment.ref, getPaymentMethod(method))
        }
        else {
            const info = await serverMail.sendMail({
                from: `"Dynamo" <administracion@dynamopuertofc.com>`,
                to: 'juanpc3399@gmail.com',
                subject: "ERROR CON ESTE CORREO",
                html: buildEmailTemplate
            })
        }
        return resolve(auxOrder)

    })
}

const changeOrderStatus = ({ order, status }, user, system) => {
    // console.log("🚀 ~ file: controller.js:74 ~ changeOrderStatus ~ user", user)
    return new Promise(async (resolve, reject) => {

        if (!order || !status /* || !user */) {
            return reject(boom.badRequest('Datos incompletos'))
        }

        const orderInfo = await store.getOrderInfo(order)

        const auxOrder = orderInfo.toObject()

        auxOrder.status = status
        auxOrder.managedBy = system ? '63abaf4dcc68af5e79c2e84d' : user.sub

        delete auxOrder.user.password

        // console.log(auxOrder.user)
        await store.update(auxOrder._id, { status: status, managedBy: system ? '63abaf4dcc68af5e79c2e84d' : user.sub })
        if (!auxOrder.user.email) {
            const info = await serverMail.sendMail({
                from: `"Dynamo" <administracion@dynamopuertofc.com>`,
                to: 'juanpc3399@gmail.com',
                subject: "ERROR CON ESTE CORREO",
                html: buildEmailTemplate
            })
            return reject(boom.badRequest('Error en el servidor de correos'))
        }
        if (status === 'approved') {
            if (!auxOrder.inscription) {
                await userStore.userModify(auxOrder.user, { active: true, status: 'active' })
            }
            else {
                await userStore.userModify(auxOrder.user, { active: true, status: 'active' })
                await generateOrder({ id: auxOrder.user._id.toString() }, user.sub)
            }

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
        const response = await store.listAll(query)

        return resolve(response)
    })

}


const listUserOrders = (body, tokenUser) => {
    return new Promise(async (resolve, reject) => {

        if (body.user && tokenUser.role === 'student') {
            return reject(boom.badRequest('Id invalido'))
        }

        const response = await store.list(body.user ? body.user : tokenUser.sub, body.status)

        /*   const response = userOrderList.map((order) => {
              const auxOrder = order.toObject()
              delete auxOrder.user.password
              return auxOrder
          })
   */
        return resolve(response)
    })

}

const inscriptionOrder = async ({ ammount, user }, userId) => {

    if (!user) return Promise.reject(boom.badRequest("Usuario Invalido"))
    if (!ammount) return Promise.reject(boom.badRequest("Monto Invalido"))

    const order = {
        ammount,
        user,
        inscription: true,
        managedBy: userId,
        date: now()
    }

    const response = await store.add(order)

    return response

}

const generateOrder = async ({ id, date }, tokenUser) => {

    const day = new Date().getDate()
    const nextMonth = new Date().getMonth() + 2

    const nextPayment = `${day}/${nextMonth}`
    console.log("🚀 ~ file: controller.js:186 ~ generateOrder ~ id:", id)

    return new Promise(async (resolve, reject) => {
        if (!id) return reject(boom.badRequest('Usuario invalido!'))

        const user = await userStore.findById(id, false)


        let auxUser = user.toObject()

        const response = addOrder({ ammount: user?.membership?._id.toString() ?? '63c56873019597f1d03b24e2', user: auxUser._id }, date)

        // await userController.replace(auxUser._id, { nextPaymentDate: nextPayment/* , active: false */ })

        await sendMailService.sendMailNewBill(user.email, user)

        resolve(response)

    })
}

const multiDelete = async (id) => {

    const deletedDocs = await store.multiDelete(id)
    return deletedDocs
}

const getOrder = async (id) => {
    return new Promise(async (resolve, reject) => {
        if (!id) return reject(boom.badRequest('Usuario invalido!'))
        const validId = mongoose.isValidObjectId(id)
        if (!validId) return reject(boom.badRequest('Id invalildo!'))
        const order = await store.getOrderInfo(id)
        if (!order) return reject(boom.badRequest('Orden no encontrada!'))
        return resolve(order)
    })
}

const updatePrice = async (orderId, newPrice) => {

    const validId = mongoose.Types.ObjectId.isValid(orderId)
    if (!validId) return Promise.reject(boom.badRequest('Id invalido!'))
    const orderInfo = await store.getOrderInfo(orderId)
    if (orderInfo.status === 'approved' || orderInfo.status === 'rejected') return Promise.reject(boom.badRequest('No se puede editar una orden aprobada o rechazada!'))
    const returnProduct = await store.updatePrice(orderId, newPrice)
    if (!returnProduct) return Promise.reject(boom.badRequest('Orden no encontrada!'))
    return returnProduct

}

const deleteOrder = ({ id }) => {

    return new Promise(async (resolve, reject) => {
        const validId = mongoose.Types.ObjectId.isValid(id)
        if (!validId) return reject(boom.badRequest('Id inválido!'))
        if (!id) return reject(boom.badRequest('Id inválido!'))
        const deletedOrder = await store.delete(id)

        if (!deletedOrder) return reject(boom.badRequest('Usuario no encontrado!'))

        return resolve(deletedOrder)

    })

}

module.exports = {
    add: addOrder,
    inscription: inscriptionOrder,
    addPayment,
    listAll: listAllOrders,
    list: listUserOrders,
    updateStatus: changeOrderStatus,
    generate: generateOrder,
    multiDelete,
    getOrder,
    update: updatePrice,
    delete: deleteOrder
}