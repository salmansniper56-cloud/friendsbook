const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      text
    });

    res.status(201).json({
      message: '✅ Message sent!',
      data: message
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Conversation
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id, receiverId: userId },
          { senderId: userId, receiverId: req.user.id }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    res.json({ messages });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Conversations
exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'Receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ messages });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};