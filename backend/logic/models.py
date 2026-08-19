from .extensions import db

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(100), nullable=False)
    selected_category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.String(20), default='kg')
    location = db.Column(db.String(100), default='Kenya')
    contact_info = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, default='Contact seller for more information')
    image_url = db.Column(db.String(200))

    def __repr__(self):
        return f"<Product {self.product_name} ({self.selected_category})>"
