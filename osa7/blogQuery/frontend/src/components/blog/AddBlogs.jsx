import { useState } from 'react';
import apiServices from '../../services/apiServices';
import PropTypes from 'prop-types';
import { useQueryClient, useMutation } from '@tanstack/react-query';

const AddBlogs = ({ setError, setMessage }) => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [toggleVisibility, setToggleVisibility] = useState('');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: apiServices.postBlog,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries('blogs');
      setMessage(
        `A new blog "${newBlog.title}" by ${newBlog.author} added with url ${newBlog.url}`
      );
      setToggleVisibility(false);
      setBlogTitle('');
      setBlogAuthor('');
      setBlogUrl('');
    },
    onError: (error) => {
      setError('Failed to add the blog', error.code);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    });
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
  setMessage: PropTypes.func.isRequired,
};

export default AddBlogs;
