const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { PORT = 3000 } = process.env;
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64d50583b3d8b86021bd9d31' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Неправильный путь" });
});
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})