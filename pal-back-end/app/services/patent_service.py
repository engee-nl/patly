from app.core.singleton_data import DataStore
from loguru import logger
from typing import List

def get_patent_by_id_from_mem(patent_id: str) -> dict:
    patents_data = DataStore.patents_data
    try:
        for patent in patents_data:
            if patent["publication_number"] == patent_id:
                return patent
        return None
    except Exception as e:
        logger.warning(f"Patents data not loaded.")

def search_patent_from_mem(patent_id: str) -> List[dict]:
    patents_data = DataStore.patents_data
    patents_list = []
    try:
        for patent in patents_data:
            if (patent_id.lower() in patent["publication_number"].lower()) or (patent_id.lower() in patent["title"].lower()):
                patents_list.append({ "id" : patent["publication_number"], "name": f'{patent["publication_number"]} : {patent["title"]}' })
                
        return patents_list
    except Exception as e:
        logger.warning(f"Company data not loaded.")