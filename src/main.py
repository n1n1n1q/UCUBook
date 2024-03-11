from fastapi import FastAPI, Request, Depends, Form, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.exceptions import HTTPException as StarletteHTTPException
import requests

from routers import search_bar, user, admin
from dependencies import auth

import db.db as db


def get_random():
    """
    Placeholder func //DELETE
    """
    from random import choice

    return choice(["status confirmed", "status declined"])


database = db.DBOperations()
database.set_up()
app = FastAPI()

# Setting up dbs
search_bar.set_db(database)
auth.set_db(database)
user.set_db(database)
admin.set_db(database)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# EXCEPTIONS HANDLING


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    404 exception handler
    """
    if exc.status_code == 404:
        return RedirectResponse(url="/not_found")
    if exc.status_code in (307, 401):
        return RedirectResponse(url="/login")
    raise exc


# Rendering HTMLs


@app.get("/", response_class=HTMLResponse)
async def read_index(
    request: Request, id=None, user=Depends(auth.Authentication.get_current_user)
):
    """
    Index.html render
    """
    return templates.TemplateResponse(
        "index.html", {"request": request, "id": id, "user": user}
    )


@app.get("/admin", response_class=HTMLResponse)
async def read_admin(
    request: Request, user=Depends(auth.Authentication.get_current_user)
):
    """
    Admin page render
    """
    user_info = database.get_data("users", user)[0]
    # print(user_info)
    if user_info["group"] <= 3:
        return RedirectResponse(url="/not_found")
    return templates.TemplateResponse(
        "admin_requests.html", {"request": request, "id": id, "user": user}
    )


@app.get("/login", response_class=HTMLResponse)
async def read_login(request: Request):
    """
    Login page render
    """
    return templates.TemplateResponse("login.html", {"request": request, "id": id})


@app.get("/logout")
async def logout(request: Request):
    """
    Logout readress
    """
    response = RedirectResponse("/login")
    response.delete_cookie(key="access_token")
    return response


@app.get("/requests", response_class=HTMLResponse)
async def read_requests(
    request: Request, user=Depends(auth.Authentication.get_current_user)
):
    """
    Requests render
    """
    return templates.TemplateResponse(
        "user_requests.html", {"request": request, "id": id, "get_random": get_random}
    )


@app.get("/not_found", response_class=HTMLResponse)
async def not_found(request: Request):
    """
    Renders the not found page
    """
    template = templates.TemplateResponse(
        "error_page.html", {"request": request, "id": id}
    )
    return template


@app.post("/login")
def add(name: str = Form(...), password: str = Form(...)):
    """
    Login button logic
    """
    data = {"login": name, "password": password}
    current_user = auth.Authentication.authenticate_user(data)

    if current_user:
        url = app.url_path_for("read_index")
        token = auth.Authentication.create_access_token(data={"user": current_user})
        response = RedirectResponse(url, status_code=status.HTTP_303_SEE_OTHER)
        response.set_cookie(key="access_token", value=token, httponly=True)

        return response

    url = app.url_path_for("read_login")
    return RedirectResponse(url, status_code=status.HTTP_303_SEE_OTHER)


@app.get("/login/google")
async def login_google():
    """
    Redirects to google auth
    """
    url = auth.GOOGLE_LOGIN_URI
    return RedirectResponse(url)


@app.get("/auth/google")
async def auth_google(code: str):
    """
    Accepts response from google auth
    """
    token_url = auth.GOOGLE_TOKEN_URI
    data = {
        "code": code,
        "client_id": auth.GOOGLE_CLIENT_ID,
        "client_secret": auth.GOOGLE_CLIENT_SECRET,
        "redirect_uri": auth.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    response = requests.post(token_url, data=data)
    access_token = response.json().get("access_token")
    response_data = requests.get(
        auth.GOOGLE_USER_INFO_URI, headers={"Authorization": f"Bearer {access_token}"}
    )

    raw_data = response_data.json()
    user_data = {"login": raw_data["email"], "password": None, "name": raw_data["name"]}

    current_user = auth.Authentication.authenticate_user(user_data)

    if current_user:
        url = app.url_path_for("read_index")
        token = auth.Authentication.create_access_token(data={"user": current_user})
        response = RedirectResponse(url, status_code=status.HTTP_303_SEE_OTHER)
        response.set_cookie(key="access_token", value=token, httponly=True)

        return response

    url = app.url_path_for("read_login")
    return RedirectResponse(url, status_code=status.HTTP_303_SEE_OTHER)


# Routers

app.include_router(search_bar.search_bar_router)
app.include_router(admin.admin_router)
app.include_router(user.user_router)

print(database.get_data("requests", "admin", "renter"))
# print(user.get_possible_requests("2022-01-01"))
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
    print(database.get_data("requests", "admin", "renter"))
