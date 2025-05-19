from fastapi import FastAPI
# from app.routes import report_route
# import uvicorn

app = FastAPI()

@app.get("/")
def hello():
    return {"message": "Hello, AllyCall!"}