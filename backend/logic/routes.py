from flask import Blueprint, request, jsonify
from .extensions import db
from .models import Product, Order, OrderItem, Payment
from .schemas import product_schema, products_schema
from .mpesa import initiate_stk_push

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

# Initiate M-Pesa STK Push
# Create a new order
@products_bp.route("/orders", methods=["POST"])
def create_order():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required."
        }), 400

    items = data.get("items")
    customer_id = data.get("customer_id")
    phone_number = data.get("phone_number")

    if not items or not isinstance(items, list):
        return jsonify({
            "error": "Order must contain at least one item."
        }), 400

    if not phone_number:
        return jsonify({
            "error": "Phone number is required."
        }), 400

    try:
        total_amount = 0
        order_items = []

        for item in items:
            product_id = item.get("product_id")
            quantity = item.get("quantity")

            if not product_id or not quantity:
                return jsonify({
                    "error": "Each item must contain product_id and quantity."
                }), 400

            quantity = int(quantity)

            if quantity <= 0:
                return jsonify({
                    "error": "Quantity must be greater than zero."
                }), 400

            product = Product.query.get(product_id)

            if not product:
                return jsonify({
                    "error": f"Product {product_id} not found."
                }), 404

            if quantity > product.quantity:
                return jsonify({
                    "error": (
                        f"Insufficient stock for {product.product_name}. "
                        f"Available quantity: {product.quantity}"
                    )
                }), 400

            item_total = product.price * quantity
            total_amount += item_total

            order_items.append(
                OrderItem(
                    product_id=product.id,
                    quantity=quantity,
                    unit_price=product.price
                )
            )

        # Create the order
        order = Order(
            customer_id=customer_id,
            total_amount=total_amount,
            status="PENDING"
        )

        db.session.add(order)
        db.session.flush()

        # Attach items to the order
        for order_item in order_items:
            order_item.order_id = order.id
            db.session.add(order_item)

        # Create payment record
        payment = Payment(
            order_id=order.id,
            phone_number=phone_number,
            amount=total_amount,
            status="PENDING"
        )

        db.session.add(payment)
        db.session.commit()

        return jsonify({
            "message": "Order created successfully.",
            "order_id": order.id,
            "total_amount": total_amount,
            "status": order.status
        }), 201

    except (ValueError, TypeError) as e:
        db.session.rollback()

        return jsonify({
            "error": f"Invalid order data: {str(e)}"
        }), 400

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500

# Initiate M-Pesa STK Push for an existing order
@products_bp.route("/mpesa/stkpush", methods=["POST"])
def mpesa_stk_push():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required."
        }), 400

    order_id = data.get("order_id")
    phone_number = data.get("phone_number")

    if not order_id:
        return jsonify({
            "error": "Order ID is required."
        }), 400

    if not phone_number:
        return jsonify({
            "error": "Phone number is required."
        }), 400

    try:
        order = Order.query.get(order_id)

        if not order:
            return jsonify({
                "error": "Order not found."
            }), 404

        if order.status == "PAID":
            return jsonify({
                "error": "This order has already been paid."
            }), 400

        payment = Payment.query.filter_by(
            order_id=order.id
        ).first()

        if not payment:
            return jsonify({
                "error": "Payment record not found for this order."
            }), 404

        # Store the phone number being used for payment
        payment.phone_number = phone_number
        payment.amount = order.total_amount
        payment.status = "PENDING"

        db.session.commit()

        response = initiate_stk_push(
            phone_number=phone_number,
            amount=order.total_amount,
            account_reference=f"FC{order.id}",
            description="FarmConnect"
        )

        # Save identifiers returned by Safaricom
        payment.merchant_request_id = response.get(
            "MerchantRequestID"
        )

        payment.checkout_request_id = response.get(
            "CheckoutRequestID"
        )

        payment.result_code = (
            int(response["ResponseCode"])
            if response.get("ResponseCode") is not None
            else None
        )

        payment.result_description = response.get(
            "ResponseDescription"
        )

        db.session.commit()

        return jsonify({
            "message": "M-Pesa payment request sent.",
            "order_id": order.id,
            "amount": order.total_amount,
            "status": payment.status,
            "merchant_request_id": payment.merchant_request_id,
            "checkout_request_id": payment.checkout_request_id,
            "customer_message": response.get("CustomerMessage")
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500

# M-Pesa callback
@products_bp.route("/mpesa/callback", methods=["POST"])
def mpesa_callback():
    data = request.get_json()

    print("M-Pesa Callback Received:")
    print(data)

    try:
        stk_callback = data["Body"]["stkCallback"]

        merchant_request_id = stk_callback.get(
            "MerchantRequestID"
        )

        checkout_request_id = stk_callback.get(
            "CheckoutRequestID"
        )

        result_code = stk_callback.get(
            "ResultCode"
        )

        result_description = stk_callback.get(
            "ResultDesc"
        )

        payment = Payment.query.filter_by(
            checkout_request_id=checkout_request_id
        ).first()

        if not payment:
            print(
                f"No payment found for CheckoutRequestID: "
                f"{checkout_request_id}"
            )

            return jsonify({
                "ResultCode": 0,
                "ResultDesc": "Callback received"
            }), 200

        payment.result_code = result_code
        payment.result_description = result_description

        # Successful payment
        if result_code == 0:

            payment.status = "PAID"

            callback_metadata = stk_callback.get(
                "CallbackMetadata",
                {}
            )

            items = callback_metadata.get("Item", [])

            for item in items:
                name = item.get("Name")
                value = item.get("Value")

                if name == "MpesaReceiptNumber":
                    payment.mpesa_receipt_number = value

                elif name == "TransactionDate":
                    payment.transaction_date = str(value)

            payment.order.status = "PAID"

        # Payment failed/cancelled/timeout
        else:

            payment.status = "FAILED"

            payment.order.status = "PAYMENT_FAILED"

        db.session.commit()

        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Callback processed successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        print("Callback processing error:")
        print(str(e))

        # Still acknowledge the callback
        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Callback received"
        }), 200

# Get order and payment status
@products_bp.route("/orders/<int:order_id>", methods=["GET"])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)

    payment = Payment.query.filter_by(
        order_id=order.id
    ).first()

    return jsonify({
        "order_id": order.id,
        "total_amount": order.total_amount,
        "order_status": order.status,
        "payment": {
            "status": payment.status if payment else None,
            "phone_number": payment.phone_number if payment else None,
            "receipt_number": (
                payment.mpesa_receipt_number
                if payment else None
            ),
            "result_description": (
                payment.result_description
                if payment else None
            )
        }
    }), 200