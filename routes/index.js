const router = require('express').Router();
const { errors } = require('celebrate');
const users = require('./users');
const cards = require('./cards');
const signin = require('./signin');
const signup = require('./signup');
const auth = require('../middlewares/auth');
const errorsGlobal = require('../middlewares/errors');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');

router.use('/signin', signin);
router.use('/signup', signup);
router.use(auth);
router.use('/users', users);
router.use('/cards', cards);
router.use('/*', () => {
  throw new DocumentNotFoundError('Ошибка 404. Запрашиваемый ресурс не найден');
});
router.use(errors());
router.use(errorsGlobal);

module.exports = router;
