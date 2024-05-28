import { createContext, useReducer } from 'react';

const initialState = { message: null, error: null };

const reducer = (state, action) => {
  switch (action.type) {
    case 'setMessage':
      return { ...state, message: action.payload };
    case 'setError':
      return { ...state, error: action.payload };
    case 'clear':
      return initialState;
    default:
      return state;
  }
};

const NotificationContext = createContext({
  state: initialState,
  dispatch: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
