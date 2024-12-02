from typing import List
from loguru import logger
from openai import OpenAI
import json
from app.config import settings

def analyze_infringement(patent: dict, company_products: dict, cache_key: str) -> dict:
    """
    Analyze potential infringement using an LLM model.
    
    Args:
        patent (dict): A dictionary containing the patent details, including claims.
        company_products (dict): A dictionary containing the company products.
    
    Returns:
        res_analyze: A dictionary that has a list of the products with explanations of potential infringement.
    """
    products = company_products
    res_analyze = {}
    
    patent_claims = json.loads(patent['claims'])
    
    claim_text = ''
    #for claims in patent_claims:
    for index, claims in enumerate(patent_claims):
        #if index < 5:
        claim_text = claim_text + claims["num"] + " = " + claims["text"] + "\n"

    # Prepare a prompt for the LLM model
    product_text = ''
    for product in products:
        product_text = product_text + product["name"] + " = " + product["description"] + "\n"
        
    prompt = ("""
Use clean data, don't use history chats from before. Below I have products which I want to check if these have patent infringement. The patent claims are listed below. Can you check if each product has patent infringement. Use the product description listed below only. Only use the information I provided. In addition only list top infringing products (high infringement likelihood and maximum 2 products). Return only a JSON format, like example below. Do not put text outside the JSON format, if there is a infringement be sure to have explanation and overall risk assessment filled out. If there is no infringement have an empty top_infringing_products array.

{
"top_infringing_products": [
    {
    "product_name": "Walmart Shopping App",
    "infringement_likelihood": "High",
    "relevant_claims": ["1", "2", "3", "20", "21"],
    "explanation": "The Walmart Shopping App implements several key elements"
    }
],
"overall_risk_assessment": "High risk of infringement due to implementation"
} \n\n"""
        f"Products: \n{product_text}\n"
        f"Patent Title: {patent['title']}\n\n"
        f"Claims: \n{claim_text}"
    )
    
    # Call the LLM API
    try:        
        # Point to the local OpenAI Server (LM Studio)
        client = OpenAI(base_url=f"{settings.OPEN_AI_URL}", api_key="lm-studio")

        completion = client.chat.completions.create(
            model="model-identifier",
            messages=[
                {"role": "user", "content": f"{prompt}"}
            ],
            temperature=0.7,
        )

        response_message = completion.choices[0].message.content
        cleaned_json_string = ''.join(response_message.splitlines()).strip()
        
        # Extract JSON part from the response
        start_index = cleaned_json_string.find("{")
        end_index = cleaned_json_string.rfind("}") + 1
        json_part = cleaned_json_string[start_index:end_index]
        
        print(json_part)
        
        try:
            res_analyze = json.loads(json_part)      
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
            
    except Exception as e:
        logger.error(e)
        explanation = f"Error analyzing product: {e}"

    return res_analyze