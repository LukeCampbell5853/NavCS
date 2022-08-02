from fastapi import FastAPI
import uvicorn

app = FastAPI()
@app.get("/NavCS-API-test")
def hello(user,key):
  if key == "password_test_123":
    return {f"hello {user} welcome to the api."}
  else:
    return {"invalid key."}
