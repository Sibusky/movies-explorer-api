const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { urldRegEx } = require('../utils/constants');

// Валидация создания фильма
const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urldRegEx),
    trailerLink: Joi.string().required().pattern(urldRegEx),
    thumbnail: Joi.string().required().pattern(urldRegEx),
    owner: Joi.string().required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

// Валидация id фильма
const movieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24),
  }),
});

// Возвращаю все сохранённые текущим  пользователем фильмы
router.get('/', getSavedMovies);

// Создаю фильм с новыми данными
router.post('/', createMovieValidation, createMovie);

// Удаляю сохранённый фильм по id
router.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
