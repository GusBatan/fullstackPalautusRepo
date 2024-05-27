import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    deleteNotification() {
      return '';
    },
  },
});

export const { setNotification, deleteNotification } =
  notificationSlice.actions;

export const showNotification = (message, seconds) => {
  return (dispatch) => {
    dispatch(setNotification(message));
    setTimeout(() => {
      dispatch(deleteNotification());
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;
