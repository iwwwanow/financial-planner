const express = require('express');
const { db } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const { category_id, type, date_from, date_to } = req.query;

  let sql = `
    SELECT t.id, t.category_id, c.name AS category_name,
           t.amount, t.type, t.description, t.date
    FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.user_id = ?
  `;
  const args = [req.user.id];

  if (category_id) { sql += ' AND t.category_id = ?'; args.push(category_id); }
  if (type)        { sql += ' AND t.type = ?';        args.push(type); }
  if (date_from)   { sql += ' AND t.date >= ?';       args.push(date_from); }
  if (date_to)     { sql += ' AND t.date <= ?';       args.push(date_to); }

  sql += ' ORDER BY t.date DESC';

  const result = await db.execute({ sql, args });
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { category_id, amount, type, description, date } = req.body;

  if (!amount || !type || !date) {
    return res.status(400).json({ error: 'amount, type, and date required' });
  }
  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: 'type must be income or expense' });
  }

  if (category_id) {
    const cat = await db.execute({
      sql: 'SELECT id FROM categories WHERE id = ? AND user_id = ?',
      args: [category_id, req.user.id],
    });
    if (cat.rows.length === 0) return res.status(400).json({ error: 'Category not found' });
  }

  const result = await db.execute({
    sql: 'INSERT INTO transactions (user_id, category_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?)',
    args: [req.user.id, category_id || null, amount, type, description || null, date],
  });

  res.status(201).json({
    id: Number(result.lastInsertRowid),
    category_id: category_id || null,
    amount,
    type,
    description: description || null,
    date,
  });
});

router.delete('/:id', async (req, res) => {
  const result = await db.execute({
    sql: 'DELETE FROM transactions WHERE id = ? AND user_id = ?',
    args: [req.params.id, req.user.id],
  });

  if (result.rowsAffected === 0) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.sendStatus(204);
});

module.exports = router;
