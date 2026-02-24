const Notification = require('../models/Notification');
const User = require('../models/User');

// Get Notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      include: [{
        model: User,
        as: 'Sender',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ notifications });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark as Read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id } }
    );

    res.json({ message: '✅ Notifications marked as read!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Notification (internal use)
exports.createNotification = async (userId, senderId, type, postId = null) => {
  try {
    await Notification.create({
      userId,
      senderId,
      type,
      postId
    });
  } catch (error) {
    console.error('Notification error:', error.message);
  }
};