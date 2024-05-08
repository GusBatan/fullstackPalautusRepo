export const NotificationError = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className='error'>{message}</div>;
};

export const NotificationSuccess = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className='success'>{message}</div>;
};
