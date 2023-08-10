const { Card } = require('../models/card');

async function getCards(req, res) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Что-то пошло не так' });
  }
}

async function createCard(req, res) {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((error) => error.message)
        .join('; ');

      res.status(400).send({ message });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' });
    }
  }
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные о карточке' });
    } else {
    res.status(500).send({ message: err.message });
    }
  }
}

async function addLike(req, res) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные о карточке' });
    } else {
    res.status(500).send({ message: err.message });
    }
  }
}

async function deleteLike(req, res) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные о карточке' });
    } else {
    res.status(500).send({ message: err.message });
    }
  }
}

module.exports = { getCards, createCard, deleteCard, addLike, deleteLike };