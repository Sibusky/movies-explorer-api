const Movie = require('../models/movies');

// Импортирую классы ошибок
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// Возвращаю сохранённые фильмы
module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

// Создаю фильм (добавляю в коллекцию сохранённых)
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании сохранении фильма'));
      } else {
        next(err);
      }
    });
};

// Удаляю фильм по id
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Можно удалять только свой фильм');
      }
      return movie.remove()
        .then(res.status(200).send({ message: `Удалён фильм под названием ${movie.nameEN} режиссёра ${movie.director}` }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные фильма'));
      } else {
        next(err);
      }
    });
};
