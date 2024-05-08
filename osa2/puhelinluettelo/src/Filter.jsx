const Filter = (props) => {
  return (
    <div>
      <h4>Filter shown with </h4>
      <input value={props.filter} onChange={props.handleFilter} />
    </div>
  );
};

export default Filter;
