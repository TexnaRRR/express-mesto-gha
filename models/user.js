const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v) {
          return validator.isURL(v);
        },
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
        message: 'Введенное значение не является email адресом',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .orFail(new UnauthorizedError('Неправильный email или пароль'))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError('Неправильный email или пароль'));
        }

        return user;
      }));
};

const User = mongoose.model('user', userSchema);

module.exports = { User };