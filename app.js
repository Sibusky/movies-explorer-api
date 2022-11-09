const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000 } = process.env;

// Подключаю БД

// Валидирую данные данные

// Превращаю тело запроса в удобный формат JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Разрешаю CORS

// Подключаю логгер запросов

// Краш-тест. После код-ревью удалить.

// Роуты не требующие авторизации: логин и регистрация

// Роут авторизации

// Роуты, требующие авторизации

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
