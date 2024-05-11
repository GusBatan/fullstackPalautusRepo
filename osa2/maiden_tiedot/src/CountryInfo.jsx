const CountryInfo = ({ filteredCountries, weatherData }) => {
  return (
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
      <div>
        <h2>Weather in {filteredCountries[0]?.name?.common}</h2>
        <h3>{`Temperature: ${weatherData?.data?.main?.temp} celsius`}</h3>
        <img
          src={`https://openweathermap.org/img/wn/${weatherData?.data?.weather[0]?.icon}@2x.png`}
        />
        <h3>{`Wind: ${weatherData?.data?.wind?.speed} m/s`}</h3>
      </div>
    </div>
  );
};

export default CountryInfo;
