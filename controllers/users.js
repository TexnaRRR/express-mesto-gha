const { User } = require('../models/user');
const NotFound = require('../errors/notFound');
const {
  OK_STATUS,
  OK_CREATED_STATUS,
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_STATUS,
} = require('../errors/errors');


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
      const error = new Error('Пользователь с данным id не найден');
      error.name = 'NotFoundError';
      throw error;
    }

    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function createUser(req, res) {
  try {
    const { name, about, avatar } = req.body;
    if (!name || name.length < 2) {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Некорректные данные' });
      return;
    }
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
      const message = Object.values(err.errors)
        .map((error) => error.message)
        .join('; ');

      res.status(BAD_REQUEST_STATUS).send({ message });
    } else {
      res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
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
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
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
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, updateAvatar };