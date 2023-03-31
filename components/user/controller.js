const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const sendMailService = require('../../utils/mailer')
const { makeToken } = require('../../utils/helpers/makeToken')
const { s3Uploadv2 } = require('../../awsS3')
const orderController = require('../../components/order/controller')
const documentStore = require('../documents/store')
const { default: mongoose } = require('mongoose')

const addUser = async ({
    email,
    username,
    password,
    firstName,
    lastName,
    birthDate,
    height,
    weight,
    document,
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

    if (!exist) {
        const existUser = await store.findByUsernameOrEmail(username)
        if (existUser) {
            return Promise.reject(boom.badRequest('El correo o nombre de usuario ya existe!'))
        }
    }
    else {
        return Promise.reject(boom.badRequest('El correo o nombre de usuario ya existe!'))
    }
    if (role === 'admin') {
        return Promise.reject(boom.unauthorized())

    }

    const day = new Date().getDate()
    const nextMonth = new Date().getMonth() + 2

    const nextPayment = `${day}/${nextMonth}`

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
        document,
        league: league,
        category: category,
        position: position,
        phone: phone,
        gender: gender,
        nextPaymentDate: nextPayment,
        token,
        membership,
        newStudent: true,
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

        listToClient = userList.docs.map((user) => {
            // console.log("🚀 ~ file: controller.js:91 ~ listToClient=userList.map ~ user:", user)
            // const aux = user.toObject()
            // delete aux.password
            delete user.password
            return user
            // return aux
        })


        return resolve({ docs: listToClient, totalDocs: userList.totalDocs })
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
    // console.log("🚀 ~ file: controller.js:122 ~ updateUser ~ body:", body)

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


const addAvatar = async (tokenUser, file, userId) => {


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
    const updateId = userId ? userId : tokenUser

    return store.userModify(updateId, { avatar: response.Location })

}

const enroleStudent = async (user, paymentInfo, oldStudent, tokenUser) => {
    const existentUser = await store.findByEmail(user.email)

    let userId

    if (!existentUser?._id) {
        user.password = '123456'
        const userInfo = await addUser(user)
        userId = userInfo._id.toString()
        await replaceUser(userId, { active: false, verifiedEmail: true, newStudent: false })

    }
    else {
        userId = existentUser._id.toString()
        await replaceUser(userId, { ...user, active: false, verifiedEmail: true, newStudent: false })
    }


    if (!oldStudent) {
        const newOrder = await orderController.inscription({ ammount: paymentInfo.bill, user: userId }, tokenUser.sub)
        const orderId = newOrder._id.toString()

        const payment = await orderController.addPayment({ order: orderId, ...paymentInfo }, true)

        // await orderController.generate({ id: userId })
        return payment
    }
    else {
        const newOrder = await orderController.inscription({ ammount: paymentInfo.bill, user: userId }, tokenUser.sub)
        const orderId = newOrder._id.toString()

        const payment = await orderController.addPayment({ order: orderId, method: 'CORT', ref: 'Estudiante antiguo', email: ' ' }, true)


        const response = await store.findById(userId, false)
        // await orderController.generate({ id: userId })
        const finalResponse = response.toObject()
        delete finalResponse.password
        return payment
    }
}

const changePassword = async (tokenUser, body) => {
    return new Promise(async (resolve, reject) => {
        if (!tokenUser) return reject(boom.unauthorized('Token Invalido!'))
        const user = await store.findById(tokenUser, false)
        const auxUser = user.toObject()

        const isMatch = await bcrypt.compare(body.password, auxUser.password)
        if (!isMatch) {
            return reject(boom.unauthorized(''))
        }
        const passwordHashed = await bcrypt.hash(body.newPassword, 10)

        const updatedUser = replaceUser(auxUser._id, { password: passwordHashed })

        return resolve(auxUser)
    })
}

const deleteUser = ({ id }) => {

    return new Promise(async (resolve, reject) => {
        const validId = mongoose.Types.ObjectId.isValid(id)
        if (!validId) return reject(boom.badRequest('Id inválido!'))
        if (!id) return reject(boom.badRequest('Id inválido!'))
        await orderController.multiDelete(id)
        await documentStore.multiDelete(id)
        const deletedUser = await store.delete(id)

        if (!deletedUser) return reject(boom.badRequest('Usuario no encontrado!'))

        return resolve(deletedUser)

    })

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
    enrole: enroleStudent,
    changePass: changePassword,
    delete: deleteUser
}