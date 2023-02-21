const mongoose = require('mongoose')

const Schema = mongoose.Schema



const mySchema = new Schema({
   ammount: { type: Number, required: true },
   inscription: { type: Boolean, default: false },
   name: { type: String, required: true }

})

const model = mongoose.model("Prices", mySchema)

module.exports = model