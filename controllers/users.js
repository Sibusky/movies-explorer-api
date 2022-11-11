const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

// Импортирую классы ошибок

// Возвращаю текущего пользователя
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.send('Пользователь не нашёлся');
      }
      return res.status(200).send(user);
    });
};

// Создаю пользователя
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err.message);
      } else if (err.code === 11000) {
        next(err.message);
      } else {
        next();
      }
    });
};

// Аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

// Обновление профиля
module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    email: req.body.email,
    name: req.body.name,
  }, {
    new: true, // обработчик then получает на вход обновлённую запись
    runValidators: true, // запуск валидации
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.send('Ты передал некорректные данные'));
      } else {
        next(err);
      }
    });
};
