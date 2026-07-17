from auth import hash_password, verify_password, create_access_token, decode_token
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from ai import analyze_checkin
from ai import generate_group_insights
from database import get_db, engine
import models, schemas
from dotenv import load_dotenv
load_dotenv()

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
def get_checkins(group_id: int, db: Session = Depends(get_db)):
    return db.query(models.Checkin).filter(models.Checkin.group_id == group_id).order_by(models.Checkin.created_at.desc()).all()


@app.post("/api/checkins", response_model=schemas.CheckinResponse)
def create_checkin(checkin: schemas.CheckinCreate, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.id == checkin.group_id).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Call OpenAI to analyze mood + note
    ai_result = analyze_checkin(
        mood=checkin.mood,
        note=checkin.note or "",
        feeling_strength=checkin.feeling_strength or 3
    )

    # Save everything including AI results
    new_checkin = models.Checkin(
        group_id=checkin.group_id,
        mood=checkin.mood,
        feeling_strength=checkin.feeling_strength,
        note=checkin.note,
        emotion=ai_result["emotion"],
        valence=ai_result["valence"],
        intensity=ai_result["intensity"]
    )

    db.add(new_checkin)
    db.commit()
    db.refresh(new_checkin)

    return new_checkin



@app.get("/api/dashboard/{group_id}")
def get_dashboard(group_id: int, db: Session = Depends(get_db)):
    checkins = db.query(models.Checkin).filter(models.Checkin.group_id == group_id).all()

    if not checkins:
        return {"group_id": group_id, "total": 0, "data": []}

    total = len(checkins)

    mood_counts = {}
    for c in checkins:
        mood_counts[c.mood] = mood_counts.get(c.mood, 0) + 1

    emotion_counts = {}
    for c in checkins:
        if c.emotion:
            emotion_counts[c.emotion] = emotion_counts.get(c.emotion, 0) + 1

    checkins_with_strength = [c for c in checkins if c.feeling_strength]
    avg_feeling = sum(c.feeling_strength for c in checkins_with_strength) / len(checkins_with_strength) if checkins_with_strength else None

    checkins_with_valence = [c for c in checkins if c.valence]
    avg_valence = sum(c.valence for c in checkins_with_valence) / len(checkins_with_valence) if checkins_with_valence else None

    checkins_with_intensity = [c for c in checkins if c.intensity]
    avg_intensity = sum(c.intensity for c in checkins_with_intensity) / len(checkins_with_intensity) if checkins_with_intensity else None

    insights = None
    if emotion_counts and avg_valence is not None and avg_intensity is not None:
        insights = generate_group_insights(
            count=total,
            emotions=emotion_counts,
            avg_valence=avg_valence,
            avg_intensity=avg_intensity
        )

    return {
        "group_id": group_id,
        "total": total,
        "mood_distribution": mood_counts,
        "avg_feeling_strength": round(avg_feeling, 2) if avg_feeling else None,
        "avg_valence": round(avg_valence, 2) if avg_valence else None,
        "insights": insights
    }

@app.post("/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
        existing = db.query(models.User).filter(models.User.email == user.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        new_user = models.User(
            email=user.email,
            password=hash_password(user.password)
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user


@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if not db_user or not verify_password(user.password, db_user.password):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token({"sub": str(db_user.id)})
        return {"access_token": token, "token_type": "bearer"}


@app.get("/auth/me", response_model=schemas.UserResponse)
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
        payload = decode_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        user = db.query(models.User).filter(models.User.id == int(payload["sub"])).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
