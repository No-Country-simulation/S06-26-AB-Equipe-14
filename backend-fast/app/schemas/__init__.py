from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date




class FiltrosRequest(BaseModel):
    regiao:    Optional[str] = None
    indicador: Optional[str] = None  


class DadosRequest(BaseModel):
    consulta: str
    filtros:  Optional[FiltrosRequest] = None
    idioma:   Optional[str] = "pt"


class DadoRegiao(BaseModel):
    regiao: str
    valor:  Any
    fonte:  str

    model_config = {"from_attributes": True}


class DadosResponse(BaseModel):
    resposta_ia: str
    dados:       List[DadoRegiao]
    fontes:      List[str]




class RegiaoMapa(BaseModel):
    regiao:        str
    lat:           float
    lng:           float
    concentracao:  Optional[int]  = None
    cobertura_rede: Optional[str] = None
    indicadores:   Optional[dict] = None

    model_config = {"from_attributes": True}


class MapaResponse(BaseModel):
    regioes: List[RegiaoMapa]




class AntenaOut(BaseModel):
    ecgi:       str
    municipio:  Optional[str]   = None
    cluster:    Optional[str]   = None
    lat:        Optional[float] = None
    lon:        Optional[float] = None
    tecnologia: Optional[str]   = None

    model_config = {"from_attributes": True}



class ConcentracaoOut(BaseModel):
    ecgi:       str
    dia:        date
    periodo:    str
    n_usuarios: Optional[int] = None
    n_sessoes:  Optional[int] = None

    model_config = {"from_attributes": True}