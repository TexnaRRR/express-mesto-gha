const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'заполните поле'],
    minlength: [2, 'минимальное кол-во символов - 2'],
    maxlength: [30, 'максимальное кол-во символов - 30'],
  },
  link: {
    type: String,
    required: [true, 'заполните поле'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'заполните поле'],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Сard', cardSchema);
