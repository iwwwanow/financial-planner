const express = require('express');
const { db } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await db.execute({
    sql: 'SELECT id, name FROM categories WHERE user_id = ?',
    args: [req.user.id],
  });
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name required' });
  }

  const result = await db.execute({
    sql: 'INSERT INTO categories (user_id, name) VALUES (?, ?)',
    args: [req.user.id, name],
  });
  res.status(201).json({ id: Number(result.lastInsertRowid), name });
});

router.delete('/:id', async (req, res) => {
  const result = await db.execute({
    sql: 'DELETE FROM categories WHERE id = ? AND user_id = ?',
    args: [req.params.id, req.user.id],
  });

  if (result.rowsAffected === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.sendStatus(204);
});

module.exports = router;
