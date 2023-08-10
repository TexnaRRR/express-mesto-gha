const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { PORT = 3000 } = process.env;
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const URL = 'mongodb://localhost:27017/mestodb';
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64d294c9ac8e9dea651943b7' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})