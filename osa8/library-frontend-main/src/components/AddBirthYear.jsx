import { useState } from 'react';
import Select from 'react-select';

const AddBirthYear = (props) => {
  if (!props.show) {
    return null;
  }
  const [year, setYear] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const submit = async (event) => {
    event.preventDefault();
    const yearNumber = Number(year);

    props.changeAuthor({
      variables: { name: selectedOption.value, born: yearNumber },
    });

    setYear('');
  };

  const options = props?.authors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  return (
    <div style={{ marginTop: '20px' }}>
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
      <form onSubmit={submit}>
        <div>
          born
          <input
            type='number'
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>

        <button type='submit'>update author</button>
      </form>
    </div>
  );
};

export default AddBirthYear;
