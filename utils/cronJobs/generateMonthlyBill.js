const cron = require('node-cron')
const userStore = require('../../components/user/store')
const orderController = require('../../components/order/controller')
const userController = require('../../components/user/controller')

const day = new Date().getDate()
const month = new Date().getMonth() + 1
const nextMonth = new Date().getMonth() + 2

const today = `${day}/${month}`
const nextPayment = `${day}/${nextMonth}`


const todayUserList = async () => { return await userStore.getToday(today) }

const generateBills = cron.schedule('30 10 * * *', async () => {
    const list = await todayUserList()
    console.log("🚀 ~ file: generateMonthlyBill.js:18 ~ generateBills ~ list", list)
    list.map((user) => {
        let auxUser = user.toObject()

        orderController.add({ ammount: '63c56873019597f1d03b24e2', user: auxUser._id })

        userController.replace(auxUser._id, { nextPaymentDate: nextPayment })

    })

    console.log('------------------------------------------------------------ TODAY BILLS GENERATED ------------------------------------------------------------');
});

module.exports = generateBills