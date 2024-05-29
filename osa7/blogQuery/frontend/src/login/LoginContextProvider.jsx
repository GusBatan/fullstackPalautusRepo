import { createContext, useReducer } from 'react';

const initialState = {
  userData: { ...JSON.parse(localStorage.getItem('userData')) } || null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setUserData':
      localStorage.setItem('userData', JSON.stringify(action.payload));
      return {
        ...state,
        userData: {...action.payload},
        error: null,
      };
    case 'clear':
      localStorage.removeItem('userData');
      return { userData: null, error: null };
    default:
      return state;
  }
};

const LoginContext = createContext({
  state: initialState,
  dispatch: () => {},
});

export const LoginContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <LoginContext.Provider value={{ state, dispatch }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
