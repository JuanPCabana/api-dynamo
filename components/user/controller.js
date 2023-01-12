const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const sendMailService = require('../../utils/mailer')
const { makeToken } = require('../../utils/helpers/makeToken')

const addUser = async ({
    email,
    additionalEmail,
    password,
    firstName,
    lastName,
    birthDate,
    height,
    weight,
    league,
    category,
    position,
    phone,
    gender,
    newStudent,
    role
}) => {

    if (!email) {
        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }
    const exist = await store.findByEmail(email)

    if (exist) {
        return Promise.reject(boom.badRequest('El correo ya existe!'))

    }
    if (role === 'admin') {
        return Promise.reject(boom.unauthorized())

    }

    const paswordHashed = await bcrypt.hash(password, 10)
    const token = makeToken()

    const user = {
        email: email.toLowerCase().trim(),
        additionalEmail: additionalEmail.toLowerCase().trim(),
        password: paswordHashed,
        firstName: firstName.toLowerCase().trim(),
        lastName: lastName.toLowerCase().trim(),
        birthDate: birthDate,
        height: height,
        weight: weight,
        league: league,
        category: category,
        position: position,
        phone: phone,
        gender: gender,
        newStudent: newStudent,
        role: role
    }
    await sendMailService.sendMailConfirmAccount(email, `${firstName} ${lastName}`, token.value)

    return store.add(user)

}

const listUsers = ({ id, email, newUsers, query }) => {

    return new Promise(async (resolve, reject) => {
        const userList = await store.list(id, email, newUsers, query)

        listToClient = userList.map((user) => {
            const aux = user.toObject()
            delete aux.password
            return aux
        })


        return resolve(listToClient)
    })

}

const getUser = (userId) => {

    return new Promise(async (resolve, reject) => {

        if (!userId) {
            return reject(boom.badRequest('Token invalido'))
        }

        const userList = await store.findByToken(userId)

        return resolve(userList)
    })

}

const getUserById = (userId) => {

    return new Promise(async (resolve, reject) => {

        if (!userId) {
            return reject(boom.badRequest('Usuario invalido'))
        }

        const userList = await store.findById(userId)
        let userInfo = userList.toObject()
        delete userInfo.password
        return resolve(userInfo)
    })

}

const updateUser = (body) => {

    return new Promise(async (resolve, reject) => {

        if (!body._id) {
            return reject(boom.badRequest('Usuario no encontrado'))
        }

        const userList = await store.update(body)

        return resolve(userList)
    })

}

const validateUser = (user, token) => {

    return new Promise(async (resolve, reject) => {

        if (!token) {
            return reject(boom.badRequest('Token Invalido'))
        }

        const queryResponse = await store.validate(user, token)

        if (!queryResponse.token) {
            return reject(boom.badRequest("Token Invalido"))
        }

        if (queryResponse.token.value !== token) {
            return reject(boom.badRequest('Token Invalido'))
        }

        const auxResponse = queryResponse.toObject()
        delete auxResponse.token

        const finalResponse = await store.update(auxResponse, true)

        return resolve(finalResponse)
    })

}

const changeUserStatus = (userId, newStatus) => {

    return new Promise(async (resolve, reject) => {

        if (!userId || !newStatus) {
            return reject(boom.badRequest('Usuario no encontrado o estado invalido'))
        }
        

        const {_doc:user} = await store.findById(userId)
        user.active = newStatus
        const response = await store.replace(user)
        console.log("🚀 ~ file: controller.js:165 ~ returnnewPromise ~ user", user)
        console.log("🚀 ~ file: controller.js:165 ~ returnnewPromise ~ user", response)


        return resolve(user)
    })

}


module.exports = {
    add: addUser,
    list: listUsers,
    get: getUser,
    update: updateUser,
    getById: getUserById,
    validate: validateUser,
    statusChange: changeUserStatus
}