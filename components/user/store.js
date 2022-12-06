const Model = require('./model')

const addUser = (user) => {
    const myUser = new Model(user);
    return myUser.save()
}

const listUsers = (id, email) => {
    let filter = {}
    if (id) {
        filter = {
            $or: [
                { _id: id },
                { email: email }
            ]
        }
    }

    return Model.find(filter)

}
const getUserByEmail = (email) => {
    let filter = {}
    if (email) {
        filter = { email: email }
    }

    return Model.findOne(filter)

}
const getByToken = (userId) => {
    let filter = { _id: userId }

    return Model.findOne(filter).populate('league')

}

module.exports = {
    add: addUser,
    list: listUsers,
    findByEmail: getUserByEmail,
    findByToken: getByToken
}