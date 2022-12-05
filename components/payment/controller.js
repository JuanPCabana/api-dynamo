const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')

const addPayment = async ({
    method,
    ref,
    ammount
}, user) => {

    if (!method || !ref || !ammount || !user) {
        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }

    const payment = {
        method,
        ref,
        ammount,
        user
    }

    return store.add(payment)

}

const listAllPayments = () => {

    return new Promise(async (resolve, reject) => {
        const paymentList = await store.listAll()

        return resolve(paymentList)
    })

}


const listUserPayments = (user) => {
    return new Promise(async (resolve, reject) => {

        if(!user.sub){
            return reject(boom.badRequest('Id invalido'))
        }

        const userList = await store.list(user.sub)

        return resolve(userList)
    })

}


module.exports = {
    add: addPayment,
    listAll: listAllPayments,
    list: listUserPayments
}