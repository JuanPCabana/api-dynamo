const { deleteOrderPassword } = require('../../utils/helpers/deleteListPassword');
const Model = require('./model')

const addOrder = async (order) => {
    const myOrder = new Model(order);
    return await myOrder.save()
}

const listAllOrders = async (query) => {
    // if (query.status) {
    // const orderList = await Model.find({ status: query.status }).populate([{ path: 'user' }, { path: 'ammount' }, { path: 'managedBy' }])

    let pipeline = []
    if (query.status) {
        pipeline.push({
            '$match': {
                'status': query.status
            }
        })
    }

    pipeline = [...pipeline,
    {
        '$lookup': {
            'from': 'users',
            'localField': 'user',
            'foreignField': '_id',
            'as': 'user'
        }
    }, {
        '$lookup': {
            'from': 'users',
            'localField': 'managedBy',
            'foreignField': '_id',
            'as': 'managedBy'
        }
    }, {
        '$lookup': {
            'from': 'prices',
            'localField': 'ammount',
            'foreignField': '_id',
            'as': 'ammount'
        }
    }, {
        '$unwind': {
            'path': '$user'
        }
    }, {
        '$unwind': {
            'path': '$ammount'
        }
    }, {
        '$unset': 'user.password'
    }, {
        '$unset': 'managedBy.password'
    }, {
        '$project': {
            '_id': '$_id',
            'status': '$status',
            'date': '$date',
            'inscription': '$inscription',
            'ammount': '$ammount',
            'user': '$user',
            'expired': '$expired',
            'payment': '$payment',
            'managedBy': '$managedBy',
            'paymentDate': {
                '$toDate': '$payment.date'
            }
        }
    }, {
        '$sort': {
            'paymentDate': -1
        }
    }
    ]

    const orderedOrderList = await Model.aggregate(pipeline)
    // console.log("🚀 ~ file: store.js:56 ~ listAllOrders ~ orderedOrderList:", orderedOrderList)
    // console.log("🚀 ~ file: store.js:12 ~ listAllOrders ~ orderList:", orderList)
    // const response = deleteOrderPassword(orderList)

    return {
        docs: orderedOrderList,
        totalDocs: orderedOrderList.length
    }

    // }
    // const orderList = await Model.find({}).populate([{ path: 'user' }, { path: 'ammount' }, { path: 'managedBy' }])
    // const response = deleteOrderPassword(orderList)

    // return {
    //     docs: response,
    //     totalDocs: orderList.length
    // }
}
const listUserOrders = async (id, query) => {

    if (query) {
        let filter = { user: id, status: query }
        const orderList = await Model.find(filter).populate([{ path: 'user' }, { path: 'ammount' }])
        const response = deleteOrderPassword(orderList)
        return {
            docs: response,
            totalDocs: orderList.length
        }
    }

    let filter = { user: id }
    const orderList = await Model.find(filter).populate([{ path: 'user' }, { path: 'ammount' }])
    const response = deleteOrderPassword(orderList)

    return {
        docs: response,
        totalDocs: orderList.length
    }
}

const getOrderInfo = (id) => {
    let filter = { _id: id }
    return Model.findOne(filter).populate([{ path: 'user' }, { path: 'ammount' }])

}

const updateOrder = (Id, newProp) => {
    let filter = { _id: Id }
    return Model.updateOne(filter, { $set: { ...newProp } })
}

const multiDelete = async (id) => {

    const multiDeleted = await Model.deleteMany({ user: id })
    return multiDeleted
}

const updatePrice = async (orderId, newPrice) => {

    let filter = { _id: orderId }
    const result = await Model.findOneAndUpdate(filter, { $set: { ammount: newPrice } }).populate([{ path: 'user' }, { path: 'ammount' }, { path: 'managedBy' }])
    return result

}

const deleteOrder = async (id) => {
    let filter = { _id: id }
    const result = await Model.findOneAndDelete(filter)
    return result
}

const orderModify = async (id, newProps) => {
    let filter = { _id: id }
    const result = await Model.findOneAndUpdate(filter, { $set: { ...newProps } })
    return result
}

module.exports = {
    add: addOrder,
    listAll: listAllOrders,
    list: listUserOrders,
    getOrderInfo,
    update: updateOrder,
    multiDelete,
    updatePrice,
    delete: deleteOrder,
    orderModify
}