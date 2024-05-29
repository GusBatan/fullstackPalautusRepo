import ReactDOM from 'react-dom/client';
import App from './App';
import { NotificationProvider } from './components/Notification/NotificationContent';
import QueryProvider from './components/QueryClientProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </QueryProvider>
);
