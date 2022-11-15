const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateProfile } = require('../controllers/users');
const auth = require('../middlewares/auth');

// Валидация обновления профиля
const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

// Возвращаю информацию о пользователе
router.get('/users/me', auth, getCurrentUser);

// Обновляю информацию о пользователе
router.patch('/users/me', updateProfileValidation, auth, updateProfile);

module.exports = router;
