require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const app = express();
const { PORT = 3000 } = process.env;

const NotFoundError = require('./errors/not-found-err');

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

// Роуты не требующие авторизации: логин и регистрация
app.post('/signup', bodyValidation, createUser);
app.post('/signin', loginValidation, login);

// Роут авторизации
app.use(auth);

// Роуты, требующие авторизации
app.use('/users', auth, usersRouter);
app.use('/movies', auth, moviesRouter);

// Роут на ненайденную страницу
app.use('/*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

// Подключаю логгер ошибок

// Мидлвара celebrate для отправки ошибки пользователю
app.use(errors());

// Обработчик ошибок

app.post('/', (req, res) => {
  console.log(req.body);
  res.json(req.headers);
});

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});

// Вопросы
//
