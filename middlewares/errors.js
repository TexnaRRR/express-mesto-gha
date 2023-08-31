const mongoose = require('mongoose');

const BAD_REQUEST = 400;
const INTERVAL_SERVER_ERROR = 500;

module.exports = (err, req, res, next) => {
  const { statusCode = INTERVAL_SERVER_ERROR, message } = err;

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' });
  }

  res.status(statusCode).send(statusCode === 500 ? { message: 'На сервере произошла ошибка' } : { message });

  return next();
};
