const mongoose = require('mongoose')

const Schema = mongoose.Schema



const mySchema = new Schema({
   ammount: {type:Number, required: true},

})

const model = mongoose.model("Prices", mySchema)

module.exports = model