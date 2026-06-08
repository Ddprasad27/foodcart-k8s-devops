from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://mongodb-service:27017/")
client = MongoClient(MONGO_URL)
db = client["foodcart"]

@app.route("/api/menu", methods=["GET"])
def get_menu():
    items = [
        {"id": 1, "name": "Burger", "price": 120, "category": "Fast Food", "emoji": "🍔"},
        {"id": 2, "name": "Pizza", "price": 250, "category": "Italian", "emoji": "🍕"},
        {"id": 3, "name": "Biryani", "price": 180, "category": "Indian", "emoji": "🍛"},
        {"id": 4, "name": "Pasta", "price": 160, "category": "Italian", "emoji": "🍝"},
        {"id": 5, "name": "Noodles", "price": 130, "category": "Chinese", "emoji": "🍜"},
        {"id": 6, "name": "Sandwich", "price": 90, "category": "Fast Food", "emoji": "🥪"}
    ]
    return jsonify(items)

@app.route("/api/orders", methods=["POST"])
def place_order():
    order = request.json
    order["status"] = "confirmed"
    result = db.orders.insert_one(order)
    return jsonify({"message": "Order placed!", "orderId": str(result.inserted_id), "status": "confirmed"})

@app.route("/api/orders", methods=["GET"])
def get_orders():
    orders = list(db.orders.find({}, {"_id": 0}))
    return jsonify(orders)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "foodcart-backend"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
