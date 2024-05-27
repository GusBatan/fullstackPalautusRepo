import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { putVote } from './reducers/anecdoteReducer';
import {
  showNotification
} from './reducers/notificationReducer';

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filter);

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  );

  const dispatch = useDispatch();

  const vote = (anecdote) => {
    dispatch(putVote(anecdote));
    dispatch(showNotification(`You Voted For: ${anecdote.content}`, 5));
  };

  return (
    <>
      {filteredAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} vote(s)
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
