# CareerVerse — Gamified Career Exploration for Teenagers in Kazakhstan

CareerVerse is a Duolingo-style career exploration platform for Kazakhstani teenagers (ages 13–19). Users explore "zones" of professions, complete levels, earn XP, and unlock premium content.

---

## Stack

- **Backend**: FastAPI (Python 3.11), SQLAlchemy (async), PostgreSQL, Alembic, JWT auth
- **Frontend**: React 18, Vite, Tailwind CSS, Zustand, React Router v6
- **Infrastructure**: Docker Compose

---

## Quick Start (Docker)

### Prerequisites
- Docker Desktop installed and running

### 1. Clone / navigate to the project

```bash
cd careerverse
```

### 2. Start all services

```bash
docker compose up --build
```

This will:
1. Start PostgreSQL on port 5432
2. Run Alembic migrations (`alembic upgrade head`)
3. Seed the database with zones, professions, levels, and tasks
4. Start FastAPI on port 8000
5. Start React dev server on port 5173

### 3. Open the app

- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

---

## Local Development (without Docker)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file and configure
cp .env.example .env
# Edit .env: set DATABASE_URL to your local PostgreSQL

# Run migrations
alembic upgrade head

# Seed data
python seed.py

# Start server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

---

## Test Credentials

After seeding, you can register a new account or use the demo flow:

- Register at: http://localhost:5173/auth
- Suggested test account:
  - **Email**: test@careerverse.kz
  - **Password**: test1234
  - **Age**: 16

> Note: Register this account manually on first run — it is not auto-created by seed.py.

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, get JWT token |
| GET | `/auth/me` | Get current user profile |

### Zones
| Method | Path | Description |
|--------|------|-------------|
| GET | `/zones` | List all career zones |

### Professions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/professions?zone_id=1` | List professions (optionally by zone) |
| GET | `/professions/{id}` | Get profession detail with characters |

### Levels
| Method | Path | Description |
|--------|------|-------------|
| GET | `/levels?profession_id=1` | List levels for a profession |
| GET | `/levels/{id}` | Get level detail with teaching text and task |
| POST | `/levels/{id}/submit` | Submit answer `{ "answer": "..." }` |

### Progress
| Method | Path | Description |
|--------|------|-------------|
| GET | `/progress/me` | Get all progress + total XP |
| GET | `/progress/me/{profession_id}` | Get progress for one profession |

### Subscription
| Method | Path | Description |
|--------|------|-------------|
| GET | `/subscription/status` | Get subscription type and expiry |
| POST | `/subscription/upgrade` | Upgrade to Premium (demo, no payment) |

---

## Freemium / Paywall Logic

| Feature | Free | Premium |
|---------|------|---------|
| IT zone | ✅ | ✅ |
| Medicine zone | ❌ (locked) | ✅ |
| First 2 professions per zone | ✅ | ✅ |
| Professions 3+ per zone | ❌ | ✅ |
| Levels 1–3 | ✅ | ✅ |
| Levels 4+ | ❌ | ✅ |

Upgrading is instant (MVP demo — no real payment gateway). A `POST /subscription/upgrade` call sets the user to Premium for 30 days.

---

## Project Structure

```
careerverse/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, routers
│   │   ├── database.py          # Async SQLAlchemy engine + session
│   │   ├── dependencies.py      # JWT auth dependency
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/             # API route handlers
│   │   └── services/            # Business logic (auth, gameplay)
│   ├── alembic/                 # Database migrations
│   ├── seed.py                  # Seed script for demo data
│   ├── requirements.txt
│   ├── Dockerfile
│   └── alembic.ini
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios API clients
│   │   ├── store/               # Zustand global state
│   │   ├── components/          # Navbar, ProtectedRoute, PaywallModal
│   │   └── pages/               # AuthPage, WorldMapPage, ProfessionListPage,
│   │                            #   ProfessionPage, LevelPage, ProfilePage
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
└── docker-compose.yml
```

---

## Seed Data (what gets created)

**Zones:**
- IT и технологии (free access)
- Медицина (premium only)

**Professions:**
- Frontend-разработчик (IT zone, difficulty 3)
- Врач общей практики (Medicine zone, difficulty 4)

**Levels (Frontend profession — 5 levels):**
1. Знакомство с HTML (quiz)
2. Первый CSS-стиль (choice)
3. Макет на Flexbox (quiz)
4. Дебаггинг ошибки (timed — Premium)
5. Код-ревью от тимлида (choice — Premium)

**XP system:**
- Correct answer: +50 XP
- Wrong answer: +10 XP (encouragement)

---

## Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/careerverse
SECRET_KEY=your-secret-key-here
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:8000
```

---

## License

MIT — build on it, ship it, iterate.
