const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url)
mongoose.Promise = global.Promise

const numberSchema = new mongoose.Schema({
    name: String,
    number: String
  })

numberSchema.statics.format = function (number) {
  return {
    name: number.name,
    number: number.number,
    id: number._id
  }
}

const Number = mongoose.model('Number', numberSchema)

module.exports = Number