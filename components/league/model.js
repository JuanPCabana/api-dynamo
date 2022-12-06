const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
   code: { type: String, required: true },
   name: { type: String, required: true },
})

const mySchema = new Schema({
   code: { type: String, required: true },
   name: { type: String, required: true },
   categories: [categorySchema]
})

const model = mongoose.model("Leagues", mySchema)

module.exports = model