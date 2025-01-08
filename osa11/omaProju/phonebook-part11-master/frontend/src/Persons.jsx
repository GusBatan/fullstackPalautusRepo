const Persons = (props) => {
  const handleClick = (person) => {
    if (window.confirm(`Really delete ${person.name}?`)) {
      props.handleDelete(person.id);
    }
  };

  return props.filteredPersons.map((person) => (
    <div key={person.name}>
      <p>{`${person.name} ${person.number}`}</p>
      <button onClick={() => handleClick(person)}>Delete</button>
    </div>
  ));
};

export default Persons;
