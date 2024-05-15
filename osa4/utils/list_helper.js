const R = require('ramda');

const getTotalLikes = (blogs) => {
  const totalLikes = blogs?.reduce((total, blog) => {
    return total + blog.likes;
  }, 0);

  return totalLikes;
};

const favouriteBlog = (blogs) => {
  const mostLikedBlog = blogs?.reduce((mostLiked, blog) => {
    return mostLiked.likes > blog.likes ? mostLiked : blog;
  });
  return mostLikedBlog;
};

const mostBlogs = R.pipe(
  R.groupBy(R.prop('author')), // Group blogs by author
  R.map(R.length), // Count the number of blogs for each author
  R.toPairs, // Convert object to array of key-value pairs
  R.reduce(
    (acc, [author, count]) => {
      return acc.blogs >= count ? acc : { author, blogs: count };
    },
    { author: '', blogs: 0 }
  )
);

const mostLikes = R.pipe(
  R.groupBy(R.prop('author')), // Group blogs by author
  R.mapObjIndexed((blogs) => {
    // Map over the grouped blogs
    const totalLikes = R.reduce((acc, blog) => acc + blog.likes, 0, blogs);
    return totalLikes;
  }),
  R.toPairs, // Convert object to array of key-value pairs
  R.reduce((maxLikesAuthor, [author, likes]) => { // Find the author with the highest total likes
    return likes > maxLikesAuthor.likes ? { author, likes } : maxLikesAuthor;
  }, { author: '', likes: 0 }),
  //
);

module.exports = {
  getTotalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
