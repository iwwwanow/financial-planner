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
    'http://localhost:3000',   // React/Next.js
    'http://localhost:5173',   // Vite
    'http://localhost:8080',   // Vue CLI
    'http://127.0.0.1:5173'    // альтернативный localhost
  ],
  credentials: true,           // разрешает отправку cookies/Authorization
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
