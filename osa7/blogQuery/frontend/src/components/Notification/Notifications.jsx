import { useContext } from 'react';
import NotificationContext from './NotificationContent';

const Notifications = ({ error, message }) => {
  const { state } = useContext(NotificationContext);
  return (
    <div style={{ position: 'fixed' }}>
      {state.error && (
        <h3
          style={{
            color: 'white',
            fontWeight: 'bold',
            backgroundColor: 'red',
            padding: '10px',
            border: '2px solid darkred',
            borderRadius: '5px',
          }}
        >
          {`Error: ${state.error.error}`}
        </h3>
      )}
      {state.message && (
        <h3
          style={{
            color: 'white',
            fontWeight: 'bold',
            backgroundColor: 'green',
            padding: '10px',
            border: '2px solid darkgreen',
            borderRadius: '5px',
          }}
        >
          {state.message}
        </h3>
      )}
    </div>
  );
};

export default Notifications;
