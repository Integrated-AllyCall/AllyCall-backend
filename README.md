# AllyCall Backend (FastAPI)

This is the backend API for **AllyCall**, a safety-first mobile app that helps individuals commuting alone report incidents, trigger fake calls, and access legal information — supporting gender equality and user empowerment.

---

## Project Details
- **University**: CS@SIT, KMUTT
- **Course**: Integrated Project 2 & Capstone Project
- **Team Members**:
  - Nattawadee Wuttivoradit (66130500842)
  - Chayada Muangboonsri (66130500838)
  - Nannicha Phraemetta (66130500846)

---
## Setup environment
./setup.sh

## Create a .env file
```
DATABASE_URL=postgresql://user:password@localhost:5432/allycall_db
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=allycallminio
MINIO_SECRET_KEY=yourpassword

```

## Run the server
```
./run.sh
```

## Clean python files
```
./clean.sh
```