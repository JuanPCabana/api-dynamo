const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
   code: { type: String, required: true },
   league: {type: mongoose.Types.ObjectId, required:true},
   name: { type: String, required: true },
})

const mySchema = new Schema({
   code: { type: String, required: true },
   name: { type: String, required: true },
})

const CategoryModel = mongoose.model("Categories", categorySchema)
const LeagueModel = mongoose.model("Leagues", mySchema)

module.exports = {LeagueModel, CategoryModel}