const {LeagueModel, CategoryModel} = require('./model')

const addLeague = (league) => {
    const myLeague = new LeagueModel(league);
    return myLeague.save()
}
const addCategory = async (categories, league) => {
    const dbCategories = categories.map((category)=>{return {...category, league: league }})
    console.log("🚀 ~ file: store.js:9 ~ addCategory ~ dbCategories", dbCategories)
    return  await CategoryModel.insertMany(dbCategories)
}

const listAllLeagues = () => {
   
    return LeagueModel.find({})

}
const getLeague = (id) => {
    let filter = { _id: id }
    return LeagueModel.find(filter)

}

module.exports = {
    add: addLeague,
    listAll: listAllLeagues,
    get: getLeague,
    addCategory
}