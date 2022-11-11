const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateProfile } = require('../controllers/users');

// Валидация обновления профиля
const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30),
    name: Joi.string().min(2).max(30),
  }),
});

// Возвращаю информацию о пользователе
router.get('/me', getCurrentUser);

// Обновляю информацию о пользователе
router.patch('/me', updateProfileValidation, updateProfile);

module.exports = router;
