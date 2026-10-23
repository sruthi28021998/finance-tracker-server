const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');

exports.getTransactions = asyncHandler(async (req, res) => {
  const q = { user: req.user._id };
  const { type, category, from, to } = req.query;
  if (type) q.type = type;
  if (category) q.category = category;
  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      q.date.$lte = end;
    }
  }
  const items = await Transaction.find(q).sort({ date: -1, createdAt: -1 });
  res.json(items);
});

exports.createTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, note, date } = req.body;
  if (!['income', 'expense'].includes(type) || !category || !(Number(amount) > 0)) {
    res.status(400);
    throw new Error('Valid type, category and amount are required');
  }
  const created = await Transaction.create({
    user: req.user._id,
    type,
    category,
    amount: Number(amount),
    note,
    date: date || Date.now(),
  });
  res.status(201).json(created);
});

exports.deleteTransaction = asyncHandler(async (req, res) => {
  const removed = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!removed) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  res.json({ id: req.params.id });
});