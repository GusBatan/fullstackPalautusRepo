import { useState, useContext } from 'react';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnecdotes, putAnecdote } from './requests';
import NotificationContext from '../NotificationContext';

const App = () => {
  const queryClient = useQueryClient();
  const [, notificationDispatch] = useContext(NotificationContext);

  const voteMutation = useMutation({
    mutationFn: putAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes']);
      notificationDispatch({
        type: 'setNotification',
        payload: `You voted for ${anecdote.content}`,
      });
      setTimeout(() => {
        notificationDispatch({ type: 'deleteNotification' });
      }, 5000);
    },
    onError: () => {
      notificationDispatch({
        type: 'setNotification',
        payload: `Your vote encountered an error`,
      });
      setTimeout(() => {
        notificationDispatch({ type: 'deleteNotification' });
      }, 5000);
    },
  });

  const handleVote = (anecdote) => {
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  const result = useQuery({
    queryFn: getAnecdotes,
    queryKey: ['anecdotes'],
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return (
      <div>Anecdote service not available due to problems in server...</div>
    );
  }
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {result?.data?.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
