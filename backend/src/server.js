const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const { connectDB, syncDB } = require('./config/database');
connectDB();
const User = require('./models/User');
const Post = require('./models/Post');
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

const Like = require('./models/Like');
Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Like, { foreignKey: 'postId' });
const Comment = require('./models/Comment');
Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Comment, { foreignKey: 'postId' });
const Follow = require('./models/Follow');


Follow.belongsTo(User, { as: 'Follower', foreignKey: 'followerId' });
Follow.belongsTo(User, { as: 'Following', foreignKey: 'followingId' });
const Story = require('./models/Story');
Story.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Story, { foreignKey: 'userId' });
const Notification = require('./models/Notification');
Notification.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Notification.belongsTo(User, { foreignKey: 'userId' });
const Message = require('./models/Message');
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });

syncDB();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const likeRoutes = require('./routes/likes');
const commentRoutes = require('./routes/comments');
const followRoutes = require('./routes/follows');
const storyRoutes = require('./routes/stories');
const notificationRoutes = require('./routes/notifications');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '🚀 FriendsBook API is running!',
    version: '1.0.0'
  });
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ FriendsBook server running on port ${PORT}`);
});