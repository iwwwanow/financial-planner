require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 👈 добавили
const { initDb } = require('./db');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());

// 🔧 Настройка CORS для локальной разработки
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5500',  // ✅ Добавьте эту строку
    'http://localhost:5500'    // ✅ И эту для надёжности
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions)); // 👈 должно быть ДО роутов

// Префлайт-запросы обрабатываются автоматически, но можно явно:
app.options('*', cors(corsOptions));

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
