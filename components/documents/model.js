const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mySchema = new Schema({
   file: { type: String, required: true },
   name: { type: String, required: true },
   date: { type: Date },
   description: { type: String, required: false },
   league: { type: Schema.ObjectId, ref: 'Leagues'},
   category: [{ type: Schema.ObjectId, ref: 'Categories'}],
   user: { type: Schema.ObjectId, ref: 'Users' },
   from: { type: Schema.ObjectId, ref: 'Users' },
   global: { type: Boolean, required: true }
})

const model = mongoose.model("Documents", mySchema)

module.exports = model