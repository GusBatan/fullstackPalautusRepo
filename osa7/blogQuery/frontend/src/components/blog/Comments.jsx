import React, { useState, useContext } from 'react';
import NotificationContext from '../Notification/NotificationContext';
import BlogComments from './BlogComments';
import apiServices from '../../services/apiServices';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const Comments = ({ blog }) => {
  const [comment, setComment] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { dispatch } = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const { id } = useParams();

  const mutation = useMutation({
    mutationFn: apiServices.postComment,
    onSuccess: (newComment) => {
      console.log(newComment);
      queryClient.invalidateQueries('blogs');
      dispatch({
        type: 'setMessage',
        payload: `New comment added succesfully`,
      });
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
    if (comment.trim() === '') {
      dispatch({
        type: 'setError',
        payload: 'Comment cannot be empty',
      });
      return;
    }
    mutation.mutate({
      blogId: id,
      comment: comment,
    });
    setIsVisible(false);
  };

  const handleAddCommentClick = () => {
    setIsVisible(true);
  };

  return (
    <div style={styles.container}>
      <button onClick={handleAddCommentClick} style={styles.button}>
        Add Comment
      </button>
      {isVisible && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder='Write your comment here...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={styles.input}
          />
          <button type='submit' style={{ ...styles.button, marginTop: '10px' }}>
            Submit
          </button>
        </form>
      )}
      <BlogComments blog={blog} />
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px',
    marginTop: '20px',
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
  },
  input: {
    width: '90%',
    height: '100px',
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #39FF14',
    borderRadius: '5px',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#FFFFFF',
    backgroundColor: '#39FF14',
    border: '2px solid #39FF14',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Comments;
