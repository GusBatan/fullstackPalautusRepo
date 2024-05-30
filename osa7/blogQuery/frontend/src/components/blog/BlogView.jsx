import AddBlogs from './AddBlogs';
import Blog from './Blog';


const BlogView = ({ blogs, dispatch }) => {
  return (
    <>
      <AddBlogs
        setError={(message) => dispatch({ type: 'setError', payload: message })}
        setMessage={(message) =>
          dispatch({ type: 'setMessage', payload: message })
        }
      />
      {blogs?.data.map((blog) => (
        <Blog
          setError={(message) =>
            dispatch({ type: 'setError', payload: message })
          }
          setMessage={(message) =>
            dispatch({ type: 'setMessage', payload: message })
          }
          key={blog.id}
          blog={blog}
        />
      ))}
    </>
  );
};

export default BlogView;
