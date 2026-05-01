const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');


async function registerUserController(req, res) {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
      }

      const hash = await bcrypt.hash(password, 10);

      const user = new userModel({
            username,
            email,
            password: hash
      });

      const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
      );

      const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000
      };

      res.cookie('token', token, cookieOptions);

      res.status(201).json({
            message: 'User registered successfully',
            user: {
                  id: user._id,
                  username: user.username,
                  email: user.email
            }
      });

}

async function loginUserController(req, res) {
      const { email, password } = req.body;

      if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
      );

      const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000
      };

      res.cookie('token', token, cookieOptions);

      res.status(200).json({
            message: 'User logged in successfully',
            token,
            user: {
                  id: user._id,
                  username: user.username,
                  email: user.email
            }
      });
}

async function logoutUserController(req, res) {
      const token = req.cookies.token;
      if (!token) {
            return res.status(400).json({ message: 'No token provided' });
      }

      const blacklistToken = new blacklistModel({ token });
      await blacklistToken.save();
      res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
      });
      res.status(200).json({ message: 'User logged out successfully' });

}

async function getMeController(req, res) {
      const user = await userModel.findById(req.user.id).select('-password');
      if (!user) {
            return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({
            message: "User found",
            user
      });
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController };