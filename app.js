const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser } = require('./controllers/users')
const usersRouter = require('./routes/users');

const app = express();
const { PORT = 3000 } = process.env;

// Подключаю БД
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Валидирую данные для регистрации, используя celebrate
const bodyValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

// Валидирую данные для логина, используя celebrate
const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});


// Превращаю тело запроса в удобный формат JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Разрешаю CORS

// Подключаю логгер запросов

// Краш-тест. После код-ревью удалить.

// Роуты не требующие авторизации: логин и регистрация ПОДКЛЮЧИТЬ ВАЛИДАЦИЮ
app.post('/signup', bodyValidation, createUser);

// Роут авторизации

// Роуты, требующие авторизации ДОБАВИТЬ АВТОРИЗАЦИЮ
app.use('/users', usersRouter);

// Роут на ненайденную страницу

// Подключаю логгер ошибок

// Мидлвара celebrate для отправки ошибки пользователю

// Обработчик ошибок

app.post('/', (req, res) => {
  console.log(req.body);
  res.json(req.headers);
});

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});

// Вопросы
// После подключения валидации, не работает минимальная длина пароля