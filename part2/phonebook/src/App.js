import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(null)
  const [message, setMessage] = useState(null)


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])



  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const existing = persons.find(i => i.name === newName)
    if (existing) {
      if (window.confirm(`${existing.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(existing.id, nameObject)
          .then(returnedName => {
            setPersons(persons.map(pers => pers.id !== existing.id ? pers : returnedName))
            setNewName('')
            setNewNumber('')
          }).catch(error => {
            setMessage({error: true, message:
               `Information of ${existing.name} has already been removed from server`})
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            setPersons(persons.filter(n => n.id !== existing.id))
        })
      }
    } else {
      personService
        .create(nameObject)
        .then(returnedName => {
          setPersons(persons.concat(returnedName))

          setNewName('')
          setNewNumber('')
          setMessage({error: false, message:`Added ${newName}`})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }

  }

  const handleDelete = (id) => {
    const p = persons.find(i => i.id === id)
    if (window.confirm(`Delete ${p.name}?`)) {
      personService
        .deletePerson(id)
        .then(res => {
          setPersons(persons.filter(n => n.id !== id))
          setMessage({error: false, message:`Deleted ${p.name}`})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    const q = event.target.value
    const f = persons.filter(i => i.name.toLowerCase().includes(q.toLowerCase()))
    setSearchQuery(q)
    if (f.length !== persons.length){
      setFilteredPersons(f)
    } else {
      setFilteredPersons(null)
    }
    console.log(filteredPersons);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter searchQuery={searchQuery} handleSearch={handleSearch} />
      <h2>Add New</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons?filteredPersons:persons} handleDelete={handleDelete} />
    </div>
  )
}

export default App