const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Number = require('./models/number')

morgan.token('body', req => JSON.stringify(req.body))

app.use(morgan(':method :url :body :status :res[content-length] :response-time'))

app.use(bodyParser.json())

app.use(cors())

app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Number
    .find({})
    .then(numbers => {
      res.json(numbers.map(Number.format))
    })
    .catch(error => { console.log(error) })
})

app.get('/api/persons/:id', (req, res) => {
  Number
    .findById(req.params.id)
    .then(number => {
      if (number) {
        res.json(Number.format(number))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => { console.log(error) })
})

app.delete('/api/persons/:id', (req, res) => {
  Number
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => { console.log(error) })
})

app.put('/api/persons/:id', (req, res) => {
  const number = req.body
  console.log(req.params.id)

  Number
    .findByIdAndUpdate(req.params.id, number, { new: true })
    .then(result => {
      res.json(Number.format(result))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'name or number missing' })
  }


  Number
    .find({ name: body.name })
    .then(result => {
      if (result.length > 0) {
        return res.status(400).json({
          error: 'name must be unique',
        })
      }
      const person = new Number({
        name: body.name,
        number: body.number,
      })
      person
        .save()
        .then(saved => {
          res.json(Number.format(saved))
        })
        .catch(error => { console.log(error) })
    })
    .catch(error => { console.log(error) })
})

app.get('/info', (req, res) => {
  Number
    .find({})
    .then(numbers => res.send(`<p>puhelinluettelossa ${numbers.length} henkilön tiedot </p> <p>${new Date()}</p>`))
    .catch(error => console.log(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
