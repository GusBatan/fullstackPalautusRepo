import { useContext } from 'react';
import Blog from './components/Blog';
import blogService from './services/apiServices';
import Login from './login/Login';
import AddBlogs from './components/AddBlogs';
import NotificationContext from './components/Notification/NotificationContext';
import Notifications from './components/Notification/Notifications';
import LoginContext from './login/LoginContextProvider';
import { useQuery } from '@tanstack/react-query';

const App = () => {
  const { dispatch } = useContext(NotificationContext);
  const { state: loginState , dispatch: loginDispatch} = useContext(LoginContext);
  const blogs = useQuery({
    queryFn: blogService.getAll,
    queryKey: ['blogs'],
    select: (data) => {
      return data.sort((a, b) => b.likes - a.likes);
    },
  });

  const handleLogout = () => {
    loginDispatch({type: 'clear'});
  };

  if (!loginState?.userData?.token) {
    return (
      <div>
        <Notifications />
        <Login />
      </div>
    );
  }
  if (blogs?.isLoading) {
    return <div>Blogs loading...</div>;
  }
  return (
    <div>
      <Notifications />
      <h2>blogs</h2>
      <div>
        <p>{`${loginState.userData.name} has logged in`}</p>
        <button onClick={handleLogout}>logout</button>
      </div>
      <AddBlogs
        setError={(message) => dispatch({ type: 'setError', payload: message })}
        setMessage={(message) =>
          dispatch({ type: 'setMessage', payload: message })
        }
      />
      {blogs?.data.map((blog) => (
        <Blog
          setError={(message) =>
            dispatch({ type: 'setError', payload: message })
          }
          setMessage={(message) =>
            dispatch({ type: 'setMessage', payload: message })
          }
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  );
};

export default App;
