require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
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

// Разрешаю CORS ИЗМЕНИТЬ НА ТЕКУЩИЕ АДРЕСА СЕРВЕРА ФРОНТЕНДА
app.use(cors({
  origin: ['http://localhost:3000',
    'http://asmirnov.students.nomoredomains.icu',
    'https://asmirnov.students.nomoredomains.icu',
  ],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}));

// Подключаю логгер запросов

// Краш-тест. После код-ревью удалить.
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

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

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляю 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяю статус и выставляю сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});
