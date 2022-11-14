require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { NODE_ENV, PORT = 3000, DB_CONNECTION_STRING } = process.env;

const NotFoundError = require('./errors/not-found-err');

// Подключаю БД
mongoose.connect(NODE_ENV === 'production' ? DB_CONNECTION_STRING : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Превращаю тело запроса в удобный формат JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Разрешаю CORS
app.use(cors({
  origin: ['http://localhost:3000',
    'https://bitfilms.smirnov.nomoredomains.icu/',
    'http://bitfilms.smirnov.nomoredomains.icu/',
  ],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}));

// Подключаю логгер запросов
app.use(requestLogger);

// Краш-тест. После код-ревью удалить.
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Роуты
app.use(require('./routes/signup'));
app.use(require('./routes/signin'));
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

// Роут на ненайденную страницу
app.use('/*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

// Подключаю логгер ошибок
app.use(errorLogger);

// Мидлвара celebrate для отправки ошибки пользователю
app.use(errors());

// Централизованный обработчик ошибок
app.use((err, res) => {
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
