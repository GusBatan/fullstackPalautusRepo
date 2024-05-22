import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/apiServices';
import Login from './login/Login';
import AddBlogs from './components/AddBlogs';
import Notifications from './components/Notifications';

const App = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
      return setBlogs(sortedBlogs);
    });
  }, [message]);

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
        <Notifications message={message} error={error} />
        <Login setUserData={setUserData} setError={setError} />
      </div>
    );
  }

  return (
    <div>
      <Notifications message={message} error={error} />
      <h2>blogs</h2>
      <div>
        <p>{`${userData.name} has logged in`}</p>
        <button onClick={handleLogout}>logout</button>
      </div>
      <AddBlogs
        setError={setError}
        setBlogs={setBlogs}
        blogs={blogs}
        setMessage={setMessage}
      />
      {blogs.map((blog) => (
        <Blog
          setError={setError}
          setMessage={setMessage}
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  );
};

export default App;
