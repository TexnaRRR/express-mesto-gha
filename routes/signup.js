const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { createUser } = require('../controllers/users');;

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/\S+$/i),
  }),
}), createUser);

module.exports = router;
