import json
import os

def load_patents():
    FILENAME = os.path.join(os.path.dirname(__file__), '../../data_files/patents.json')
    try:
        with open(FILENAME, "r") as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading patents.json: {e}")
        raise

def load_company_prds():
    FILENAME = os.path.join(os.path.dirname(__file__), '../../data_files/company_products.json')
    try:
        with open(FILENAME, "r") as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading company_products.json: {e}")
        raise