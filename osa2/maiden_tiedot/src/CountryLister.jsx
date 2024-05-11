const CountryLister = ({ filteredCountries, setFilteredCountries }) => {
  return (
    <div>
      <h3>Narrow your search</h3>
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
  );
};

export default CountryLister;
