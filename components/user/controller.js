const store = require('./store')


const addUser = (name) => {

    if (!name) {
        return Promise.reject('Invalid Name')
    }

    const user = {
        name
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