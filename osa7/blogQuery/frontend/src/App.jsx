import { useState, useEffect, useContext } from 'react';
import Blog from './components/Blog';
import blogService from './services/apiServices';
import Login from './login/Login';
import AddBlogs from './components/AddBlogs';
import NotificationContext from './components/Notification/NotificationContent';
import Notifications from './components/Notification/Notifications';
import { useQuery } from '@tanstack/react-query';

const App = () => {
  const { dispatch } = useContext(NotificationContext);
  const [userData, setUserData] = useState(null);

  const blogs = useQuery({
    queryFn: blogService.getAll,
    queryKey: ['blogs'],
    select: (data) => {
      return data.sort((a, b) => b.likes - a.likes);
    },
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('userData');
    if (loggedUserJSON) {
      setUserData(JSON.parse(loggedUserJSON));
    }
  }, []);

  const handleLogout = () => {
    setUserData(null);
    localStorage.setItem('userData', null);
  };

  if (!userData?.token) {
    return (
      <div>
        <Notifications />
        <Login
          setUserData={setUserData}
          setError={(message) =>
            dispatch({ type: 'setError', payload: message })
          }
        />
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
        <p>{`${userData.name} has logged in`}</p>
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
          userData={userData}
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
