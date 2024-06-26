const Books = (props) => {
  if (!props.show) {
    return null;
  }

  const { books, genres, setGenreQuery } = props;

  return (
    <div>
      <h2>books</h2>

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
      <div>
        <p>Select By Genres:</p>
        <button onClick={() => setGenreQuery(null)}>All Genres</button>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setGenreQuery(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
