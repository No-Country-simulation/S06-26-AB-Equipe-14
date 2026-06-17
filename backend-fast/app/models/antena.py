from sqlalchemy import Column, BigInteger, String, Float

from app.models.base import Base

class Antena(Base):
    __tablename__ = "antenas"

    ecgi = Column(BigInteger, primary_key=True)
    cluster = Column(String(100))
    municipio = Column(String(100))
    lat = Column(Float)
    lon = Column(Float)