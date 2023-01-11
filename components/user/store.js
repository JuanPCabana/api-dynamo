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
        filter = { email: email.toLowerCase() }
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

const updateInfo = async (body, verification) => {

    if (verification) {
        let result = Model.replaceOne({ _id: body._id }, { ...body, verifiedEmail: true })

        return result
    }

    let filter = { _id: body.id }

    let result = Model.updateOne({ _id: body._id }, {
        $set: {
            ...body,
            role: "student",
            newStudent: false
        }
    })
    return result
}

const replaceObject = (body) => {
    let result = Model.replaceOne({ _id: body._id }, { ...body })

    return result
}

const validateUser = async (user, token) => {
    let filter = { _id: user }
    let result = Model.findOne(filter)

    return result
}

module.exports = {
    add: addUser,
    list: listUsers,
    findByEmail: getUserByEmail,
    findById: getUserById,
    findByToken: getByToken,
    update: updateInfo,
    validate: validateUser,
    replace: replaceObject
}