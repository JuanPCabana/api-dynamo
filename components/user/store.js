const Model = require('./model')

const addUser = (user) => {
    const myUser = new Model(user);
    return myUser.save()
}

const listUsers = (id) => {
    let filter = {}
    if (id) {
        filter = { _id: id }
    }

    return Model.find(filter)

}

module.exports = {
    add: addUser,
    list: listUsers
}