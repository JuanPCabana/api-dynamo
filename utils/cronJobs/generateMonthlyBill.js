const cron = require('node-cron')
const userStore = require('../../components/user/store')
const orderController = require('../../components/order/controller')
const userController = require('../../components/user/controller')
const sendMailService = require('../mailer')

const day = new Date().getDate()
const month = new Date().getMonth() + 1
const nextMonth = new Date().getMonth() + 2

const today = `${day}/${month}`
const nextPayment = `${day}/${nextMonth}`


const todayUserList = async () => { return await userStore.list() }

const generateBills = cron.schedule(' 58 11 7 * *', async () => {
    const list = await todayUserList()
    list.map(async (user) => {
        console.log("🚀 ~ list", user.email)
        let auxUser = user.toObject()

        orderController.add({ ammount: user?.membership?._id.toString() ?? '63c56873019597f1d03b24e2', user: auxUser._id })

        userController.replace(auxUser._id, { nextPaymentDate: nextPayment/* , active: false */ })

        // await sendMailService.sendMailNewBill(user.email, user)

    })

    console.log('------------------------------------------------------------ TODAY BILLS GENERATED ------------------------------------------------------------');
});

module.exports = generateBills