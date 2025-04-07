const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const SECRET = process.env.JWT_SECRET || 'supersecretkey';
const prisma = new PrismaClient();

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email format.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Email already exists.' });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email format.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred during login.',
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to admins.',
    });
  }
  next();
};

const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      where: { id: req.user.id },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the user.',
    });
  }
};

const userAuthenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: 'Access denied.' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: 'Invalid token.' });
  }
};

module.exports = {
  userRegister,
  userLogin,
  isAdmin,
  getUser,
  userAuthenticate,
};
