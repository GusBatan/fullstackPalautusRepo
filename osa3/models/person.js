const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
});

const Person = mongoose.model('Person', personSchema);

const savePersons = (name, number) => {
  const person = new Person({
    name,
    number,
    id: Math.floor(Math.random() * 1000000),
  });
  person.save().then((result) => {
    mongoose.connection.close();
    process.exit(1);
  });
};

const findAllPersons = () => {
  Person.find({})
    .then((result) => {
      console.log('phonebook: ');
      result.forEach((person) => {
        console.log(`${person.name}: ${person.number}`);
      });
    })
    .then(() => {
      mongoose.connection.close();
      process.exit(1);
    });
};

if (process.argv.length === 3) {
  findAllPersons();
}

if (process.argv.length === 5) {
  savePersons(process.argv[3], process.argv[4]);
}
