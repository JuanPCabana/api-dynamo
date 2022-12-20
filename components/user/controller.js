const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')

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

    const paswordHashed = await bcrypt.hash(password, 10)

    const user = {
        email,
        additionalEmail,
        password: paswordHashed,
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
    }

    return store.add(user)

}

const listUsers = ({ id, email, newUsers }) => {

    return new Promise(async (resolve, reject) => {
        const userList = await store.list(id, email, newUsers)

        listToClient = userList.map((user)=>{
            const aux = user.toObject()
            delete aux.password
            return aux
        })

        return resolve(listToClient)
    })

}

const getUser = (userId) => {

    return new Promise(async (resolve, reject) => {

        if(!userId){
            return reject(boom.badRequest('Token invalido'))
        }

        const userList = await store.findByToken(userId)

        return resolve(userList)
    })

}

const updateUser = (body) => {

    return new Promise(async (resolve, reject) => {

        if(!body.id){
            return reject(boom.badRequest('Usuario no encontrado'))
        }

        const userList = await store.update(body)

        return resolve(userList)
    })

}


module.exports = {
    add: addUser,
    list: listUsers,
    get: getUser,
    update: updateUser
}