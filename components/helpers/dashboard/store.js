const { CategoryModel } = require('../../league/model')
const PriceModel = require('../../prices/model')
const UserModel = require('../../user/model')
const OrderModel = require('../../order/model')
const { default: mongoose } = require('mongoose')
// mongoose.set('strictQuery', true);
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


const perProductInfo = async () => {
  const paymentInfoDetails = await OrderModel.aggregate(
    [
      {
        '$lookup': {
          'from': 'users',
          'localField': 'user',
          'foreignField': '_id',
          'as': 'user'
        }
      }, {
        '$match': {
          'status': 'approved',
          // 'inscription': false
        }
      }, {
        '$lookup': {
          'from': 'categories',
          'localField': 'user.category',
          'foreignField': '_id',
          'as': 'category'
        }
      }, {
        '$lookup': {
          'from': 'prices',
          'localField': 'ammount',
          'foreignField': '_id',
          'as': 'membership'
        }
      }, {
        '$unwind': {
          'path': '$user'
        }
      }, {
        '$unwind': {
          'path': '$category'
        }
      }, {
        '$unwind': {
          'path': '$membership'
        }
      }, {
        '$group': {
          '_id': {
            'method': '$payment.method',
            'category': {
              'name': '$category.name',
              '_id': '$category._id'
            },
            'membership': {
              '_id': '$membership._id',
              'name': '$membership.name'
            }
          },
          'totalAmmount': {
            '$sum': '$membership.ammount'
          },
          'orders': {
            '$push': '$$ROOT'
          }
        }
      }, {
        '$group': {
          '_id': {
            'method': '$_id.method',
            'membership': {
              '_id': '$_id.membership._id',
              'name': '$_id.membership.name'
            }
          },
          'totalProductAmmount': {
            '$sum': '$totalAmmount'
          },
          'orders': {
            '$push': '$orders'
          }
        }
      }, {
        '$sort': {
          '_id.membership.name': 1
        }
      }, {
        '$group': {
          '_id': '$_id.method',
          'totalAmmount': {
            '$sum': '$totalProductAmmount'
          },
          'methods': {
            '$push': '$$ROOT'
          }
        }
      }, {
        '$sort': {
          '_id': 1
        }
      }, {
        '$project': {
          '_id': 1,
          'totalAmmount': 1,
          'methods': {
            '_id': 1,
            'totalProductAmmount': 1
          }
        }
      }
    ]
      /* [
        {
          '$lookup': {
            'from': 'prices', 
            'localField': 'ammount', 
            'foreignField': '_id', 
            'as': 'ammount'
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'user', 
            'foreignField': '_id', 
            'as': 'user'
          }
        }, {
          '$lookup': {
            'from': 'prices', 
            'localField': 'user.membership', 
            'foreignField': '_id', 
            'as': 'membership'
          }
        }, {
          '$unwind': {
            'path': '$ammount'
          }
        }, {
          '$unwind': {
            'path': '$membership'
          }
        }, {
          '$unwind': {
            'path': '$user'
          }
        }, {
          '$match': {
            'status': 'approved'
          }
        }, {
          '$group': {
            '_id': {
              'membership': '$user.membership', 
              'membershipName': '$membership.name', 
              'method': '$payment.method'
            }, 
            'orders': {
              '$push': '$$ROOT'
            }
          }
        }, {
          '$group': {
            '_id': '$_id.method', 
            'payments': {
              '$push': {
                'membership': '$_id.membership', 
                'membershipName': '$_id.membershipName', 
                'orders': '$orders'
              }
            }
          }
        }
      ] */)

  const categoryInfoDetails = await OrderModel.aggregate([
    {
      '$match': {
        'status': 'approved'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'user',
        'foreignField': '_id',
        'as': 'user'
      }
    }, {
      '$lookup': {
        'from': 'prices',
        'localField': 'ammount',
        'foreignField': '_id',
        'as': 'membership'
      }
    }, {
      '$lookup': {
        'from': 'categories',
        'localField': 'user.category',
        'foreignField': '_id',
        'as': 'category'
      }
    }, {
      '$unwind': {
        'path': '$membership'
      }
    }, {
      '$unwind': {
        'path': '$category'
      }
    }, {
      '$group': {
        '_id': {
          'category': {
            '_id': '$membership._id',
            'name': '$membership.name'
          },
          'method': '$payment.method'
        },
        'totalPerMethodNCat': {
          '$sum': '$membership.ammount'
        }
      }
    }, {
      '$sort': {
        '_id.method': 1
      }
    }, {
      '$group': {
        '_id': {
          'category': {
            '_id': '$_id.category._id',
            'name': '$_id.category.name'
          }
        },
        'totalAmmount': { '$sum': '$totalPerMethodNCat' },
        'methods': {
          '$push': {
            'method': '$_id.method',
            'totalAmmount': '$totalPerMethodNCat'
          }
        }
      }
    }, {
      '$sort': {
        '_id.category.name': 1
      }
    }
  ])

  /*  const sortedPaymentInfo = paymentInfoDetails.sort((a, b) => {
     if (a._id < b._id) {
       return -1;
     }
     if (a._id > b._id) {
       return 1;
     }
     return 0;
   });
  */
  return {
    perMethod: paymentInfoDetails,
    perProduct: categoryInfoDetails,
  }


}

const perMonthInfo = async () => {
  const monthDetails = await OrderModel.aggregate([
    {
      '$lookup': {
        'from': 'users',
        'localField': 'user',
        'foreignField': '_id',
        'as': 'user'
      }
    }, {
      '$lookup': {
        'from': 'categories',
        'localField': 'user.category',
        'foreignField': '_id',
        'as': 'category'
      }
    }, {
      '$lookup': {
        'from': 'prices',
        'localField': 'ammount',
        'foreignField': '_id',
        'as': 'price'
      }
    }, {
      '$unwind': {
        'path': '$price'
      }
    }, {
      '$group': {
        '_id': {
          'month': {
            '$month': '$date'
          },
          'year': {
            '$year': '$date'
          },
          'category': '$category'
        },
        'orders': {
          '$push': '$$ROOT'
        },
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$unwind': {
        'path': '$_id.category'
      }
    }, {
      '$group': {
        '_id': '',
        'categoriesPerMonth': {
          '$push': {
            '_id': '$_id',
            'totalAmmount': {
              '$sum': '$orders.price.ammount'
            }
          }
        }
      }
    }, {
      '$unwind': {
        'path': '$categoriesPerMonth'
      }
    }, {
      '$sort': {
        'categoriesPerMonth._id.category.name': 1
      }
    }, {
      '$group': {
        '_id': {
          'category': '$categoriesPerMonth._id.category'
        },
        'months': {
          '$push': '$categoriesPerMonth'
        },
        'totalAmmount': {
          '$sum': '$categoriesPerMonth.totalAmmount'
        }
      }
    }, {
      '$sort': {
        '_id.category.name': 1

      }
    }
  ])

  return {
    docs: [
      ...monthDetails,

    ]
  }

}


module.exports = {
  getCategoriesInfo,
  getCategoryInfo,
  perProductInfo,
  perMonthInfo
}