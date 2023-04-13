const userStore = require('../../user/store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const sendMailService = require('../../../utils/mailer/index')
const { makeToken } = require('../../../utils/helpers/makeToken')
const OrderModel = require('../../order/model')
const orderStore = require('../../order/store')
const userController = require('../../user/controller')
const orderController = require('../../order/controller')
const UserModel = require('../../user/model')


const verifyDebts = async () => {
    const todayUserList = async () => { return await OrderModel.find({}).populate([{ path: 'user' }]) }
    const day = new Date().getDate()
    const month = new Date().getMonth() + 1
    const nextMonth = new Date().getMonth() + 2
    const prevMonth = new Date().getMonth()

    return new Promise(async (resolve, reject) => {

        const list = await todayUserList()

        const expiredOrderList = []
        const errors = []
        const debtors = []
        //list.map(order => {
        for (order of list) {
            const orderDate = new Date(order.date).getMonth() + 1
            if (/* order._id.toString() === '64075f08f38f0b6c96d24243'  */ orderDate === prevMonth && order.status === 'unpaid' && order.inscription === false) {
                if (!order.user) {
                    errors.push(order)
                }
                else {
                    console.log("🚀 ~ file: expireBills.js:25 ~ expireBills ~ date:", order, prevMonth, orderDate)
                    orderStore.orderModify(order._id, { expired: true })
                    userController.replace(order.user._id, { status: 'debtor' })

                    expiredOrderList.push(order)
                }

            }
        }
        resolve({ errores: errors, expiredOrders: expiredOrderList, totalExpiredOrders: expiredOrderList.length })

    })
}

const generateMonthlyBills = async () => {
    const day = new Date().getDate()
    const month = new Date().getMonth() + 1
    const nextMonth = new Date().getMonth() + 2

    const today = `${day}/${month}`
    const nextPayment = `${day}/${nextMonth}`


    const todayUserList = async () => {
        return await UserModel.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'orders'
                }
            },
            {
                $match: {
                    "orders.date": {
                        $not: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        }
                    },
                    role: 'student'
                }
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    orders: 1
                }
            }
        ])
    }

    return new Promise(async (resolve, reject) => {

        const list = await todayUserList()
        // list.map(async (user) => {
        const ordersGenerated = []
        for (user of list) {
            if (user.status === 'active' || user.status === 'debtor' /* user._id.toString() === '641b759db70ef007f3117856' */) {
                console.log("🚀 ~ list", user.email)
                // let auxUser = user.toObject()

                orderController.add({ ammount: user?.membership?._id.toString() ?? '63c56873019597f1d03b24e2', user: user._id })

                // userController.replace(auxUser._id, { nextPaymentDate: nextPayment/* , active: false */ })

                await sendMailService.sendMailNewBill(user.email, user)
                ordersGenerated.push(user)
            }
        }
        return resolve({
            message: 'Ordenes del presente mes generadas',
            totalOrdersGenerated: ordersGenerated.length
        })

    })
}

module.exports = {
    verifyDebts,
    generateMonthlyBills
}