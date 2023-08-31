const jwt = require('jsonwebtoken');
const Error401 = require('../errors/401');

const middlewareAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    const noToken = new Error401('Токен отстутствует');
    next(noToken);
    return;
  }
  try {
    req.user = jwt.verify(token, 'FJeq0bP5YA}j#AJnGZWzrB*JY%lTt6');
    next();
  } catch {
    const badToken = new Error401('Токен недействителен');
    next(badToken);
  }
};

module.exports = middlewareAuth;
