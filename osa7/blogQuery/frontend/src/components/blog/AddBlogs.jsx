import { useState, useContext } from 'react';
import apiServices from '../../services/apiServices';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import NotificationContext from '../Notification/NotificationContext';

const AddBlogs = () => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [toggleVisibility, setToggleVisibility] = useState('');

  const { dispatch } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: apiServices.postBlog,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries('blogs');
      dispatch({
        type: 'setMessage',
        payload: `A new blog "${newBlog.title}" by ${newBlog.author} added with url ${newBlog.url}`,
      });
      setToggleVisibility(false);
      setBlogTitle('');
      setBlogAuthor('');
      setBlogUrl('');
    },

    onError: (error) => {
      dispatch({
        type: 'setError',
        payload: `Failed to add the blog ${error.code}`,
      });
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
    <div style={styles.container}>
      <button
        onClick={() => setToggleVisibility(!toggleVisibility)}
        style={{ ...styles.button, display: toggleVisibility ? 'none' : '' }}
      >
        New Blog
      </button>
      <form
        onSubmit={handleSubmit}
        style={{ ...styles.form, display: toggleVisibility ? 'flex' : 'none' }}
      >
        <div style={styles.inputContainer}>
          <label htmlFor='title' style={styles.label}>
            Title:
          </label>
          <input
            type='text'
            id='title'
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor='author' style={styles.label}>
            Author:
          </label>
          <input
            type='text'
            id='author'
            value={blogAuthor}
            onChange={(e) => setBlogAuthor(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor='url' style={styles.label}>
            URL:
          </label>
          <input
            type='text'
            id='url'
            value={blogUrl}
            onChange={(e) => setBlogUrl(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type='submit' style={styles.button}>
          Create
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid #39FF14',
  },
  inputContainer: {
    marginBottom: '15px',
    width: '90%',
  },
  label: {
    display: 'block',
    color: '#39FF14',
    fontSize: '16px',
    marginBottom: '5px',
  },
  input: {
    width: '90%',
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #39FF14',
    borderRadius: '5px',
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#FFFFFF',
    backgroundColor: '#39FF14',
    border: '2px solid #39FF14',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default AddBlogs;
