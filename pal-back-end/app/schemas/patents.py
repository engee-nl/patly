from pydantic import BaseModel
from typing import List

# Request model for patent infringement check
class InfringementCheckRequest(BaseModel):
    patent_id: str
    company_name: str

# Response model for patent infringement check
class InfringementCheckResponse(BaseModel):
    result: dict
    
class PatentSearchRequest(BaseModel):
    patent_id: str
    
class CompanySearchRequest(BaseModel):
    company_name: str