import { Link } from 'react-router-dom';

const Users = ({ blogs }) => {
    
  const groupedBlogs = blogs?.data?.reduce((acc, blog) => {
    if (!acc[blog.user.id]) {
      acc[blog.user.id] = { name: blog.user.name, blogs: [] };
    }
    acc[blog.user.id].blogs.push(blog);
    return acc;
  }, {});

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Number of Blogs</th>
          </tr>
        </thead>
        <tbody>
          {groupedBlogs &&
            Object.keys(groupedBlogs).map((author) => (
              <tr key={author}>
                <td><Link to={`/users/${author}`}>{groupedBlogs[author].name}</Link></td>
                <td>{groupedBlogs[author].blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
