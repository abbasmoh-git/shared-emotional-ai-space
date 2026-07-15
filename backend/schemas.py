from pydantic import BaseModel
from datetime import datetime


class GroupCreate(BaseModel):
    name: str
    code: str


class GroupJoin(BaseModel):
    code: str


class GroupResponse(BaseModel):
    id: int
    name: str
    code: str
    created_at: datetime

    class Config:
        from_attributes = True


class CheckinCreate(BaseModel):
    group_id: int
    mood: str
    feeling_strength: int | None = None  # значение от 1 до 5
    note: str | None = None


class CheckinResponse(BaseModel):
    id: int
    group_id: int
    mood: str
    feeling_strength: int | None = None  # значение от 1 до 5
    note: str | None
    emotion: str | None
    valence: float | None
    intensity: float | None
    created_at: datetime

class Config:
        from_attributes = True


class UserCreate(BaseModel):
            email: str
            password: str

class UserLogin(BaseModel):
            email: str
            password: str

class UserResponse(BaseModel):
            id: int
            email: str
            created_at: datetime

class Config:
                from_attributes = True

class TokenResponse(BaseModel):
            access_token: str
            token_type: str