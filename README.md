# CredAxis
Payment application

## Single Port Run (Recommended)
This runs both UI and API on `http://localhost:8080` using Spring Boot (embedded Tomcat).

1. Build frontend assets:
   `npm install`
   `npm run build`
2. Start backend with your MySQL credentials:
   `mvn -f backend/pom.xml spring-boot:run`
3. Open:
   `http://localhost:8080`

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

## Payment APIs
- Load Money: `POST http://localhost:8080/api/payments/load-money`
  - Request body:
    `{"phoneNumber":"9876543210","name":"Test User","amount":100}`
- Pay Out: `POST http://localhost:8080/api/payments/pay-out`
  - Request body:
    `{"phoneNumber":"9876543210","bankName":"HDFC","ifscCode":"HDFC0001234","beneficiaryName":"Beneficiary Test"}`

## Default seeded login
- userId: `admin`
- password: `admin123`

The backend seeds this default user automatically on startup if it does not exist.
