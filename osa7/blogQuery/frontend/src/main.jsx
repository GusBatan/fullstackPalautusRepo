import ReactDOM from 'react-dom/client';
import App from './App';
import { NotificationProvider } from './components/Notification/NotificationContext';
import QueryProvider from './components/QueryClientProvider';
import { LoginContextProvider } from './login/LoginContextProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryProvider>
    <LoginContextProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </LoginContextProvider>
  </QueryProvider>
);
