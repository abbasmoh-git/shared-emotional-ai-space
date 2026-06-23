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
    note: str | None = None


class CheckinResponse(BaseModel):
    id: int
    group_id: int
    mood: str
    note: str | None
    created_at: datetime

    class Config:
        from_attributes = True