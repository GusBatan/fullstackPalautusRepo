import { useContext } from 'react';
import NotificationContext from './NotificationContext';

const Notifications = () => {
  const { state } = useContext(NotificationContext);
  return (
    <div style={{ position: 'fixed', top: '50px' }}>
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
          {`Error: ${state.error}`}
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
