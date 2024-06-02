import React from 'react';

const BlogComments = ({ blog }) => {
  return (
    <div style={styles.container}>
        <h2>Comments</h2>
      {blog[0]?.comments?.map((comment) => {
          return (
              <div key={comment._id}>{comment.content}</div>
          );
      })}
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

export default BlogComments;
