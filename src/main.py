from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

app = FastAPI()

BUILDINGS=["ЦШ","ХС","БФК"]
CURRENT_BUILDING="ЦШ"
CURRENT_FLOOR=1
FLOORS={"ЦШ":5,"БФК":5,"ХС":2}

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request, id=None, buildings=BUILDINGS, floors=FLOORS, building=CURRENT_BUILDING, floor=CURRENT_FLOOR):
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "id": id, "buildings": buildings, \
"floors": floors, "building": building, "floor": floor}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
