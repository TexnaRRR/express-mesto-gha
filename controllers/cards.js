const Card = require('../models/card');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find()
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
  .then((card) => res.status(201).send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(new DocumentNotFoundError('Запрашиваемая карточка не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return Promise.reject(new ForbiddenError('Недостаточно прав'));
      }
      return Card.findByIdAndDelete(cardId)
        .then(() => res.send({ data: 'Карточка успешно удалена' }));
    })
    .catch(next);
};

const handleCardLike = (req, res, data) => Card.findByIdAndUpdate(
  req.params.cardId,
  data,
  { new: true },
)
  .populate('owner')
  .populate('likes')
  .orFail(new DocumentNotFoundError('Запрашиваемая карточка не найдена'))
  .then((card) => res.send({ data: card }));

module.exports.likeCard = (req, res, next) => {
  handleCardLike(req, res, { $addToSet: { likes: req.user._id } }).catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  handleCardLike(req, res, { $pull: { likes: req.user._id } }).catch(next);
};
