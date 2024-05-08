import { useState } from 'react';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const handleFilter = (event) => {
    event.preventDefault();
    setFilter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = persons.find((person) => person.name === newName);
    if (found) {
      alert(`${newName} already in phonebook`);
    } else {
      setPersons([...persons, { name: newName, number: newNumber }]);
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
      <Persons filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
