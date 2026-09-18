from datetime import datetime

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

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.String(128), nullable=True)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), default="PENDING", nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    items = db.relationship(
        "OrderItem",
        backref="order",
        lazy=True,
        cascade="all, delete-orphan"
    )

    payment = db.relationship(
        "Payment",
        backref="order",
        uselist=False,
        cascade="all, delete-orphan"
    )


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id"),
        nullable=False
    )
    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)

    product = db.relationship("Product")


class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id"),
        nullable=False,
        unique=True
    )

    phone_number = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    merchant_request_id = db.Column(db.String(100), nullable=True)
    checkout_request_id = db.Column(db.String(100), nullable=True)

    mpesa_receipt_number = db.Column(
        db.String(100),
        nullable=True
    )

    result_code = db.Column(db.Integer, nullable=True)
    result_description = db.Column(
        db.String(255),
        nullable=True
    )

    status = db.Column(
        db.String(30),
        default="PENDING",
        nullable=False
    )

    transaction_date = db.Column(
        db.String(30),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )