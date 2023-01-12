const userStore = require('../../user/store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const sendMailService = require('../../../utils/mailer/index')
const { makeToken } = require('../../../utils/helpers/makeToken')

const generateRecoverToken = async (userEmail) => {


    return new Promise(async (resolve, reject) => {
        const userData = await userStore.findByEmail(userEmail)

        if (!userData) {
            return reject(boom.badRequest('Email invalido'))
        }

        const token = makeToken()

        const userWithToken = { ...userData._doc, token }

        const response = await userStore.replace(userWithToken)

        sendMailService.sendMailPasswordReset(userWithToken.email, token.value)

        return resolve(response)


    })

}

const resetPassword = async (userId, token, password) => {


    return new Promise(async (resolve, reject) => {
        const userData = await userStore.findById(userId)
        const userObject = userData._doc

        if(!userObject.token){
            return reject(boom.badRequest('Token invalido'))
        }

        if (userObject.token.value !== token) {
            return reject(boom.badRequest('Token invalido'))
        }


        const passwordHashed = await bcrypt.hash(password, 10)
        
        delete userObject.token

        const updatedUser = {...userObject, password: passwordHashed}

        const response = await userStore.replace(updatedUser)


        return resolve(response)


    })

}

module.exports = {
    recoverToken: generateRecoverToken,
    reset: resetPassword
}