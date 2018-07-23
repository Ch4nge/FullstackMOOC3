const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url)

const Number = mongoose.model('Number', {
  name: String,
  number: String
})

if(process.argv.length > 2){
  const num = new Number({
  name: process.argv[2],
  number: process.argv[3]
  })

  num.save()
  .then(response => {
    console.log("Lisätään henkilö! "+num.name+" numero "+num.number+" luetteloon")
    mongoose.connection.close()
  })
}else if(process.argv.length == 2){
  Number.find({})
  .then( res => {
    console.log("puhelinluettelo:")
    res.forEach( n => console.log(n.name + " " + n.number))
    mongoose.connection.close();
  })
}
