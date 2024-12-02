from app.core.singleton_data import DataStore
from loguru import logger
from typing import List

def get_company_products_from_mem(company_name: str) -> List:
    company_data = DataStore.company_products_data
    try:
        for company in company_data["companies"]:
            if company["name"].lower() == company_name.lower():
                return company["products"]
        return None
    except Exception as e:
        logger.warning(f"Company data not loaded.")

def search_company_from_mem(company_name: str) -> List[dict]:
    company_data = DataStore.company_products_data
    company_list = []
    try:
        for company in company_data["companies"]:
            if (company_name.lower() in company["name"].lower()):
                company_list.append({ "id" : company["name"], "name": company["name"] })
                
        return company_list
    except Exception as e:
        logger.warning(f"Company data not loaded.")