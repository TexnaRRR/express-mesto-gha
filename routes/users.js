const express = require('express');
const { getUsers, getUserById, createUser, updateUser, updateAvatar } = require('../controllers/users');

const router = express.Router();

router.get("/", getUsers)
router.get('/:userId', getUserById);
router.post('/', express.json(), createUser);
router.patch('/me', express.json(), updateUser);
router.patch('/me/avatar', express.json(), updateAvatar);

module.exports = router;
