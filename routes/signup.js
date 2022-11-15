const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');

// Валидирую данные для регистрации, используя celebrate
const bodyValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

// Роут создания нового пользователя
router.post('/signup', bodyValidation, createUser);

module.exports = router;
