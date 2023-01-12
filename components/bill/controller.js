const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const { default: now } = require('../../utils/helpers/now')

const addBill = async ({
    date,
    payment,
    ammount,
    user
}) => {

    if (!payment || !ammount || !user) {
        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }

    const bill = {
        date: date? now(date) : now(),
        payment,
        ammount,
        user
    }

    return store.add(bill)

}

const listAllBills = () => {

    return new Promise(async (resolve, reject) => {
        const paymentList = await store.listAll()

        return resolve(paymentList)
    })

}


const listUserBills = (user) => {
    return new Promise(async (resolve, reject) => {

        if (!user.sub) {
            return reject(boom.badRequest('Id invalido'))
        }

        const userList = await store.list(user.sub)

        return resolve(userList)
    })

}


module.exports = {
    add: addBill,
    listAll: listAllBills,
    list: listUserBills
}