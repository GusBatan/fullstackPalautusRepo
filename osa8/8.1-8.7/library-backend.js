const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');
const { GraphQLError } = require('graphql');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = `
type Mutation {
  addAuthor(name: String!, born: Int): Author
  editAuthor(name: String!, born: Int!): Author
  addBook(    
    title: String!
    published: Int!
    author: String!
    genres: [String!]
   ): Book
   createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
  value: String!
}
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: Int!
  }
  
`;

const resolvers = {
  Mutation: {
    addAuthor: async (root, args) => {
      const author = new Author({
        name: args.name,
        born: args.born,
      });

      try {
        const savedAuthor = await author.save();
        return savedAuthor;
      } catch (error) {
        throw new GraphQLError('Failed to add author', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            details: error.message,
          },
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        value: jwt.sign(userForToken, process.env.SECRET),
      };
    },
    addBook: async (root, args, context) => {
      console.log(context);
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        console.log('before');
        author = new Author({ name: args.author, born: null });
        console.log('after');
        try {
          await author.save();
        } catch (err) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              argumentName: 'field',
            },
          });
        }
      }
      const newBook = new Book({
        author,
        title: args.title,
        published: args.published,
        genres: args.genres,
      });
      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            details: error.message,
          },
        });
      }
      return newBook;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      await Author.updateOne(
        { name: args.name },
        {
          $set: {
            ...author.document,
            born: args.born,
          },
        },
        {}
      );
      const books = await Book.find({}).populate('author');
      const updatedAuthor = await Author.findOne({ name: args.name });
      updatedAuthor.bookCount = books.filter(
        (book) => book.author.name === updatedAuthor.name
      ).length;
      return updatedAuthor;
    },
  },
  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return [];
        }
        query.author = author._id;
      }
      if (args.genre) {
        query.genres = { $in: [args.genre] };
      }

      const books = await Book.find(query).populate('author');
      return books;
    },
    allAuthors: async () => {
      try {
        const authors = await Author.find({});
        const books = await Book.find({}).populate('author');

        return authors.map((author) => {
          const authorBooks = books.filter(
            (book) => book?.author?.name === author.name
          );
          return {
            ...author.toObject(),
            bookCount: authorBooks.length,
          };
        });
      } catch (error) {
        throw new GraphQLError('Failed to fetch authors', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            details: error.message,
          },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
