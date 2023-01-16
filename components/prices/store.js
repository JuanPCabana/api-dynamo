const Model = require('./model')

const addPrice = (price) => {
    const myPrice = new Model(price);
    return myPrice.save()
}

const listAllPrices = () => {
   
    return Model.find({})

}


module.exports = {
    add: addPrice,
    listAll: listAllPrices,
    
}