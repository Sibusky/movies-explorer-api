const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

router.use(require('./signup'));
router.use(require('./signin'));
router.use(require('./users'));
router.use(require('./movies'));

router.use('/*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
