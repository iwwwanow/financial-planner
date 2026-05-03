# REST API — Financial Planner

Base URL: `http://localhost:3000`

Все защищённые маршруты требуют заголовка:
```
Authorization: Bearer <token>
```

---

## Auth

### POST /auth/register
Регистрация нового пользователя.

**Body:**
```json
{ "email": "user@example.com", "password": "secret" }
```
**Response 201:**
```json
{ "token": "<jwt>" }
```

---

### POST /auth/login
Логин, возвращает JWT.

**Body:**
```json
{ "email": "user@example.com", "password": "secret" }
```
**Response 200:**
```json
{ "token": "<jwt>" }
```

---

## Categories 🔒

### GET /categories
Список категорий текущего пользователя.

**Response 200:**
```json
[
  { "id": 1, "name": "Продукты" },
  { "id": 2, "name": "Зарплата" }
]
```

---

### POST /categories
Создать категорию.

**Body:**
```json
{ "name": "Транспорт" }
```
**Response 201:**
```json
{ "id": 3, "name": "Транспорт" }
```

---

### DELETE /categories/:id
Удалить категорию.

**Response 204:** No content

---

## Transactions 🔒

### GET /transactions
Список транзакций с опциональными фильтрами.

**Query params:**
- `category_id` — фильтр по категории
- `type` — `income` или `expense`
- `date_from` — ISO date, например `2024-01-01`
- `date_to` — ISO date

**Response 200:**
```json
[
  {
    "id": 1,
    "category_id": 2,
    "category_name": "Зарплата",
    "amount": 100000,
    "type": "income",
    "description": "Январь",
    "date": "2024-01-10"
  }
]
```

---

### POST /transactions
Создать транзакцию.

**Body:**
```json
{
  "category_id": 1,
  "amount": 500,
  "type": "expense",
  "description": "Хлеб и молоко",
  "date": "2024-01-15"
}
```
**Response 201:**
```json
{ "id": 5, "category_id": 1, "amount": 500, "type": "expense", "description": "Хлеб и молоко", "date": "2024-01-15" }
```

---

### DELETE /transactions/:id
Удалить транзакцию.

**Response 204:** No content

---

## Итого: 8 эндпоинтов

| # | Метод  | Путь               | Auth |
|---|--------|--------------------|------|
| 1 | POST   | /auth/register     | —    |
| 2 | POST   | /auth/login        | —    |
| 3 | GET    | /categories        | ✓    |
| 4 | POST   | /categories        | ✓    |
| 5 | DELETE | /categories/:id    | ✓    |
| 6 | GET    | /transactions      | ✓    |
| 7 | POST   | /transactions      | ✓    |
| 8 | DELETE | /transactions/:id  | ✓    |
