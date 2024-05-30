import { useContext } from 'react';
import blogService from './services/apiServices';
import Login from './login/Login';
import NotificationContext from './components/Notification/NotificationContext';
import Notifications from './components/Notification/Notifications';
import LoginContext from './login/LoginContextProvider';
import { useQuery } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NavBar from './components/router/NavBar';
import BlogView from './components/blog/BlogView';
import Users from './components/Users';


const App = () => {
  const { dispatch } = useContext(NotificationContext);
  const { state: loginState, dispatch: loginDispatch } =
    useContext(LoginContext);
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
    <Router>
      <div>
        <NavBar />
        <Notifications />
        <h2>blogs</h2>
      <div>
        <p>{`${loginState.userData.name} has logged in`}</p>
        <button onClick={handleLogout}>logout</button>
      </div>
        <Routes>
          <Route
            path='/'
            element={
              <BlogView
                blogs={blogs}
                dispatch={dispatch}
              />
            }
          />
          <Route path='/users' element={<Users blogs={blogs} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
