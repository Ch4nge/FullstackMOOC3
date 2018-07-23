import React from 'react'
import Persons from './Persons'
import Input from './Input'
import axios from 'axios'
import module from './module'
import Notification from './Notification'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNum: '',
      filterName: '',
      notificationMessage: null,
      messageType: 'success'
    }
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  addPerson = (event) => {
    event.preventDefault()
    const person = { 
      name: this.state.newName,
      number: this.state.newNum  
    }

    if(this.state.persons.filter( p => p.name === person.name).length === 0) {
      module.create(person)
        .then(() => {
          this.getPersons()
          this.setState({
            newName: '',
            newNum: ''
          })
          this.setMessage('success', person.name + " lisätty")
        })
      
    }else{
      let p = this.state.persons.find( (p2) => (p2.name === person.name))
      this.updatePerson(p.id, person)
    }
    event.target.value = ''
  }

  componentDidMount() {
    this.getPersons()
  }

  deletePerson = (person) => {
    if(window.confirm("poistetaanko "+person.name)){
      module.deletePerson(person.id)
        .then(() => {
          this.getPersons()
          this.setMessage('success', person.name+" poistettu")
        })
    }
  }

  updatePerson = (id, person) => {
    if(window.confirm(person.name + " on jo luettelossa, korvataanko vanha numero uudella?")){
      module.update(id, person)
        .then(() => {
          this.getPersons()
          this.setState({
            newName: '',
            newNum: ''
          })
          this.setMessage('success', person.name+" päivitetty")
        }).catch(error => {
          this.setMessage('error', "Virhe, henkilön "+person.name+" tiedot on poistettu, yritä uudelleen")
          this.getPersons()
        })
    }
  }

  getPersons = () => {
    module.getAll()
      .then(response => {
        console.log(response);
        this.setState({ persons: response.data })
      })
  }

  setMessage = (type, message) => {
    this.setState({
      notificationMessage: message,
      messageType: type
    })
    setTimeout(() => {
      this.setState({notificationMessage: null})
    }, 2000)
  }

  render() {
    const { persons, newName, newNum, filterName } = this.state
    const filteredPersons = persons.filter( 
      person => person.name.toLocaleLowerCase().includes(filterName) 
    )

    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification type={this.state.messageType} message={this.state.notificationMessage}/>
        <form>
          <Input text="rajaa näyettäviä" name="filterName" value={filterName} onChange={this.onChangeHandler} />
          <h2>Lisää uusi</h2>
          <Input text="nimi" name="newName" value={newName} onChange={this.onChangeHandler} />
          <Input text="numero" name="newNum" value={newNum} onChange={this.onChangeHandler} />
          <div>
            <button type="submit" onClick={this.addPerson}>lisää</button>
          </div>
        </form>
        <Persons persons={filteredPersons} delete={this.deletePerson} />
      </div>
    )
  }
}

export default App