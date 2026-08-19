from .extensions import ma
from .models import Product

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True  # deserialize to model instances

# Single product schema
product_schema = ProductSchema()

# Multiple products schema
products_schema = ProductSchema(many=True)