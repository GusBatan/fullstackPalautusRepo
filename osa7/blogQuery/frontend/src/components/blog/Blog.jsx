import { useState, useRef, useEffect, useContext } from 'react';
import apiServices from '../../services/apiServices.js';
import LikeButton from '../LikeButton';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import LoginContext from '../../login/LoginContextProvider.jsx';
import { Link } from 'react-router-dom';
import NotificationContext from '../Notification/NotificationContext.jsx';

const Blog = ({ blog }) => {
  const { dispatch } = useContext(NotificationContext);
  const { state: loginState } = useContext(LoginContext);

  const [visible, setVisible] = useState(false);
  const detailsRef = useRef(null);
  const blogStyle = {
    border: '2px solid #39FF14',
    minWidth: '300px',
    padding: '10px',
    marginBottom: '10px',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  };

  const detailsStyle = {
    maxHeight: visible ? `${detailsRef.current.scrollHeight}px` : '0',
    overflow: 'hidden',
    transition: 'max-height 0.4s ease-in-out, padding 0.4s ease-in-out',
    padding: visible ? '10px 0' : '0',
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (visible) {
      detailsRef.current.style.maxHeight = `${detailsRef.current.scrollHeight}px`;
    } else {
      detailsRef.current.style.maxHeight = '0';
    }
  }, [visible]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: apiServices.putBlog,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries('blogs');
      dispatch({
        type: 'setMessage',
        payload: `You liked blog ${newBlog.data.response.title}`,
      });
    },
    onError: (error) => {
      dispatch({
        type: 'setError',
        payload: `'Failed to add the blog' ${error.response?.data}`,
      });
    },
  });

  const mutationDelete = useMutation({
    mutationFn: apiServices.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
      dispatch({
        type: 'setMessage',
        payload: `Successfully deleted`,
      });
    },
    onError: (error) => {
      dispatch({
        type: 'setError',
        payload: `Failed with message ${error.message}`,
      });
    },
  });

  const handleLikeClick = async (event) => {
    event.stopPropagation();
    mutation.mutate({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      blogId: blog.id,
      likes: blog.likes + 1,
    });
  };

  const handleDeleteClick = async (event) => {
    event.stopPropagation();
    if (window.confirm(`Really remove blog ${blog.title}?`)) {
      mutationDelete.mutate({ blogId: blog.id });
    }
  };

  return (
    <div style={blogStyle} onClick={toggleVisibility}>
      <h3 className='toggleVisibility'>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} by {blog.author}
        </Link>
        <span  style={{ color: '#39FF14', margin: '10px' }}>
          {visible ? '▼' : '▲'}
        </span>
      </h3>
      <div ref={detailsRef} style={detailsStyle} className={'toggleableDiv'}>
        <div>
          <p>{`Blog URL: ${blog.url}`}</p>
          <div></div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p>Likes: {blog.likes}</p>
            <LikeButton onClick={handleLikeClick} />
            {blog?.user?.id === loginState?.userData?.id && (
              <button style={{ marginLeft: '5px' }} onClick={handleDeleteClick}>
                delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
