const Model = require('./model')

const addPayment = (payment) => {
    const myPayment = new Model(payment);
    return myPayment.save()
}

const listAllPayments = () => {
   
    return Model.find({})

}
const listUserPayments = (id) => {
    let filter = { user: id }
    return Model.find(filter).populate('user')

}

module.exports = {
    add: addPayment,
    listAll: listAllPayments,
    list: listUserPayments
}