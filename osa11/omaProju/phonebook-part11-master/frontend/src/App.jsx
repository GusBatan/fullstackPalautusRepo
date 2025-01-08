import { useEffect, useState } from 'react'
import personService from './services/persons'

const Filter = ({ filter, handle }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handle} />
    </div>
  )
}

const PersonForm = ({ submitter, nameState, nameChanger, numberState, numberChanger }) => {

  return (
    <form onSubmit={submitter}>
      <div>
        name: <input value={nameState} onChange={nameChanger} />
      </div>
      <div>
        number: <input value={numberState} onChange={numberChanger} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ filter, persons, deleter }) => {
  const filteredPersons = persons?.filter(
    (person) => person.name.toLowerCase().includes(filter.toLowerCase())
  )

  if (!filteredPersons) {
    return (<div>No Persons</div>)
  }

  return (
    <div>
      {filteredPersons.map(person =>
        <p key={person.name}>{person.name} {person.number}<DeleteButton handler={deleter(person.id)} /></p>)}
    </div>
  )
}

const DeleteButton = ({ handler }) => {
  return (
    <>
      <button onClick={handler}>delete</button>
    </>
  )
}

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  const notificationStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    if (persons.map((person) => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        const person = {
          name: newName,
          number: newNumber,
          id: persons.find(person => person.name == newName).id
        }
        personService
          .update(person)
          .then(() => {
            setPersons(persons.map(p => p.id != person.id ? p : person))
            setSuccessMsg(`Number changed for ${newName}`)
            setTimeout(() => { setSuccessMsg(null) }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            setErrorMsg(`${newName} was already removed from the server`)
            setTimeout(() => { setErrorMsg(null) }, 5000)
          })
      }
      return
    }
    const person = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(person)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson.data))
        setSuccessMsg(`${returnedPerson.data.name} added`)
        setTimeout(() => { setSuccessMsg(null) }, 5000)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.log(error)
        setErrorMsg(error.response.data.error)
        setTimeout(() => { setErrorMsg(null) }, 5000)
      })
  }

  const deletePerson = (id) => {
    const deletePersonWithId = () => {
      const name = persons.find(p => p.id == id).name
      if (window.confirm(`Delete ${name}?`)) {
        personService.deletePerson(id)
          .then(() => {
            setPersons(persons.filter(person => person.id != id))
            setSuccessMsg(`${name} deleted`)
            setTimeout(() => { setSuccessMsg(null) }, 5000)
          })
          .catch(error => console.log('error in delete', error))
      }
    }

    return deletePersonWithId
  }

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => setPersons(initialPersons.data))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMsg} />
      <Error message={errorMsg} />
      <Filter filter={filter} handle={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        submitter={addName}
        nameState={newName}
        numberState={newNumber}
        nameChanger={handleNameChange}
        numberChanger={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons filter={filter} persons={persons} deleter={deletePerson} />
    </div>
  )

}

export default App