import { useState } from 'react';

const MyButton = ({ action, label }) => {
  return <button onClick={action}>{label}</button>;
};

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    { anecdote: 'If it hurts, do it more often.', votes: 0 },
    {
      anecdote: 'Adding manpower to a late software project makes it later!',
      votes: 0,
    },
    {
      anecdote:
        'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
      votes: 0,
    },
    {
      anecdote:
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
      votes: 0,
    },
    { anecdote: 'Premature optimization is the root of all evil.', votes: 0 },
    {
      anecdote:
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
      votes: 0,
    },
    {
      anecdote:
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
      votes: 0,
    },
    { anecdote: 'The only way to go fast, is to go well.', votes: 0 },
  ]);

  const [selected, setSelected] = useState(0);

  const handleVote = () => {
    const updatedAnekdootit = [...anecdotes];
    updatedAnekdootit[selected].votes++;
    setAnecdotes(updatedAnekdootit);
  };

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected].anecdote}</div>
      <div>has {anecdotes[selected].votes} votes</div>
      <div>
        <MyButton
          label={'new anecdote'}
          action={() =>
            setSelected(Math.floor(Math.random() * anecdotes.length))
          }
        />
        <MyButton label={'vote'} action={handleVote} />
      </div>
      <div>
        <h2>Anecdote with most votes</h2>
        {
          anecdotes.reduce((prev, current) =>
            prev.votes > current.votes ? prev : current
          ).anecdote
        }
      </div>
    </div>
  );
};

export default App;
