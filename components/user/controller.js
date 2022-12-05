const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')

const addUser = async ({
    email,
    additionalEmail,
    password,
    name,
    birthDate,
    height,
    weight,
    league,
    category,
    position,
    phone,
    username,
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
        name,
        birthDate,
        height,
        weight,
        league,
        category,
        position,
        phone,
        username,
        role
    }

    return store.add(user)

}

const listUsers = ({ id, email }) => {

    return new Promise(async (resolve, reject) => {
        const userList = await store.list(id, email)

        return resolve(userList)
    })

}


module.exports = {
    add: addUser,
    list: listUsers
}