import { useContext } from 'react';
import blogService from './services/apiServices';
import Login from './login/Login';
import NotificationContext from './components/Notification/NotificationContext';
import Notifications from './components/Notification/Notifications';
import LoginContext from './login/LoginContextProvider';
import { useQuery } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import NavBar from './components/router/NavBar';
import BlogView from './components/blog/BlogView';
import Users from './components/users/Users';
import UsersBlogs from './components/users/UsersBlogs';
import UsersSingleBlog from './components/users/UsersSingleBlog';

const App = () => {
  const { dispatch } = useContext(NotificationContext);
  const { state: loginState, dispatch: loginDispatch } = useContext(LoginContext);
  const blogs = useQuery({
    queryFn: blogService.getAll,
    queryKey: ['blogs'],
    select: (data) => {
      return data.sort((a, b) => b.likes - a.likes);
    },
  });

  const handleLogout = () => {
    loginDispatch({ type: 'clear' });
  };

  if (!loginState?.userData?.token) {
    return (
      <div style={styles.container}>
        <Notifications />
        <Login />
      </div>
    );
  }
  if (blogs?.isLoading) {
    return <div style={styles.loading}>Blogs loading...</div>;
  }
  return (
    <Router>
      <div style={styles.container}>
        <NavBar />
        <Notifications />
        <div style={styles.userInfo}>
          <p>{`${loginState.userData.name} has logged in`}</p>
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
        <h2 style={styles.header}>Blogs</h2>
        <Routes>
        <Route path='/' element={<Navigate to="/blogs" replace />} />
          <Route
            path='/blogs'
            element={
              <BlogView
                blogs={blogs}
                dispatch={dispatch}
              />
            }
          />
          <Route path='/users' element={<Users blogs={blogs} />} />
          <Route path='/users/:id' element={<UsersBlogs blogs={blogs} />} />
          <Route path='/blogs/:id' element={<UsersSingleBlog blogs={blogs} />} />
        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Roboto, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  loading: {
    fontSize: '18px',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: '20px',
  },
  header: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#39FF14',
    marginBottom: '20px',
    border: '2px solid #39FF14',
    padding: '10px',
  },
  userInfo: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#FFFFFF',
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#FFFFFF',
    backgroundColor: '#39FF14',
    border: '2px solid #39FF14',
    cursor: 'pointer',
  },
};

export default App;
