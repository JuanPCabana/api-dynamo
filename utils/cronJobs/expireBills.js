const cron = require('node-cron')
const userStore = require('../../components/user/store')
const orderStore = require('../../components/order/store')
const orderController = require('../../components/order/controller')
const userController = require('../../components/user/controller')
const OrderModel = require('../../components/order/model')
const sendMailService = require('../mailer')
const now = require('../helpers/now')

const day = new Date().getDate()
const month = new Date().getMonth() + 1
const nextMonth = new Date().getMonth() + 2
const prevMonth = new Date().getMonth()

const today = `${day}/${month}`
const nextPayment = `${day}/${nextMonth}`


const todayUserList = async () => { return await OrderModel.find({}).populate([{ path: 'user' }]) }

const expireBills = cron.schedule(' 0 0 1 1 1', async () => {
    /* const list = await todayUserList()

    const test = []
    //list.map(order => {
    for (order of list) {
        const orderDate = new Date(order.date).getMonth() + 1
        if (orderDate === prevMonth && order.status === 'unpaid' && order.inscription === false) {
            console.log("🚀 ~ file: expireBills.js:25 ~ expireBills ~ date:", order, prevMonth, orderDate)
            await orderStore.orderModify(order._id, { expired: true })
            await userController.replace(order.user._id, { status: 'debtor' })

        }
    }
 */
    //})
    /* list.map(async (user) => {
        console.log("🚀 ~ list", user.email)
        let auxUser = user.toObject()

        orderController.add({ ammount: user?.membership?._id.toString() ?? '63c56873019597f1d03b24e2', user: auxUser._id })

        userController.replace(auxUser._id, { nextPaymentDate: nextPayment })

        await sendMailService.sendMailNewBill(user.email, user)

    }) */

    console.log('------------------------------------------------------------ ExpiredBills updated ------------------------------------------------------------');
});

module.exports = expireBills