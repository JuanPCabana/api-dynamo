const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')

const addLeague = async ({
    code,
    name,
    categories
}) => {

    if (!code || !name || !categories) {
        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }

    const league = {
        code,
        name,
        categories
    }

    return store.add(league)

}

const listAllLeagues = () => {

    return new Promise(async (resolve, reject) => {
        const paymentList = await store.listAll()

        return resolve(paymentList)
    })

}


const getLeague = (id) => {
    return new Promise(async (resolve, reject) => {

        if (!id) {
            return reject(boom.badRequest('Id invalido'))
        }

        const userList = await store.get(id)

        return resolve(userList)
    })

}


module.exports = {
    add: addLeague,
    listAll: listAllLeagues,
    get: getLeague
}