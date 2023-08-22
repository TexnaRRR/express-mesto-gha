const { User } = require('../models/user');

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
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(201).send({ data: user });
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

async function updateAvatar(req, res) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
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

module.exports = { getUsers, getUserById, createUser, updateUser, updateAvatar };