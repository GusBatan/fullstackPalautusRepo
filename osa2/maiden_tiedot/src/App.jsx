import { useState, useEffect } from "react";
import axios from "axios";
import CountryInfo from "./CountryInfo";
import CountryLister from "./CountryLister";

const api_key = import.meta.env.VITE_SOME_KEY;

const App = () => {
  const [countries, setCountries] = useState([]);
  const [weatherData, setWeatherData] = useState({});
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

  useEffect(() => {
    if (query && filteredCountries.length === 1) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${filteredCountries[0]?.latlng[0]}&lon=${filteredCountries[0]?.latlng[1]}&appid=${api_key}`
        )
        .then((res) => {
          setWeatherData(res);
        })
        .catch((err) => console.log(err));
    }
  }, [query, filteredCountries.length]);

  return (
    <div>
      <h2>Find Countries</h2>
      <input value={query} onChange={handleInput} />
      {filteredCountries.length > 10 && query && <h3>Too many results</h3>}
      {filteredCountries.length < 10 &&
        filteredCountries.length !== 1 &&
        filteredCountries.length !== 0 &&
        query && (
          <CountryLister
            filteredCountries={filteredCountries}
            setFilteredCountries={setFilteredCountries}
          />
        )}

      {filteredCountries.length === 1 && query && (
        <CountryInfo
          filteredCountries={filteredCountries}
          weatherData={weatherData}
        />
      )}
      {filteredCountries.length === 0 && query && <h3>No results</h3>}
    </div>
  );
};

export default App;
