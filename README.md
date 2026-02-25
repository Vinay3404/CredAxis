# CredAxis
Payment application

## Frontend (React)
1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example` (or set `VITE_API_BASE_URL` manually):
   `VITE_API_BASE_URL=http://localhost:8080/api`
3. Run frontend:
   `npm run dev -- --host 127.0.0.1 --port 5174`

## Backend (Spring Boot + MySQL)
1. Ensure MySQL is running.
2. Default DB configuration is in `backend/src/main/resources/application.yml`:
   - DB URL: `jdbc:mysql://localhost:3306/credaxis`
   - username: `root`
   - password: `root`
3. Run backend:
   `mvn -f backend/pom.xml spring-boot:run`

## Login API
- Endpoint: `POST http://localhost:8080/api/auth/login`
- Request body:
  `{"userId":"admin","password":"admin123"}`

## Default seeded login
- userId: `admin`
- password: `admin123`

The backend seeds this default user automatically on startup if it does not exist.
