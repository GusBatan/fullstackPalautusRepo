import { useState } from 'react';
import apiServices from '../services/apiServices';
import PropTypes from 'prop-types';

const AddBlogs = ({ setError, setBlogs, blogs, setMessage }) => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [toggleVisibility, setToggleVisibility] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newBlog = await apiServices.postBlog({
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
      });

      if (newBlog?.response?.data?.error) {
        setError(newBlog.response.data);
        setTimeout(() => setError(null), 3000);
      } else {
        setBlogs(blogs.concat(newBlog));
        setMessage(
          `A new blog "${newBlog.title}" by ${newBlog.author} added with url ${newBlog.url}`
        );
        setTimeout(() => setMessage(null), 3000);
        setToggleVisibility(false);
        setBlogTitle('');
        setBlogAuthor('');
        setBlogUrl('');
      }
    } catch (error) {
      setError('Failed to add the blog');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div>
      <button
        onClick={() => setToggleVisibility(!toggleVisibility)}
        style={{ display: toggleVisibility ? 'none' : '' }}
      >
        new blog
      </button>
      <form
        onSubmit={handleSubmit}
        style={{ display: toggleVisibility ? '' : 'none' }}
      >
        <div>
          <label htmlFor='title'>Title:</label>
          <input
            type='text'
            id='title'
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='author'>Author:</label>
          <input
            type='text'
            id='author'
            value={blogAuthor}
            onChange={(e) => setBlogAuthor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='url'>URL:</label>
          <input
            type='text'
            id='url'
            value={blogUrl}
            onChange={(e) => setBlogUrl(e.target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

AddBlogs.propTypes = {
  setError: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  setMessage: PropTypes.func.isRequired,
};

export default AddBlogs;
