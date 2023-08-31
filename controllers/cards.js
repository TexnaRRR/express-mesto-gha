const Card = require('../models/card');
const Error404 = require('../errors/404');
const Error403 = require('../errors/403');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    if (!card) {
      throw new Error404('Карточка не создана');
    } else {
      res.status(201).send(card);
    }
  } catch (err) {
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const card = await Card.findById(id);
    if (!card) {
      throw new Error404('Карточка не найдена');
    }

    if (card.owner.toString() !== userId) {
      throw new Error403('Нет прав на удаление карточки');
    }

    await Card.findByIdAndRemove(card._id);

    res.send({ message: 'Карточка удалена' });
  } catch (err) {
    next(err);
  }
};

const addLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new Error404('Карточка не найдена');
    }
    res.send(card);
  } catch (err) {
    next(err);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new Error404('Карточка не найдена');
    }
    res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
