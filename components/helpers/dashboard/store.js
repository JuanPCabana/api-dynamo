const { CategoryModel } = require('../../league/model')
const PriceModel = require('../../prices/model')
const UserModel = require('../../user/model')
const OrderModel = require('../../order/model')

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

module.exports = {
    getCategoriesInfo
}