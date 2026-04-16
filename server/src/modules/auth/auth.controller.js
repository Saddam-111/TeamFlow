import userService from '../user/user.service.js';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const user = await userService.createUser({ username, email, password });
      const tokens = userService.generateTokens(user);

      await userService.updateRefreshToken(user._id, tokens.refreshToken);

      res.status(201).json({
        user,
        ...tokens
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const user = await userService.findUserByEmail(email);
      
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const tokens = userService.generateTokens(user);
      await userService.updateRefreshToken(user._id, tokens.refreshToken);

      res.json({ user, ...tokens });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
      }

      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await userService.findUserById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      const tokens = userService.generateTokens(user);
      await userService.updateRefreshToken(user._id, tokens.refreshToken);

      res.json(tokens);
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  async logout(req, res) {
    try {
      const userId = req.user.id;
      await userService.updateRefreshToken(userId, null);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async me(req, res) {
    try {
      const user = await userService.findUserById(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AuthController();
