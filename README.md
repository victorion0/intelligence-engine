# Intelligence Query Engine

A production-ready backend system for Insighta Labs to query demographic profile data with advanced filtering, sorting, pagination, and natural language search.

## Features

- **Advanced Filtering**: Filter profiles by gender, age group, country, age range, and confidence probabilities
- **Combined Filters**: All filters can be combined for precise queries
- **Sorting**: Sort results by age, creation date, or gender probability
- **Pagination**: Efficient pagination with configurable page size (max 50)
- **Natural Language Search**: Rule-based English query parsing (no AI/LLM)
- **Performance**: Indexed database fields for fast queries
- **UUID v7**: All profile IDs use time-ordered UUID v7

## Tech Stack

- Node.js + Express
- PostgreSQL (hosted on Supabase or any PostgreSQL provider)
- Prisma ORM
- UUID v7 for unique identifiers

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
   ```
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Push schema to database:
   ```bash
   npx prisma db push
   ```
6. Seed the database with 2026 profiles:
   ```bash
   npx prisma seed
   ```
7. Start the server:
   ```bash
   npm run dev
   ```

## Endpoints

### GET /api/profiles
Get profiles with filtering, sorting, and pagination.

**Query Parameters**:
- `gender`: "male" | "female"
- `age_group`: "child" | "teenager" | "adult" | "senior"
- `country_id`: 2-letter ISO code (e.g., "NG")
- `min_age`: Minimum age (integer)
- `max_age`: Maximum age (integer)
- `min_gender_probability`: Minimum gender confidence (0-1)
- `min_country_probability`: Minimum country confidence (0-1)
- `sort_by`: "age" | "created_at" | "gender_probability"
- `order`: "asc" | "desc" (default: "asc")
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10, max: 50)

**Example**:
```bash
curl "http://localhost:3000/api/profiles?gender=male&country_id=NG&min_age=25&sort_by=age&order=desc&page=1&limit=10"
```

**Response**:
```json
{
  "status": "success",
  "page": 1,
  "limit": 10,
  "total": 2026,
  "data": [ ... ]
}
```

### GET /api/profiles/search?q=<query>
Natural language search for profiles.

**Query Parameters**:
- `q`: Natural language query (e.g., "young males from nigeria")
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10, max: 50)

**Supported Query Patterns**:
- "young males" → gender=male + age 16-24
- "females above 30" → gender=female + min_age=30
- "people from angola" → country_id=AO
- "adult males from kenya" → gender=male + age_group=adult + country_id=KE
- "male and female teenagers above 17" → age_group=teenager + min_age=17

**Example**:
```bash
curl "http://localhost:3000/api/profiles/search?q=young%20males%20from%20nigeria"
```

## Error Responses

All errors follow this format:
```json
{
  "status": "error",
  "message": "<error message>"
}
```

- `400 Bad Request`: Missing or empty parameters
- `422 Unprocessable Entity`: Invalid parameter types/values
- `404 Not Found`: Profile not found
- `500 Internal Server Error`: Server failure

## Database Schema

Profiles table follows this exact structure:

| Field                | Type       | Notes                     |
|----------------------|------------|---------------------------|
| id                   | UUID v7    | Primary key               |
| name                 | VARCHAR    | Unique, full name         |
| gender               | VARCHAR    | "male" or "female"        |
| gender_probability   | FLOAT      | Confidence score (0-1)    |
| age                  | INT        | Exact age                 |
| age_group            | VARCHAR    | child/teenager/adult/senior |
| country_id           | VARCHAR(2) | ISO country code          |
| country_name         | VARCHAR    | Full country name         |
| country_probability  | FLOAT      | Confidence score (0-1)    |
| created_at           | TIMESTAMP  | Auto-generated (UTC)      |

## Notes

- Re-running the seed script will not create duplicate records (uses upsert by name)
- CORS is enabled for all origins (`Access-Control-Allow-Origin: *`)
- All timestamps are in UTC ISO 8601 format
- No AI/LLM used in natural language parsing (rule-based only)
