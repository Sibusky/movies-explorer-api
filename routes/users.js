const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegEx } = require('../utils/constants');
const { getCurrentUser, updateProfile } = require('../controllers/users');

// Валидация обновления профиля
const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

// Возвращаю информацию о пользователе
router.get('/me', getCurrentUser);

// Обновляю информацию о пользователе
// router.patch('/me', updateProfileValidation, updateProfile)

module.exports = router;
