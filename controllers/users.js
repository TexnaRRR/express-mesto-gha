const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const ConflictError = require('../errors/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new DocumentNotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send({
      data: user.toObject({ useProjection: true }),
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );
      return res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch(next);
};

module.exports.getAboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, data) => {
  const { _id } = req.user;

  return User.findByIdAndUpdate(
    _id,
    data,
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }));
};

module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about }).catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar }).catch(next);
};
