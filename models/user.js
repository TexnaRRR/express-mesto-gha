const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'введите email'],
      unique: true,
      validate: {
        validator: (a) => validator.isEmail(a),
        message: 'Неверный email',
      },
    },

    password: {
      type: String,
      select: false,
      required: [true, 'введите пароль'],
    },

    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'минимальное кол-во символов - 2'],
      maxlength: [30, 'максимальное кол-во символов - 30'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'минимальное кол-во символов - 2'],
      maxlength: [30, 'максимальное кол-во символов - 30'],
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (a) => validator.isURL(a),
        message: 'Неверный email',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('User', userSchema);
