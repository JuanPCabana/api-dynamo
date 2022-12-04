const store = require('./store')
const bcrypt = require('bcrypt')


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
    username
}) => {

    if (!email) {
        return Promise.reject('Invalid Name')
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
        username
    }

    return store.add(user)
}

const listUsers = (id) => {

    return new Promise(async (resolve, reject) => {
        const userList = await store.list(id)

        return resolve(userList)
    })

}


module.exports = {
    add: addUser,
    list: listUsers
}