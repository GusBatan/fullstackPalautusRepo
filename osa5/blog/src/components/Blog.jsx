import { useState, useRef, useEffect } from 'react'; // Import useState, useRef, useEffect
import apiServices from '../services/apiServices';
import LikeButton from './LikeButton';

const Blog = ({ blog, setError, setMessage }) => {
  const [visible, setVisible] = useState(false);
  const detailsRef = useRef(null);
  const [likes, setLikes] = useState(blog.likes);

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

  const handleLikeClick = async () => {
    console.log('painoin');
    const newLikes = likes + 1;
    setLikes(newLikes);
    const response = await apiServices.putBlog({
      blogId: blog.id,
      likes: newLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    });
    if (response.data.error) {
      setError(response.data.error);
      setTimeout(() => setError(null), 3000);
    }
    if (response.data.message) {
      setMessage(response.data.message);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm(`Really remove blog ${blog.title}?`)) {
      const response = await apiServices.deleteBlog({ blogId: blog.id });
      if (response.message) {
        setError({ error: `Failed with message ${response.message}` });
        setTimeout(() => setError(null), 3000);
      }
      if (response.status) {
        setMessage('Succesfully deleted');
        setTimeout(() => setMessage(null), 3000);
      }
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
          <p>{blog.url}</p>
          <div></div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>Likes: {likes}</p>
            <LikeButton onClick={handleLikeClick} />
            <button onClick={handleDeleteClick}>delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
