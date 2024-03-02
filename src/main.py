from fastapi import FastAPI, Depends, Response, Request, status, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import jwt
import db.db as db

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

database = db.DBOperations()
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if token:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("user")
        token_expires = payload.get("exp")

        if username is None or token_expires is None or datetime.utcnow() > datetime.fromtimestamp(token_expires):
            raise HTTPException(status_code=status.HTTP_307_TEMPORARY_REDIRECT, detail="Please log in", headers={"Location": "/login"})
        else:
            return username
    else:
        raise HTTPException(status_code=status.HTTP_307_TEMPORARY_REDIRECT, detail="Please log in", headers={"Location": "/login"})

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request, id=None, user = Depends(get_current_user)):
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "id": id, "user": user}
    )

@app.get("/admin", response_class=HTMLResponse)
async def read_admin(request: Request, user = Depends(get_current_user)):
    return templates.TemplateResponse(
        "admin_requests.html",
        {"request": request, "id": id, "user": user}
    )

@app.get("/login", response_class=HTMLResponse)
async def read_login(request: Request):
    return templates.TemplateResponse(
        "login.html",
        {"request": request, "id": id}
    )

@app.get("/logout")
async def logout(request: Request):
    response = templates.TemplateResponse(
        "login.html",
        {"request": request, "id": id}
    )
    response.delete_cookie(key="access_token")
    return response

@app.get("/requests", response_class=HTMLResponse)
async def read_requests(request: Request, user = Depends(get_current_user)):
    return templates.TemplateResponse(
        "user_requests.html",
        {"request": request, "id": id}
    )

def create_access_token(data: dict):
    to_encode = data.copy()
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(name, password):
    try:
        user_data = database.get_data('users', name)
        if user_data['password'] == password:
            return user_data['login']
        else:
            return None
    except ValueError:
        return None

@app.post("/login")
def add(name: str = Form(...), password: str = Form(...)):
    
    current_user = authenticate_user(name, password)
    
    if current_user:
        url = app.url_path_for('read_index')
        token = create_access_token(data={"user": current_user})
        response = RedirectResponse(url, status_code=status.HTTP_303_SEE_OTHER)
        response.set_cookie(key="access_token", value=token, httponly=True)
        
        return response
    
    url = app.url_path_for("read_login")
    return RedirectResponse(url, status_code=status.HTTP_303_SEE_OTHER)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
