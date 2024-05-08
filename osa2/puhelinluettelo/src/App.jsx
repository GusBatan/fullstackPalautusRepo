import { useState, useEffect } from 'react';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import personServices from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const handleFilter = (event) => {
    event.preventDefault();
    setFilter(event.target.value);
  };

  useEffect(() => {
    personServices.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = persons.find((person) => person.name === newName);
    if (found) {
      if (window.confirm(`${newName} already in phonebook, update number?`)) {
        personServices
          .update(found.id, { name: found.name, number: newNumber })
          .then(() =>
            setPersons(
              persons.map((person) =>
                person.id === found.id
                  ? { ...person, number: newNumber }
                  : person
              )
            )
          );
      }
    } else {
      personServices
        .create({
          name: newName,
          number: newNumber,
        })
        .then(() => {
          setPersons([...persons, { name: newName, number: newNumber }]);
        });
    }
  };

  const handleNewName = (event) => {
    event.preventDefault();
    setNewName(event.target.value);
  };
  const handleNewNumber = (event) => {
    event.preventDefault();
    setNewNumber(event.target.value);
  };

  const handleDelete = (id) => {
    setPersons(persons.filter((person) => person.id !== id));
    personServices.deletePerson(id);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter} filter={filter} />
      <h2>Add new</h2>
      <PersonForm
        handleNewNumber={handleNewNumber}
        handleNewName={handleNewName}
        handleSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons handleDelete={handleDelete} filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
