const Recommend = (props) => {
  if (!props.show) {
    return null;
  }

  const { books, genre } = props;

  return (
    <div>
      <h2>Recommendations</h2>
      <p>{`Books in your facourite genre ${genre}`}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author?.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
