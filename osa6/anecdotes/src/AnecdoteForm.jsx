import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAnecdote } from './reducers/anecdoteReducer';
import { showNotification } from './reducers/notificationReducer';

const AnecdoteForm = () => {
  const [anecdoteInput, setAnecdoteInput] = useState('');

  const dispatch = useDispatch();
  const addAnecdote = async (e) => {
    e.preventDefault();
    dispatch(createAnecdote({ content: anecdoteInput, votes: 0 }));
    dispatch(showNotification(`You added anecdote: ${anecdoteInput}`, 5));
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
