const router = require('express').Router();
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getAboutMe,
} = require('../controllers/users');

const {
  userValidation,
  userUpdateValidation,
  userCreateValidation,
  userAvatarUpdateValidation,
} = require('../utils/joiSchemes');

router.post('/signup', celebrate(userCreateValidation), createUser);
router.post('/signin', celebrate(userCreateValidation), login);
router.get('/users', auth, getUsers);
router.get('/users/me', auth, getAboutMe);
router.get('/users/:id', auth, celebrate(userValidation), getUserById);
router.patch('/users/me', auth, celebrate(userUpdateValidation), updateUser);
router.patch(
  '/users/me/avatar',
  auth,
  celebrate(userAvatarUpdateValidation),
  updateAvatar,
);

module.exports = router;
