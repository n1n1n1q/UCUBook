from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from routers import search_bar
import db.db as db

def get_random():
    from random import choice
    return choice(["status confirmed", "status declined"])


database = db.DBOperations()
database.set_up()
app = FastAPI()


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
    return template
    

app.include_router(search_bar.router)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002,reload=True)
