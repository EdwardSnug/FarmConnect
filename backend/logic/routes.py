from flask import Blueprint, request, jsonify
from .extensions import db
from .models import Product
from .schemas import product_schema, products_schema

# Blueprint for product routes
products_bp = Blueprint("products", __name__)

# GET all products
@products_bp.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify(products_schema.dump(products)), 200

# POST a new product
@products_bp.route("/products", methods=["POST"])
def add_product():
    data = request.get_json()

    try:
        new_product = Product(
            product_name=data["product_name"],
            selected_category=data["selected_category"],
            price=data["price"],
            quantity=data["quantity"],
            unit=data["unit"],
            location=data["location"],
            description=data.get("description", "Contact seller for more information"),
            image_url=data.get("image_url"),
            contact_info=data["contact_info"],
        )
        db.session.add(new_product)
        db.session.commit()
        return product_schema.jsonify(new_product), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# PUT (update) product
@products_bp.route("/products/<int:id>", methods=["PUT"])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()

    try:
        product.product_name = data.get("product_name", product.product_name)
        product.selected_category = data.get("selected_category", product.selected_category)
        product.price = data.get("price", product.price)
        product.quantity = data.get("quantity", product.quantity)
        product.unit = data.get("unit", product.unit)
        product.location = data.get("location", product.location)
        product.description = data.get("description", product.description)
        product.image_url = data.get("image_url", product.image_url)
        product.contact_info = data.get("contact_info", product.contact_info)

        db.session.commit()
        return product_schema.jsonify(product), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# DELETE product
@products_bp.route("/products/<int:id>", methods=["DELETE"])
def delete_product(id):
    product = Product.query.get_or_404(id)
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
