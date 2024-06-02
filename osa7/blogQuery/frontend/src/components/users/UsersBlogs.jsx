import React from 'react';
import { useParams } from 'react-router-dom';

const UsersBlogs = ({ blogs }) => {
  const { id } = useParams();
  const userBlogs = blogs?.data?.filter((blog) => blog.user.id === id);
  console.log(userBlogs);

  return (
    <div style={styles.container}>
      <h2 style={styles.addedBlogs}>Added Blogs</h2>
      {userBlogs.length > 0 && (
        <div style={styles.blogsContainer}>
          <h2 style={styles.userName}>{userBlogs[0]?.user.name}</h2>
          {userBlogs.map((blog) => (
            <div key={blog.id} style={styles.blogItem}>
              <p style={styles.blogTitle}>{blog.title}</p>
            </div>
          ))}
        </div>
      )}
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
  },
  blogsContainer: {
    marginTop: '20px',
  },
  userName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center'
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
    textAlign: 'center'
  },
};

export default UsersBlogs;
