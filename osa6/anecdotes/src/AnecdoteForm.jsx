import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewAnecdote } from './reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const [anecdoteInput, setAnecdoteInput] = useState('');
  const dispatch = useDispatch();

  const addAnecdote = (e) => {
    e.preventDefault();
    dispatch(addNewAnecdote(anecdoteInput));
    setAnecdoteInput('');
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input
            value={anecdoteInput}
            onChange={(e) => setAnecdoteInput(e.target.value)}
            type='text'
            id='anecdote'
            placeholder='Enter new anecdote'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
