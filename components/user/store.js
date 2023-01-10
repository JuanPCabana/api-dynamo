const Model = require('./model')

const addUser = (user) => {
    const myUser = new Model(user);
    return myUser.save()
}

const listUsers = (id, email, newUsers, query) => {
    let filter = {}
    if (newUsers) {

        filter = { newStudent: true }
    }
    else {

        filter = { role: 'student', newStudent: false }

        if (query) {
            filter = {
                role: 'student',
                $or: [
                    { firstName: { $regex: '^' + query, $options: "i" } },
                    { lastName: { $regex: '^' + query, $options: "i" } },
                    { email: { $regex: '^' + query, $options: 'i' } },
                    { additionalEmail: { $regex: '^' + query, $options: 'i' } }
                ]
                
            }
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
const getUserById = (id) => {
    let filter = {}
    if (id) {
        filter = { _id: id }
    }
    else {
        return Promise.reject('Id invalido')
    }

    return Model.findOne(filter).populate("league")

}
const getByToken = (userId) => {
    let filter = { _id: userId }

    return Model.findOne(filter).populate('league')

}

const updateInfo = async (body) => {
    let filter = { _id: body.id }

    let result = Model.updateOne({ _id: body._id }, {
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
    findById: getUserById,
    findByToken: getByToken,
    update: updateInfo
}