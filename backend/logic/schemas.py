from .extensions import ma
from .models import Product

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True  # deserialize to model instances
        include_fk = True  # include foreign keys in the schema

    owner_uid = ma.auto_field(dump_only=True)  # Make owner_uid read-only

# Single product schema
product_schema = ProductSchema()

# Multiple products schema
products_schema = ProductSchema(many=True)