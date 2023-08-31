const router = require('express').Router();
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

const {
  cardValidationId,
  cardCreateValidation,
} = require('../utils/joiSchemes');

router.get('/cards', auth, getCards);
router.post('/cards', auth, celebrate(cardCreateValidation), createCard);
router.delete('/cards/:id', auth, celebrate(cardValidationId), deleteCard);
router.put('/cards/:id/likes', auth, celebrate(cardValidationId), addLike);
router.delete(
  '/cards/:id/likes',
  auth,
  celebrate(cardValidationId),
  removeLike,
);

module.exports = router;
