import { createSlice } from '@reduxjs/toolkit';
import anecdoteServices from '../services/anecdoteServices';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      return state
        .map((anecdote) =>
          anecdote.id === action.payload.id
            ? { ...anecdote, votes: anecdote.votes + 1 }
            : anecdote
        )
        .sort((a, b) => b.votes - a.votes);
    },
    appendAnecdotes(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { voteAnecdote, appendAnecdotes, setAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteServices.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteServices.saveAnecdote(anecdote);
    dispatch(appendAnecdotes(newAnecdote));
  };
};

export const putVote = (anecdote) => {
  return async (dispatch) => {
    const puttedAnecdote = await anecdoteServices.putAnecdote({
      ...anecdote,
      votes: anecdote.votes + 1,
    });
    dispatch(voteAnecdote(puttedAnecdote));
  };
};

export default anecdoteSlice.reducer;
