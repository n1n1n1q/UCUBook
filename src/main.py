from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import db.db as db
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
