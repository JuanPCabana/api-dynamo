const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')

const addLeague = async ({
    code,
    name,

}) => {

    if (!code || !name) {
        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }

    const league = {
        code,
        name
    }

    return store.add(league)

}
const addCategory = async ({ categories, league }) => {

    if (categories.length === 0) {
        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }


    return new Promise(async (resolve, reject) => {
        const response = await store.addCategory(categories, league)
        /* const response = await categories.map(async (category) => {
            const auxCategory = { ...category, league }
            return await store.addCategory(auxCategory)
        })
        console.log("🚀 ~ file: controller.js:34 ~ categories.map ~ response", response) */
        return resolve(response)
    })

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
    get: getLeague,
    addCategory
}