import ReactDOM from 'react-dom/client';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import { reducer } from './reducers/anecdoteReducer';
import filterReducer from './reducers/filterReducer';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: { anecdotes: reducer, filter: filterReducer },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
