const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

// Импортирую классы ошибок

// Возвращаю текущего пользователя
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    // const { email, password, name, _id } = req.body;

    // const users = await User.find({})
    const user = await User.findById(req.user._id)
    console.log('123')
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

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
        next(err.message)
      } else {
        next();
      }
    });
}

// Аутентификация пользователя

// Обновление профиля