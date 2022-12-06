const Model = require('./model')

const addLeague = (league) => {
    const myLeague = new Model(league);
    return myLeague.save()
}

const listAllLeagues = () => {
   
    return Model.find({})

}
const getLeague = (id) => {
    let filter = { _id: id }
    return Model.find(filter)

}

module.exports = {
    add: addLeague,
    listAll: listAllLeagues,
    get: getLeague
}