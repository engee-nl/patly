# app/main.py
import app.config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from dotenv import load_dotenv
from app.core.data_loader import load_patents, load_company_prds
from app.routers import patent_routes
from app.core.singleton_data import DataStore

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Define the list of allowed origins
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:8100", 
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8100",
    "http://43.201.34.212:8100",
    "http://ec2-43-201-34-212.ap-northeast-2.compute.amazonaws.com:8100",
]

# Add CORSMiddleware to allow the defined origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Allows requests from specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Initialize logging
logger.info("Starting FastAPI application...")

# On startup load the json files into memory
# TODO When data is much larger, it is better to put the data into a database.
#      For this assignment I am putting the JSON file into the memory (3MB is not big)
@app.on_event("startup")
def preload_data():
    DataStore.patents_data = load_patents()
    DataStore.company_products_data = load_company_prds()
    logger.info(f"Loaded {len(DataStore.patents_data)} patents into memory.")
    logger.info(f"Loaded {len(DataStore.company_products_data)} company products into memory.")
def on_startup():
    print("")

app.include_router(patent_routes.router, prefix="/api/v1", tags=["Patents"])

# Root route to check if service is running
@app.get("/")
def read_root():
    return {"message": "Service is running"}