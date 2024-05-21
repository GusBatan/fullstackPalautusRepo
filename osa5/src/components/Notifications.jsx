const Notifications = ({ error, message }) => (
  <div>
    {error && (
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
        {`Error: ${error.error}`}
      </h3>
    )}
    {message && (
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
        {message}
      </h3>
    )}
  </div>
);

export default Notifications;
