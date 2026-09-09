from fastapi import FastAPI

app = FastAPI(title="Administrador Financiero API")


@app.get("/")
def root():
    return {"status": "ok"}
