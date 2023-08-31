const router = require('express').Router();

const userRouter = require('./users');
const cardsRouter = require('./cards');
const Error404 = require('../errors/404');

router.use(userRouter);
router.use(cardsRouter);
router.use((req, res, next) => {
  next(new Error404('несуществующий адрес'));
});

module.exports = router;
