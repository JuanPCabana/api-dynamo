const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mySchema = new Schema({
   status: { type: String, default: "pendding" },
   date: { type: Date, required: true },
   method: {type: String, required: true},
   ref: {type: String, required: true},
   ammount: {type: Number, required: true},
   bill:{type: Schema.Types.ObjectId, required: true, ref:"bills"},
   user: {type: Schema.ObjectId, ref: 'Users'}
})

const model = mongoose.model("Payments", mySchema)

module.exports = model