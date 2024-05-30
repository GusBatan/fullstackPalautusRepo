import { useState, useRef, useEffect, useContext } from 'react'; // Import useState, useRef, useEffect
import apiServices from '../../services/apiServices.js';
import LikeButton from '../LikeButton';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import LoginContext from '../../login/LoginContextProvider.jsx';

const Blog = ({ blog, setError, setMessage }) => {
  const { state: loginState } =
    useContext(LoginContext);

  const [visible, setVisible] = useState(false);
  const detailsRef = useRef(null);
  const blogStyle = {
    border: '1px solid blue',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '2px',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
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
      setMessage(`You liked blog ${newBlog.data.response.title}`);
    },
    onError: (error) => {
      setError(error.response?.data || 'Failed to add the blog');
    },
  });

  const mutationDelete = useMutation({
    mutationFn: apiServices.deleteBlog,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries('blogs');
      setMessage('Succesfully deleted');
    },
    onError: (error) => {
      setError({ error: `Failed with message ${response.message}` });
    },
  });

  const handleLikeClick = async (event) => {
    mutation.mutate({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      blogId: blog.id,
      likes: blog.likes + 1,
    });
  };

  const handleDeleteClick = async () => {
    if (window.confirm(`Really remove blog ${blog.title}?`)) {
      mutationDelete.mutate({
        blogId: blog.id,
      });
    }
  };

  return (
    <div style={blogStyle}>
      <h3
        style={{ cursor: 'pointer' }}
        className='toggleVisibility'
        onClick={toggleVisibility}
      >
        {blog.title} by {blog.author}
      </h3>

      <div ref={detailsRef} style={detailsStyle} className={'toggleableDiv'}>
        <div>
          <p>{`Blog URL: ${blog.url}`}</p>
          <div></div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>Likes: {blog.likes}</p>
            <LikeButton onClick={handleLikeClick} />
            {blog?.user?.id === loginState?.userData?.id && (
              <button onClick={handleDeleteClick}>delete</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
