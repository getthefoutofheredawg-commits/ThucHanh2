# Bài tập 2 - ASP.NET Core Web API + EF Core + Migrations + React Axios

## Cấu trúc thư mục
- `backend/`: ASP.NET Core 9 Web API (`RoomsController` với `GET`, `POST`, `PUT`, `DELETE`), Entity Framework Core + SQLite (`AppDbContext`, `appsettings.json`, thư mục `Migrations/`).
- `frontend/`: React (Vite) gọi API qua thư viện **Axios** (`src/api/roomApi.js`).

## Hướng dẫn chạy
### 1. Backend (ASP.NET Core + EF Core)
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
API chạy tại `http://localhost:5000` (Swagger UI tại `http://localhost:5000/swagger`).

### 2. Frontend (React + Axios)
```bash
cd frontend
npm install
npm run dev
```
Truy cập `http://localhost:3000`.
