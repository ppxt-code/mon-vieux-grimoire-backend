const express = require('express');
const bookController = require('../controllers/Book');
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');

const router = express.Router();
router.post('/', auth, multer, bookController.createBook);
router.put('/:id',auth, multer, bookController.updateBook);
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBook);
router.delete('/:id', auth, bookController.deleteBook);
router.post('/:id/rating', auth, bookController.ratingBook);
module.exports = router;