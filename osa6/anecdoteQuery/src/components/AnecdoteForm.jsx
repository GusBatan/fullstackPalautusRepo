import { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NotificationContext from '../../NotificationContext';
import { createAnecdote } from '../requests';

const AnecdoteForm = () => {
  const [content, setContent] = useState('');
  const [, notificationDispatch] = useContext(NotificationContext);

  const queryClient = useQueryClient();

  const addAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes']);
      notificationDispatch({
        type: 'setNotification',
        payload: `You added anecdote ${content}`,
      });
      setTimeout(() => {
        notificationDispatch({ type: 'deleteNotification' });
      }, 5000);
    },
    onError: () => {
      notificationDispatch({
        type: 'setNotification',
        payload: 'Error with the server',
      });
      setTimeout(() => {
        notificationDispatch({ type: 'deleteNotification' });
      }, 5000);
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    if (content.length >= 5) {
      addAnecdoteMutation.mutate({ content, votes: 0 });
      setContent('');
    } else {
      alert('Anecdote must be at least 5 characters long');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Create new</h3>
      <div>
        <input
          type='text'
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  );
};

export default AnecdoteForm;
