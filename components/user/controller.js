const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const sendMailService = require('../../utils/mailer')
const { makeToken } = require('../../utils/helpers/makeToken')
const { s3Uploadv2 } = require('../../awsS3')
const orderController = require('../../components/order/controller')

const addUser = async ({
    email,
    username,
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
    membership,
    role,
    parent
}) => {

    if (!email) {
        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }
    const exist = await store.findByUsernameOrEmail(email)

    if (exist) {
        return Promise.reject(boom.badRequest('El correo o nombre de usuario ya existe!'))

    }
    if (role === 'admin') {
        return Promise.reject(boom.unauthorized())

    }

    const paswordHashed = await bcrypt.hash(password, 10)
    const token = makeToken()

    const user = {
        email: email.toLowerCase().trim(),
        username: username.toLowerCase().trim(),
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
        token,
        membership,
        newStudent: newStudent,
        parent,
        role: role
    }
    const userInfo = await store.add(user)

    await sendMailService.sendMailConfirmAccount(email, `${firstName} ${lastName}`, token.value, userInfo._id)
    return Promise.resolve(userInfo)

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
    console.log("🚀 ~ file: controller.js:122 ~ updateUser ~ body:", body)

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

        if (!queryResponse?.token) {
            return reject(boom.badRequest("Token Invalido"))
        }

        if (queryResponse?.token?.value !== token) {
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

        if (!userId) {
            return reject(boom.badRequest("Usuario no encontrado o estado invalido"))
        }

        const { _doc: user } = await store.findById(userId)
        if (!user) {
            return reject("Usuario no encontrado")
        }
        user.active = newStatus
        const response = await store.replace(user)



        return resolve(user)
    })

}

const replaceUser = async (id, newProps) => {

    const user = await store.findById(id, true)
    let auxUser = user.toObject()
    const newUser = {
        ...auxUser,
        ...newProps
    }
    await store.replace(newUser)
    return newUser

}

const changeMembership = async ({ id, price }) => {
    const newProps = { membership: price }
    const user = await store.findById(id, true)
    let auxUser = user.toObject()
    const newUser = {
        ...auxUser,
        ...newProps
    }
    await store.replace(newUser)
    return newUser

}


const addAvatar = async (tokenUser, file) => {


    if (!file || !tokenUser) {
        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }

    var extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
    var fileName = Date.now() + extension

    const response = await s3Uploadv2(file, fileName)

    /* const userData = await userStore.findById(tokenUser, false)
    const auxUser = userData.toObject()
    auxUser.avatar = response.Location
 */
    return store.userModify(tokenUser, { avatar: response.Location })

}

const enroleStudent = async (user, paymentInfo, oldStudent, tokenUser) => {
    const existentUser = await store.findByEmail(user.email)

    let userId

    if (!existentUser?._id) {
        user.password = '123456'
        const userInfo = await addUser(user)
        userId = userInfo._id.toString()
        await replaceUser(userId, { active: true, verifiedEmail: true, newStudent: false })

    }
    else {
        userId = existentUser._id.toString()
        await replaceUser(userId, { ...user, active: true, verifiedEmail: true, newStudent: false })
    }


    if (!oldStudent) {
        const newOrder = await orderController.inscription({ ammount: paymentInfo.bill, user: userId }, tokenUser.sub)
        const orderId = newOrder._id.toString()

        const payment = await orderController.addPayment({ order: orderId, ...paymentInfo }, true)

        return payment
    }
    else{
        const response = await store.findById(userId, false)
        const finalResponse = response.toObject()
        delete finalResponse.password
        return finalResponse
    }
}

module.exports = {
    add: addUser,
    list: listUsers,
    get: getUser,
    update: updateUser,
    getById: getUserById,
    validate: validateUser,
    statusChange: changeUserStatus,
    replace: replaceUser,
    addAvatar,
    changeMembership,
    enrole: enroleStudent
}