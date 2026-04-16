import User from './user.model.js';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';

class UserService {
  async createUser(userData) {
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }]
    });
    
    if (existingUser) {
      throw new Error(existingUser.email === userData.email 
        ? 'Email already in use' 
        : 'Username already taken');
    }
    
    const user = await User.create(userData);
    return user;
  }

  async findUserByEmail(email) {
    return User.findOne({ email });
  }

  async findUserById(id) {
    return User.findById(id);
  }

  async findUserByUsername(username) {
    return User.findOne({ username });
  }

  async updateUser(id, updateData) {
    const allowedUpdates = ['username', 'avatar'];
    const filteredUpdates = {};
    
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        filteredUpdates[key] = updateData[key];
      }
    }
    
    return User.findByIdAndUpdate(id, filteredUpdates, { new: true });
  }

  async updateRefreshToken(userId, token) {
    return User.findByIdAndUpdate(userId, { refreshToken: token });
  }

  async getAllUsers() {
    return User.find().select('-password -refreshToken');
  }

  async searchUsers(query) {
    return User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password -refreshToken');
  }

  generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpire }
    );

    return { accessToken, refreshToken };
  }

  async updateOnlineStatus(userId, isOnline) {
    return User.findByIdAndUpdate(userId, { 
      isOnline, 
      lastSeen: isOnline ? new Date() : undefined 
    });
  }
}

export default new UserService();
