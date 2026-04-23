# Intelligence Query Engine

A backend system for querying and filtering demographic profile data with support for advanced filtering, sorting, pagination, and natural language query parsing.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (Neon)
- JavaScript

---

## 📦 Installation

```bash
npm install

⚙️ Environment Variables

Create a .env file:

DATABASE_URL="your_neon_database_url"
🗄️ Database Setup
npx prisma db push

Seed database:

node prisma/seed/seed.js
▶️ Run Server
node src/server.js

Server runs on:

http://localhost:3000
📌 API Endpoints
1. Get Profiles (Filtering + Sorting + Pagination)
GET /api/profiles
Query Params:
gender
age_group
country_id
min_age
max_age
sort_by (age | created_at | gender_probability)
order (asc | desc)
page
limit
Example:
/api/profiles?gender=male&country_id=NG&sort_by=age&order=desc
2. Natural Language Search
GET /api/profiles/search?q=
Examples:
/api/profiles/search?q=young males from nigeria
/api/profiles/search?q=females above 30
/api/profiles/search?q=adult males from kenya
🧠 NLP Rules
“young” = age 16–24
“above 30” = min_age 30
country names mapped to ISO codes
rule-based parsing only (no AI/LLMs)
📊 Response Format
{
  "status": "success",
  "page": 1,
  "limit": 10,
  "total": 100,
  "data": []
}
❌ Error Format
{
  "status": "error",
  "message": "Error description"
}
⚡ Features
Advanced filtering
Combined query support
Sorting
Pagination
Natural language query parsing
Duplicate-safe seeding