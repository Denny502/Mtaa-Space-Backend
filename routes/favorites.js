const express = require('express');
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getFavorites);
router.get('/check/:propertyId', checkFavorite);
router.post('/:propertyId', addFavorite);
router.delete('/:propertyId', removeFavorite);

module.exports = router;