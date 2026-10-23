const router = require('express').Router();
const { getTransactions, createTransaction, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getTransactions).post(createTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;