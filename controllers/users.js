const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error401 = require('../errors/401');
const Error404 = require('../errors/404');
const Error409 = require('../errors/409');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error404('Пользователь не найден');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hashPass = await bcrypt.hash(password, 10);
    await User.create({
      name,
      about,
      avatar,
      email,
      password: hashPass,
    });

    res.status(201).send({
      name,
      about,
      avatar,
      email,
    });
  } catch (err) {
    if (err.code === 11000) {
      const conflict = new Error409('email уже существует');
      next(conflict);
    } else {
      next(err);
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new Error404('Пользователь не обновлен');
    } else {
      res.send(user);
    }
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new Error404('Аватар не обновлен');
    } else {
      res.send(user);
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error401('Неверные почта или пароль');
    }

    const token = jwt.sign(
      { _id: user._id },
      'FJeq0bP5YA}j#AJnGZWzrB*JY%lTt6',
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send({ message: 'Успех успешный' });
  } catch (err) {
    next(err);
  }
};

const getAboutMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error404('Пользователь не найден');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getAboutMe,
};
