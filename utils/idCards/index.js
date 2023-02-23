const userStore = require('../../components/user/store')
const boom = require('@hapi/boom')

const getElectronicTicket = require("../electronic-ticket")


async function getElectronicTickets({ userId, dataCallback, endCallback } = {}) {


        if (!userId) return Promise.reject(boom.badRequest('Usuario invalido'))

        let userInfo = await userStore.findById(userId)

        if (!userInfo) return Promise.reject(boom.badRequest('Usuario invalido'))


        return await getElectronicTicket({ userInfo, dataCallback, endCallback })
    

}

const ticketsServices = Object.freeze({

    getElectronicTickets,

})

module.exports = ticketsServices
