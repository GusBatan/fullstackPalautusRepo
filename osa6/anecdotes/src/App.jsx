
import AnecdoteForm from './AnecdoteForm';
import AnecdoteList from './AnecdoteList';
import Filter from './Filter';

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>  
      <Filter />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  );
};

export default App;
