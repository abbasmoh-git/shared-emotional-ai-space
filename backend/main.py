from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db, engine
import models, schemas


models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/groups/create", response_model=schemas.GroupResponse)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Group).filter(models.Group.code == group.code).first()

    if existing:
        raise HTTPException(status_code=400, detail="Group code already exists")

    new_group = models.Group(name=group.name, code=group.code)

    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    return new_group


@app.post("/api/groups/join")
def join_group(body: schemas.GroupJoin, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.code == body.code).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    return {
        "success": True,
        "group": {
            "id": group.id,
            "name": group.name,
            "code": group.code
        }
    }


@app.get("/api/groups/{code}", response_model=schemas.GroupResponse)
def get_group(code: str, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.code == code).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    return group

@app.get("/api/checkins", response_model=list[schemas.CheckinResponse])
def get_checkins(db: Session = Depends(get_db)):
    return db.query(models.Checkin).order_by(models.Checkin.created_at.desc()).all()


@app.post("/api/checkins", response_model = schemas.CheckinResponse)
def create_checkin(checkin: schemas.CheckinCreate, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.id == checkin.group_id).first()

    if not group:
        raise HTTPException(status_code = 404, detail = "Group not found")
    
    new_checkin = models.Checkin(
        group_id = checkin.group_id,
        mood = checkin.mood,
        note = checkin.note
    )

    db.add(new_checkin)
    db.commit()
    db.refresh(new_checkin)

    return new_checkin