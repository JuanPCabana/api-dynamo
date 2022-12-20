const Model = require('./model')

const addUser = (user) => {
    const myUser = new Model(user);
    return myUser.save()
}

const listUsers = (id, email, newUsers) => {
    let filter = {}
    if (newUsers) {

        filter = { newStudent: true }
    }
    else {

        filter = { role: 'student', newStudent: false }

        /*  filter = {
             $or: [
                 { _id: id },
                 { email: email }
             ]
         } */
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

const updateInfo = async (body) => {
    let filter = { _id: body.id }

    let result = Model.updateOne({ _id: body.id }, {
        $set: {
            ...body,
            role: "student",
            newStudent: false
        }
    })
    console.log("🚀 ~ file: store.js:54 ~ updateInfo ~ result", result)

    return result


}

module.exports = {
    add: addUser,
    list: listUsers,
    findByEmail: getUserByEmail,
    findByToken: getByToken,
    update: updateInfo
}