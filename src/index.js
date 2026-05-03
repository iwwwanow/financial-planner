require('dotenv').config();
const express = require('express');
const { initDb } = require('./db');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/categories', auth, require('./routes/categories'));
app.use('/transactions', auth, require('./routes/transactions'));

const PORT = process.env.PORT || 3000;

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to initialize DB:', err);
  process.exit(1);
});
