import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import LikeButton from '../LikeButton';
import LoginContext from '../../login/LoginContextProvider';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import apiServices from '../../services/apiServices';
import Comments from '../blog/Comments';
import NotificationContext from '../Notification/NotificationContext';

const UsersSingleBlog = ({ blogs }) => {
  const { id } = useParams();
  const { state: loginState } = useContext(LoginContext);
  const queryClient = useQueryClient();
  const { dispatch } = useContext(NotificationContext);

  const userBlogs = blogs?.data?.filter((blog) => blog.id === id);

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
            payload: `Failed with message ${error.message}`,
          });
    },
  });

  const mutationDelete = useMutation({
    mutationFn: apiServices.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
      dispatch({
        type: 'setMessage',
        payload: 'Succesfully deleted',
      });
    },
    onError: (error) => {
        dispatch({
            type: 'setError',
            payload: `Failed with message ${error.response?.data}`,
          });
    },
  });

  const handleLikeClick = async (event) => {
    mutation.mutate({
      title: userBlogs[0]?.title,
      author: userBlogs[0]?.author,
      url: userBlogs[0]?.url,
      blogId: userBlogs[0]?.id,
      likes: userBlogs[0]?.likes + 1,
    });
  };

  const handleDeleteClick = async () => {
    if (window.confirm(`Really remove blog ${userBlogs[0]?.title}?`)) {
      mutationDelete.mutate({
        blogId: userBlogs[0]?.id,
      });
    }
  };
  return (
    <div style={styles.container}>
      <h2
        style={styles.addedBlogs}
      >{`${userBlogs[0]?.title} - ${userBlogs[0]?.author}`}</h2>
      <div style={styles.blogsContainer}>
        <h2
          style={styles.userName}
        >{`Added by ${userBlogs[0]?.user?.name}`}</h2>
        <p style={styles.userNameP}>{`${userBlogs[0]?.url}`}</p>
        <p style={styles.userNameP}>Likes: {userBlogs[0]?.likes}</p>
        <div style={{textAlign: 'center'}}>
        <LikeButton onClick={handleLikeClick} />
        {userBlogs[0]?.user?.id === loginState?.userData?.id && (
          <button style={{ marginLeft: '5px' }} onClick={handleDeleteClick}>
            delete
          </button>
        )}
        </div>
      </div>
      <Comments blog={userBlogs} />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  addedBlogs: {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  blogsContainer: {
    marginTop: '20px',
  },
  userName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  userNameP: {
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  blogItem: {
    backgroundColor: '#000000',
    padding: '10px',
    margin: '10px 0',
    maxWidth: '300px',
    border: '2px solid #39FF14',
  },
  blogTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0',
    textAlign: 'center',
  },
};

export default UsersSingleBlog;
