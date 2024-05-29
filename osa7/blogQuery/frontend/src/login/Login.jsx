import { useState, useContext } from 'react';
import apiServices from '../services/apiServices';
import LoginContext from './LoginContextProvider';
import NotificationContext from '../components/Notification/NotificationContext';

const Login = () => {
  const { dispatch: loginDispatch } = useContext(LoginContext);
  const { dispatch: notificationDispatch } = useContext(NotificationContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await apiServices.logIn({ username, password });
      if (response?.data?.token) {
        loginDispatch({
          type: 'setUserData',
          payload: response.data,
        });
        notificationDispatch({
          type: 'setMessage',
          payload: `Logged in as ${response.data.username}`,
        });
      } else {
        notificationDispatch({
          type: 'setError',
          payload: `Unable to login with error ${response}`,
        });
      }
    } catch (er) {
      notificationDispatch({
        type: 'setError',
        payload: `Error with message ${er.response.data}`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );
};

export default Login;
