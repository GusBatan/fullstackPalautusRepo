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
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputContainer}>
        <label style={styles.label} htmlFor='username'>Username:</label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.inputContainer}>
        <label style={styles.label} htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>
      <button type='submit' style={styles.button}>Login</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid #39FF14',
  },
  inputContainer: {
    marginBottom: '15px',
    width: '90%',
  },
  label: {
    display: 'block',
    color: '#39FF14',
    fontSize: '16px',
    marginBottom: '5px',
  },
  input: {
    width: '90%',
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #39FF14',
    borderRadius: '5px',
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#FFFFFF',
    backgroundColor: '#39FF14',
    border: '2px solid #39FF14',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default Login;
