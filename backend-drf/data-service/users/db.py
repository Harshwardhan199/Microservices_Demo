from pymongo import MongoClient
from django.conf import settings

# Simple Mongo connection (change URI for your setup)
client = MongoClient("mongodb://localhost:27017/")
db = client["auth_service_db"]   # your DB name
users_collection = db["users"]   # your collection