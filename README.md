# AllyCall Backend

This is the backend API for **AllyCall**, a safety-first mobile app that helps individuals commuting alone report incidents, trigger fake calls, and access legal information — supporting gender equality and user empowerment.

## Project Details 📄
- **University**: CS@SIT, KMUTT
- **Course**: Integrated Project 2 & Capstone Project
- **Team Members**:
  - Nattawadee Wuttivoradit (66130500842)
  - Chayada Muangboonsri (66130500838)
  - Nannicha Phraemetta (66130500846)

---
## Setup environment 🌱
```
npm i
npx prisma generate
```

## Create a .env file 
```
DATABASE_URL='postgresql://user:password@localhost:5432/postgres?schema=allycall'
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=user
MINIO_SECRET_KEY=yourpassword
GOOGLE_MAPS_API_KEY=
```

## Run the server
```
npm run dev
```