const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV ? JWT_SECRET : 'secretkey',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ jwt: token })
        .end();
    })
    .catch(next);
}

async function getUsers(req, res) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send({ message: 'Пользователь с таким id не найден' });
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные о пользователе' });
    } else {
    res.status(500).send({ message: err.message });
    }
  }
}

async function createUser(req, res) {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashPassword, name, about, avatar,
    });
    res.status(200).send({
      user: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      const message = Object.values(err.errors)
        .map((error) => error.message)
        .join('; ');

      res.status(400).send({ message });
    } else {
    res.status(500).send({ message: err.message });
    }
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((error) => error.message)
        .join('; ');

      res.status(400).send({ message });
    } else {
    res.status(500).send({ message: err.message });
    }
  }
}

async function getCurrentUser(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    console.log(userId);

    if (!user) {
      res.status(404).send({ message: 'Пользователь с таким id не найден' });
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Неверный формат данных в запросе' });
      return;
   } else {
      res.status(500).send({ message: err.message });
      }
  }
}


async function updateAvatar(req, res) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((error) => error.message)
        .join('; ');

      res.status(400).send({ message });
    } else {
    res.status(500).send({ message: err.message });
    }
  }
}

module.exports = { login, getCurrentUser, getUsers, getUserById, createUser, updateUser, updateAvatar };