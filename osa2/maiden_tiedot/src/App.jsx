import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState("");

  const handleInput = (event) => {
    event.preventDefault();
    setQuery(event.target.value);
    const result = countries.filter((country) => {
      return country.name.common
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setFilteredCountries(result);
  };

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((res) => {
        setCountries(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Find Countries</h2>
      <input value={query} onChange={handleInput} />
      {filteredCountries.length > 10 && query && <h3>Too many results</h3>}
      {filteredCountries.length < 10 &&
        filteredCountries.length !== 1 &&
        filteredCountries.length !== 0 &&
        query && (
          <div>
            <h3>Alle 10</h3>
            {filteredCountries.map((country) => {
              return (
                <div
                  key={country.name.common}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    maxHeight: "40px",
                    width: "250px",
                    justifyContent: "space-between",
                  }}
                >
                  <p key={country.name.common}>{country.name.common}</p>
                  <button onClick={() => setFilteredCountries([country])}>
                    show
                  </button>
                </div>
              );
            })}
          </div>
        )}

      {filteredCountries.length === 1 && query && (
        <div>
          <h3>{filteredCountries[0]?.name?.common}</h3>
          <p>{`capital: ${filteredCountries[0]?.capital[0]}`}</p>
          <p>{`area ${filteredCountries[0]?.area}`}</p>
          <h4>languages:</h4>
          <ul>
            {Object.values(filteredCountries[0]?.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={filteredCountries[0]?.flags.png} />
        </div>
      )}
      {filteredCountries.length === 0 && query && <h3>No results</h3>}
    </div>
  );
};

export default App;
