from fastapi import APIRouter, HTTPException
from app.services.patent_service import get_patent_by_id_from_mem, search_patent_from_mem
from app.services.company_service import get_company_products_from_mem, search_company_from_mem
from app.schemas.patents import InfringementCheckRequest, InfringementCheckResponse, PatentSearchRequest, CompanySearchRequest
from app.utils.llm import analyze_infringement
from app.utils.redis_cache import cache_query
from loguru import logger
from slugify import slugify
from typing import List, Dict
from datetime import datetime

router = APIRouter()

@router.get("/patents/{patent_id}", response_model=dict, summary="Get Patent by ID")
async def get_patent_by_id(patent_id: str):
    """
    Retrieve a specific patent by its ID.

    Args:
        patent_id (str): The ID of the patent to retrieve (publication_number).

    Returns:
        dict: The details of the requested patent.
    """
    patent = get_patent_by_id_from_mem(patent_id)
            
    if not patent:
        raise HTTPException(status_code=404, detail=f"Patent with ID {patent_id} not found.")
    return patent

@router.post("/patents/search", response_model=List[Dict[str, str]], summary="Search Patents")
async def search_patent(request: PatentSearchRequest):
    """
    Retrieve a list of patents.

    Args:
        patent_id (str): The ID of the patent.

    Returns:
        list: list of patents.
    """
    patent = search_patent_from_mem(request.patent_id)
            
    if not patent:
        raise []
    return patent

@router.post("/companies/search", response_model=List[Dict[str, str]], summary="Search Companies")
async def search_company(request: CompanySearchRequest):
    """
    Retrieve a list of companies.

    Args:
        company_name (str): The name of the company.

    Returns:
        list: list of companies.
    """
    patent = search_company_from_mem(request.company_name)
            
    if not patent:
        raise []
    return patent

@router.post("/patents/check-infringement", response_model=InfringementCheckResponse, summary="Check Patent Infringement")
async def check_patent_infringement(request: InfringementCheckRequest):
    """
    Check for potential patent infringement by a company's products.

    Args:
        request (InfringementCheckRequest): Contains the patent ID and company name.

    Returns:
        InfringementCheckResponse: List of top two potentially infringing products with explanations.

    Raises:
        HTTPException: If the patent ID or company name is not found in the dataset.
    """
    patent = get_patent_by_id_from_mem(request.patent_id)
    if not patent:
        raise HTTPException(status_code=404, detail=f"Patent with ID {request.patent_id} not found.")

    company_products = get_company_products_from_mem(request.company_name)
    if not company_products:
        raise HTTPException(status_code=404, detail=f"Company with name {request.company_name} not found.")
    
    # Make a cache key to cache the results to Redis
    cache_key = f"infringement:{request.patent_id}:{slugify(request.company_name)}:{len(company_products)}"

    # Analyze infringement using LLM
    try:
        # Check if this key exist in Redis
        cached_result = cache_query(cache_key)
        if cached_result:
            logger.info("analyze_infringement > results from cache")
            return {"result": cached_result}
        
        res_analyze = analyze_infringement(patent, company_products, cache_key)
        if res_analyze:
            res_analyze["analysis_id"] = cache_key
            res_analyze["patent_id"] = request.patent_id
            res_analyze["company_name"] = request.company_name
            res_analyze["analysis_date"] = datetime.today().strftime('%Y-%m-%d')
                
        if res_analyze:
            cache_query(cache_key, res_analyze)
            
        return {"result": res_analyze}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=f"Error during infringement analysis: {str(e)}")