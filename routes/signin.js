const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login } = require('../controllers/users');

// Валидирую данные для логина, используя celebrate
const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// Роут входа на сайт
router.post('/signin', loginValidation, login);

module.exports = router;
