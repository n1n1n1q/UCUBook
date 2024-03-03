from fastapi import FastAPI, Request, status, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from models import *
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
import db.db as db
database = db.DBOperations()
database.set_up()
app = FastAPI()
from routers import search_bar

def get_random():
    from random import choice
    return choice(["status confirmed", "status declined"])

search_bar.set_db(database)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request, id=None):
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "id": id}
    )

@app.get("/admin", response_class=HTMLResponse)
async def read_admin(request: Request):
    return templates.TemplateResponse(
        "admin_requests.html",
        {"request": request, "id": id}
    )

@app.get("/login", response_class=HTMLResponse)
async def read_login(request: Request):
    return templates.TemplateResponse(
        "login.html",
        {"request": request, "id": id}
    )

@app.get("/requests", response_class=HTMLResponse)
async def read_requests(request: Request):
    template=templates.TemplateResponse(
        "user_requests.html",
        {"request": request, "id": id, "get_random": get_random}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002,reload=True)
