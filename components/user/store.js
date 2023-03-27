const Model = require('./model')

const addUser = (user) => {
    const myUser = new Model(user);
    return myUser.save()
}

const listUsers = async (id, email, newUsers, query) => {
    let filter = {}
    if (newUsers) {

        filter = { newStudent: true }
        if (query) {
            filter = {
                newStudent: true,
                $or: [
                    { firstName: { $regex: '^' + query, $options: "i" } },
                    { lastName: { $regex: '^' + query, $options: "i" } },
                    { email: { $regex: '^' + query, $options: 'i' } },
                    { username: { $regex: '^' + query, $options: 'i' } }
                ]
            }
        }

    }
    else {

        filter = { role: 'student' }

        if (query) {
            filter = {
                role: 'student',
                $or: [
                    { firstName: { $regex: '^' + query, $options: "i" } },
                    { lastName: { $regex: '^' + query, $options: "i" } },
                    { email: { $regex: '^' + query, $options: 'i' } },
                    { username: { $regex: '^' + query, $options: 'i' } }
                ]

            }
        }
    }

    // const test = await Model.aggregate([
    //     {
    //         '$lookup': {
    //             'from': 'orders',
    //             'localField': '_id',
    //             'foreignField': 'user',
    //             'as': 'orders'
    //         }
    //     }, {
    //         '$match': {
    //             'orders.status': 'unpaid'
    //         }
    //     }, {
    //         '$set': {
    //             'status': 'debtor'
    //         }
    //     }, {
    //         '$unset': 'orders'
    //     }
    // ])
    // console.log("🚀 ~ file: store.js:64 ~ listUsers ~ test:", test)

    // test.map(async user => {
    // await replaceObject(user)
    // })

    const resp = await Model.find(filter).populate([{ path: 'league' }, { path: 'category' }, { path: 'membership' }])

    return { docs: resp, totalDocs: resp.length } //await Model.find(filter).populate([{ path: 'league' }, { path: 'category' }, { path: 'membership' }])

}
const getUserByEmail = (email) => {
    let filter = {}
    if (email) {
        filter = { email: email.toLowerCase() }
    }

    return Model.findOne(filter).populate([{ path: 'league' }, { path: 'category' }])

}
const getUserById = (id, unpopulate) => {
    let filter = {}
    if (id) {
        filter = { _id: id }
    }
    else {
        return Promise.reject('Id invalido')
    }

    if (!unpopulate) {
        return Model.findOne(filter).populate([{ path: 'league' }, { path: 'category' }, { path: 'membership' }])
    }
    else {
        return Model.findOne(filter)
    }

}
const getByToken = (userId) => {
    let filter = { _id: userId }

    return Model.findOne(filter).populate([{ path: 'league' }, { path: 'category' }])

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
            // role: "student",
            newStudent: false
        }
    })
    return result
}

const replaceObject = async (body) => {
    let result = await Model.replaceOne({ _id: body._id.toString() }, { ...body })

    return result
}

const validateUser = async (user, token) => {
    let filter = { _id: user }
    let result = Model.findOne(filter)

    return result
}

const getTodayUsers = async (date) => {
    let filter = { nextPaymentDate: date }
    let result = await Model.find(filter)
    return result
}

const userModify = async (id, newProps) => {
    let filter = { _id: id }
    const result = await Model.updateOne(filter, { $set: { ...newProps } })
    return result
}

const findByUsernameOrEmail = async (query) => {

    const filter = {
        $or: [
            { email: query },
            { username: query }
        ]
    }



    return await Model.findOne(filter).populate([{ path: 'league' }, { path: 'category' }])

}

const removeUser = async (id) => {
    return await Model.findOneAndDelete({ _id: id })
}

module.exports = {
    add: addUser,
    list: listUsers,
    findByEmail: getUserByEmail,
    findById: getUserById,
    findByToken: getByToken,
    update: updateInfo,
    validate: validateUser,
    replace: replaceObject,
    getToday: getTodayUsers,
    userModify,
    findByUsernameOrEmail,
    delete: removeUser
}