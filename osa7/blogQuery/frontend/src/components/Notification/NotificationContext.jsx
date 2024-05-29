import { createContext, useReducer, useEffect, useRef } from 'react';

const initialState = { message: null, error: null };

const reducer = (state, action) => {
  switch (action.type) {
    case 'setMessage':
      return { ...state, message: action.payload, error: null };
    case 'setError':
      return { ...state, error: action.payload, message: null };
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
  const timeoutRef = useRef();

  useEffect(() => {
    if (state.message || state.error) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: 'clear' });
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.message, state.error]);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
