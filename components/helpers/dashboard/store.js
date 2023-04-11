const { CategoryModel } = require('../../league/model')
const PriceModel = require('../../prices/model')
const UserModel = require('../../user/model')
const OrderModel = require('../../order/model')
const { default: mongoose } = require('mongoose')

const getCategoriesInfo = async () => {

    const categoriesInfo = await CategoryModel.aggregate([
        {
            '$lookup': {
                'from': 'users',
                'localField': '_id',
                'foreignField': 'category',
                'as': 'users'
            }
        }
    ])
    const orderList = await OrderModel.find({ status: 'unpaid', inscription: false }).populate([{ path: 'user' }, { path: 'ammount' }])


    const returnCategories = categoriesInfo.map(categoryInfo => {
        let activeUsers = 0
        let inactiveUsers = 0
        let registeredUsers = 0

        categoryInfo.users.map(user => {
            if (user.status === 'active') activeUsers = activeUsers + 1
            if (user.status === 'inactive' || user.status === 'debtor') inactiveUsers = inactiveUsers + 1
            if (user.status === 'registered') registeredUsers = registeredUsers + 1

        })

        let totalCategoryDebt = 0

        orderList.map(order => {
            if (order?.user?.category?.toString() === categoryInfo._id.toString()) {
                totalCategoryDebt = totalCategoryDebt + order.ammount.ammount
            }
        })

        return {
            // ...categoryInfo,
            _id: categoryInfo._id,
            name: categoryInfo.name,
            code: categoryInfo.code,
            activeUsers,
            inactiveUsers,
            registeredUsers,
            totalUsers: categoryInfo.users.length,
            totalCategoryDebt
        }

    })

    const totalDebt = returnCategories.reduce((accumulator, currentValue) => accumulator + currentValue.totalCategoryDebt, 0);

    return {
        docs: returnCategories,
        totalDebt

    }

}

const getCategoryInfo = async (id) => {
    const userList = await UserModel.aggregate(
        [
            {
                '$match': {
                    'category': mongoose.Types.ObjectId(id),
                    // 'status': {
                    //     '$ne': 'registered'
                    // }
                }
            },
            {
                '$lookup': {
                    'from': 'orders',
                    'localField': '_id',
                    'foreignField': 'user',
                    'as': 'unpaidOrders'
                }
            }, {
                '$unwind': {
                    'path': '$unpaidOrders'
                }
            }, {
                '$match': {
                    'unpaidOrders.status': 'unpaid'
                }
            }, {
                '$lookup': {
                    'from': 'prices',
                    'localField': 'unpaidOrders.ammount',
                    'foreignField': '_id',
                    'as': 'productAmounts'
                }
            }, {
                '$group': {
                    '_id': '$_id',
                    'user': {
                        '$first': '$$ROOT'
                    },
                    'totalDebt': {
                        '$sum': {
                            '$arrayElemAt': [
                                '$productAmounts.ammount', 0
                            ]
                        }
                    },
                    'orders': {
                        '$push': '$unpaidOrders'
                    }
                }
            }, {
                '$unset': 'user.unpaidOrders'
            }, {
                '$unset': 'user.productAmounts'
            }, {
                '$lookup': {
                    'from': 'categories',
                    'localField': 'user.category',
                    'foreignField': '_id',
                    'as': 'user.category'
                }
            }, {
                '$project': {
                    '_id': 0,
                    'category': '$user.category.name',
                    'user': '$user',
                    'orders': '$orders',
                    'totalDebt': 1
                }
            }
        ]
    );
    const returnList = []
    for (user of userList) {
        const auxUser = user
        delete auxUser.user.password
        returnList.push(auxUser)
    }

    const totalDebt = returnList.reduce((accumulator, currentValue) => accumulator + currentValue.totalDebt, 0);


    return { docs: returnList, totalCategoryDebt: totalDebt }

}


module.exports = {
    getCategoriesInfo,
    getCategoryInfo
}