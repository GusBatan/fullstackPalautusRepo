import { useEffect, useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import AddBirthYear from './components/AddBirthYear';
import { useQuery, useMutation } from '@apollo/client';
import Login from './components/Login';
import Recommend from './components/Recommend';
import {
  GET_BOOK_BY_GENRE,
  ALL_AUTHORS,
  ALL_BOOKS,
  CREATE_BOOK,
  ME,
  CHANGE_AUTHOR,
} from './components/graphqlStuff';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [genreQuery, setGenreQuery] = useState(null);
  const resultAuthors = useQuery(ALL_AUTHORS);
  const resultBooks = useQuery(ALL_BOOKS);
  const resultBooksByGenre = useQuery(GET_BOOK_BY_GENRE, {
    variables: { genre: genreQuery },
  });

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: ALL_AUTHORS },
      { query: ALL_BOOKS },
      { query: GET_BOOK_BY_GENRE },
    ],
  });
  const [changeAuthor] = useMutation(CHANGE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
  });

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const { loading, data: userData } = useQuery(ME, {
    skip: !token,
  });

  const {
    loading: loadingUserFavoriteGenreBooks,
    data: userFavoriteGenreBooks,
  } = useQuery(
    GET_BOOK_BY_GENRE,
    { variables: { genre: userData?.me?.favoriteGenre } },
    {
      skip: !token && !userData?.me?.favoriteGenre,
    }
  );

  const genres = resultBooks?.data?.allBooks.flatMap((book) => book.genres);

  const logOut = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleAddBook = (title, author, published, genres) => {
    createBook({
      variables: { title, author, published, genres },
      refetchQueries: [
        { query: ALL_AUTHORS },
        { query: ALL_BOOKS },
        { query: GET_BOOK_BY_GENRE },
      ],
    });
  };

  if (
    resultAuthors.loading ||
    resultBooks.loading ||
    resultBooksByGenre.loading ||
    loading ||
    loadingUserFavoriteGenreBooks
  ) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && (
          <button onClick={() => setPage('recommend')}>Recommend</button>
        )}
        {!token && <button onClick={() => setPage('login')}>Login</button>}
        {token && <button onClick={logOut}>Logout</button>}
      </div>

      <Authors
        authors={resultAuthors.data.allAuthors}
        show={page === 'authors'}
      />

      <Books
        setGenreQuery={setGenreQuery}
        genres={genres}
        books={resultBooksByGenre?.data?.allBooks}
        show={page === 'books'}
      />

      <NewBook createBook={handleAddBook} show={page === 'add'} />
      <Recommend
        show={page === 'recommend'}
        genre={userData?.me?.favoriteGenre}
        books={userFavoriteGenreBooks?.allBooks}
      />
      {token && (
        <AddBirthYear
          show={page === 'authors'}
          changeAuthor={changeAuthor}
          authors={resultAuthors.data.allAuthors}
        />
      )}
      {page === 'login' && <Login setPage={setPage} setToken={setToken} />}
    </div>
  );
};

export default App;
