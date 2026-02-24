const Follow = require('../models/Follow');
const User = require('../models/User');

// Follow a User
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const existingFollow = await Follow.findOne({
      where: { followerId: req.user.id, followingId: userId }
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    await Follow.create({
      followerId: req.user.id,
      followingId: userId
    });

    res.json({ message: '✅ User followed!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Unfollow a User
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const follow = await Follow.findOne({
      where: { followerId: req.user.id, followingId: userId }
    });

    if (!follow) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    await follow.destroy();

    res.json({ message: '✅ User unfollowed!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Followers
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await Follow.findAll({
      where: { followingId: userId },
      include: [{
        model: User,
        as: 'Follower',
        attributes: ['id', 'username', 'avatar', 'fullName']
      }]
    });

    res.json({ followers });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Following
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await Follow.findAll({
      where: { followerId: userId },
      include: [{
        model: User,
        as: 'Following',
        attributes: ['id', 'username', 'avatar', 'fullName']
      }]
    });

    res.json({ following });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};