import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import LikeButton from './LikeButton';
import AddBlogs from './AddBlogs';
import apiServices from '../services/apiServices';

describe('Blog component', () => {
  let container;
  const blog = {
    id: 1,
    title: 'Kuinka kaatua',
    author: 'Kalle Kilju',
    url: 'www.google.com',
    likes: 69,
  };

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container;
  });

  test('renders title correctly', () => {
    const element = screen.getByText('Kuinka kaatua by Kalle Kilju');
    expect(element).toBeDefined();
  });
  test('At start url, like and user are not visible', () => {
    const element = container.querySelector('.toggleableDiv');
    expect(element).toHaveStyle(
      'max-height: 0; overflow: hidden; transition: max-height 0.4s ease-in-out, padding 0.4s ease-in-out; padding: 0px;'
    );
  });
  test('url, like and user are visible after click', async () => {
    const user = userEvent.setup();
    const button = container.querySelector('.toggleVisibility');
    await user.click(button);
    const element = container.querySelector('.toggleableDiv');
    expect(element).toHaveStyle(
      'max-height: 0px; overflow: hidden; transition: max-height 0.4s ease-in-out, padding 0.4s ease-in-out; padding: 10px 0px;'
    );
  });

  test('clicking twice on the like button calls the function twice', async () => {
    cleanup();
    const mockHandler = vi.fn();
    const user = userEvent.setup();
    render(<LikeButton onClick={mockHandler} />);
    const button = screen.getByText('like');
    await user.click(button);
    await user.click(button);
    expect(mockHandler.mock.calls).toHaveLength(2);
    cleanup();
  });

  test('Testing adding new blog', async () => {
    const setError = vi.fn();
    const setBlogs = vi.fn();
    const setMessage = vi.fn();
    const blogs = [];

    render(
      <AddBlogs
        setError={setError}
        setBlogs={setBlogs}
        blogs={blogs}
        setMessage={setMessage}
      />
    );

    const mockPostBlog = vi.spyOn(apiServices, 'postBlog').mockResolvedValue({
      title: 'New Blog Title',
      author: 'New Blog Author',
      url: 'www.newblog.com',
    });

    const user = userEvent.setup();
    const button = screen.getByText('new blog');
    await user.click(button);

    const titleInput = screen.getByLabelText(/Title/i);
    const authorInput = screen.getByLabelText(/Author/i);
    const urlInput = screen.getByLabelText(/URL/i);

    await user.type(titleInput, 'New Blog Title');
    await user.type(authorInput, 'New Blog Author');
    await user.type(urlInput, 'www.newblog.com');
    const submitButton = screen.getByText('create');
    await user.click(submitButton);
    expect(mockPostBlog).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'New Blog Author',
      url: 'www.newblog.com',
    });

    expect(setBlogs).toHaveBeenCalled();
    expect(setMessage).toHaveBeenCalledWith(
      'A new blog "New Blog Title" by New Blog Author added with url www.newblog.com'
    );
  });
});
