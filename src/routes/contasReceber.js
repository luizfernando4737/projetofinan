const express = require('express');
const router = express.Router();
const ContaReceberController = require('../controllers/ContaReceberController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', ContaReceberController.index);
router.post('/', ContaReceberController.store);
router.get('/:id', ContaReceberController.show);
router.put('/:id', ContaReceberController.update);
router.delete('/:id', ContaReceberController.destroy);

module.exports = router; 