const express = require('express');
const { getCards, createCard, deleteCard, addLike, deleteLike } = require('../controllers/cards');
const router = express.Router();

router.get('/', getCards);
router.post('/', express.json(), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', deleteLike);


module.exports = router;
