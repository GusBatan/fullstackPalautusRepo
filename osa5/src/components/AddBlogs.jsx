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
    apiServices.postBlog({
      blogTitle,
      blogAuthor,
      blogUrl,
      setError,
      setBlogs,
      blogs,
      setMessage,
      setToggleVisibility,
    });
  };

  return (
    <div>
      <button
        onClick={() => setToggleVisibility(!toggleVisibility)}
        style={{ display: toggleVisibility ? 'none' : '' }}
      >
        new note
      </button>
      <form
        onSubmit={handleSubmit}
        style={{ display: toggleVisibility ? '' : 'none' }}
      >
        <div>
          <label>Title:</label>
          <input
            type='text'
            id='Title'
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type='text'
            id='Author'
            value={blogAuthor}
            onChange={(e) => setBlogAuthor(e.target.value)}
          />
        </div>
        <div>
          <label>url:</label>
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
