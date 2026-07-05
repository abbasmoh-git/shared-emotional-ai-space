from sqlalchemy import Column, Integer, String, Float, TIMESTAMP 
from sqlalchemy.sql import func
from database import Base

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    code = Column(String(20), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())


class Checkin(Base):
    __tablename__ = "checkins"

    id = Column(Integer, primary_key =True, index = True)
    group_id = Column(Integer, nullable = False)
    mood = Column(String(50), nullable = False)
    feeling_strength = Column(Integer, nullable=True)
    note = Column(String(500), nullable = True)
    emotion = Column(String(50), nullable = True)
    valence = Column(Float, nullable = True )    
    intensity = Column(Float, nullable = True)
    created_at = Column(TIMESTAMP, server_default = func.now())