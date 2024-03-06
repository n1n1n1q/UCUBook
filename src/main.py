from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.exceptions import HTTPException as StarletteHTTPException
from routers import search_bar
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

search_bar.set_db(database)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# 404 EXCEPTIONS HANDLING

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        return RedirectResponse(url="/not_found")
    return await request.app.handle_exception(request, exc)

# Rendering HTMLs

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request, id=None):
    """
    Renders index page
    """
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "id": id}
    )

@app.get("/admin", response_class=HTMLResponse)
async def read_admin(request: Request):
    """
    Renders admin page
    """
    return templates.TemplateResponse(
        "admin_requests.html",
        {"request": request, "id": id}
    )

@app.get("/login", response_class=HTMLResponse)
async def read_login(request: Request):
    """
    Renders login page
    """
    return templates.TemplateResponse(
        "login.html",
        {"request": request, "id": id}
    )

@app.get("/requests", response_class=HTMLResponse)
async def read_requests(request: Request):
    """
    Renders requests page
    """
    template=templates.TemplateResponse(
        "user_requests.html",
        {"request": request, "id": id, "get_random": get_random}
    )
    return template

@app.get("/not_found", response_class=HTMLResponse)
async def not_found(request: Request):
    """
    Renders the not found page
    """
    template = templates.TemplateResponse(
        "error_page.html",
        {"request": request, "id": id}
    )
    return template

# Routers

app.include_router(search_bar.search_bar_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8004)
