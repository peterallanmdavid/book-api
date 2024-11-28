# book-api

Installation
From the root directory run the following:

```bash
cd backend && npm run setup && cd ../frontend && npm install
```

Environtment Variables
Make sure to create a `.env` file in the root directory of backend and frontend. A sample .env file is provided in the backend and frontend directories.

Backend:

```
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password
POSTGRES_DB=postgres_db
DATABASE_URL=postgresql://postgres_user:postgres_password@localhost:5432/postgres_db
```

Frontend:

```
REACT_APP_BACKEND_URL=http://localhost:5000

```

Start backend

From the `root` directory run the following:

```bash
cd backend && npm run dev
```

From the `root` run the following:

```bash
cd frontend && npm run start
```
