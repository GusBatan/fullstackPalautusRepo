import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import AddBirthYear from './components/AddBirthYear';
import { gql, useQuery, useMutation } from '@apollo/client';

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
    }
  }
`;

const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      author
      genres
    }
  }
`;

const CHANGE_AUTHOR = gql`
  mutation changeAuthor(
    $name: String!
    $born: Int!
  ) {
    editAuthor(
      name: $name
      born: $born
    ) {
      name
      born
    }
  }
`;

const App = () => {
  const [page, setPage] = useState('authors');
  const resultAuthors = useQuery(ALL_AUTHORS);
  const resultBooks = useQuery(ALL_BOOKS);
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
  });  
  const [changeAuthor] = useMutation(CHANGE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
  });

  if (resultAuthors.loading || resultBooks.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        authors={resultAuthors.data.allAuthors}
        show={page === 'authors'}
      />

      <Books books={resultBooks.data.allBooks} show={page === 'books'} />

      <NewBook createBook={createBook} show={page === 'add'} />

      <AddBirthYear show={page === 'authors'} changeAuthor={changeAuthor} authors={resultAuthors.data.allAuthors} />
    </div>
  );
};

export default App;
