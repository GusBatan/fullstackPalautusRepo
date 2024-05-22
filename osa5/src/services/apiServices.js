import axios from 'axios';
const baseUrl = '/api/blogs';

const setToken = (newToken) => {
  const token = `Bearer ${newToken.token}`;
  localStorage.setItem('token', token);
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const logIn = async ({ username, password, setError, setUserData }) => {
  try {
    const response = await axios.post('/api/login', { username, password });
    const userData = JSON.stringify(response.data);
    localStorage.setItem('userData', userData);
    setUserData(JSON.parse(userData));
    setToken(JSON.parse(userData));
  } catch (er) {
    setError(er.response.data);
    setTimeout(() => {
      setError(null);
    }, 3000);
  }
};

const postBlog = async ({
  blogTitle,
  blogAuthor,
  blogUrl,
  setError,
  setBlogs,
  blogs,
  setMessage,
  setToggleVisibility,
}) => {
  const config = {
    headers: { Authorization: window.localStorage.getItem('token') },
  };

  try {
    const response = await axios.post(
      '/api/blogs',
      {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
      },
      config
    );
    setBlogs(
      blogs.concat({
        title: response.data.title,
        author: response.data.author,
        likes: response.data.likes,
        id: response.data.id,
        url: response.data.url,
      })
    );
    setToggleVisibility(false);
    setMessage('Added blog');
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  } catch (er) {
    setError(er.response.data);
    setTimeout(() => {
      setError(null);
    }, 3000);
  }
};

const putBlog = async ({ blogId, user, likes, author, title, url }) => {
  const config = {
    headers: { Authorization: window.localStorage.getItem('token') },
  };

  try {
    const response = await axios.put(
      `/api/blogs/${blogId}`,
      {
        user,
        title,
        author,
        url,
        likes,
      },
      config
    );
    return response;
  } catch (e) {
    return e;
  }
};

const deleteBlog = async ({ blogId }) => {
  const config = {
    headers: { Authorization: window.localStorage.getItem('token') },
  };
  try {
    const response = await axios.delete(`/api/blogs/${blogId}`, config);
    return response;
  } catch (e) {
    return e;
  }
};

export default { getAll, logIn, postBlog, putBlog, deleteBlog };
