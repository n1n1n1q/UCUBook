from fastapi import FastAPI, Request, status, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
import db.db as db
from models import *
database = db.DBOperations()
app = FastAPI()

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
    return templates.TemplateResponse(
        "user_requests.html",
        {"request": request, "id": id}
    )
@app.post("/login")
def add(request: Request, name: str = Form(...), password: str = Form(...)):
    name = name
    password = password
    try:
        user_data = database.get_data('users', name)
        if user_data['password'] == password:
            current_user = user_data
        else:
            current_user = None
    except ValueError:
        current_user = None
    if current_user:
        url = app.url_path_for('read_index')
        return RedirectResponse(url, status_code=status.HTTP_303_SEE_OTHER)
    url = app.url_path_for("read_login")
    return RedirectResponse(url, status_code=status.HTTP_303_SEE_OTHER)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
