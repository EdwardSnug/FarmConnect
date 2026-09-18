// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/components.css";

// function Checkout({ cartItems, onClearCart }) {
//     const navigate = useNavigate();

//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const totalAmount = cartItems.reduce(
//         (total, item) =>
//             total + Number(item.price) * Number(item.quantity || 1),
//         0
//     );

//     const handlePayment = async () => {
//         setError("");

//         if (!phoneNumber) {
//             setError("Please enter your M-Pesa phone number.");
//             return;
//         }

//         let formattedPhone = phoneNumber.trim();

//         // Convert 07XXXXXXXX to 2547XXXXXXXX
//         if (formattedPhone.startsWith("07")) {
//             formattedPhone = "254" + formattedPhone.substring(1);
//         }

//         // Convert +2547XXXXXXXX to 2547XXXXXXXX
//         if (formattedPhone.startsWith("+254")) {
//             formattedPhone = formattedPhone.substring(1);
//         }

//         if (!/^2547\d{8}$/.test(formattedPhone)) {
//             setError(
//                 "Enter a valid Kenyan M-Pesa number, e.g. 0712345678."
//             );
//             return;
//         }

//         setLoading(true);

//         try {
//             // Step 1: Create the order
//             const orderResponse = await fetch(
//                 "http://127.0.0.1:5000/api/orders",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         customer_id: "test-customer",
//                         phone_number: formattedPhone,
//                         items: cartItems.map((item) => ({
//                             product_id: item.id,
//                             quantity: Number(item.quantity || 1)
//                         }))
//                     })
//                 }
//             );

//             const orderData = await orderResponse.json();

//             if (!orderResponse.ok) {
//                 throw new Error(
//                     orderData.error || "Unable to create order."
//                 );
//             }

//             // Step 2: Request M-Pesa STK Push
//             const paymentResponse = await fetch(
//                 "http://127.0.0.1:5000/api/mpesa/stkpush",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         order_id: orderData.order_id,
//                         phone_number: formattedPhone
//                     })
//                 }
//             );

//             const paymentData = await paymentResponse.json();

//             if (!paymentResponse.ok) {
//                 throw new Error(
//                     paymentData.error || "Unable to initiate M-Pesa payment."
//                 );
//             }

//             // Save order ID so the payment status page can check it
//             navigate(`/payment-status/${orderData.order_id}`, {
//                 state: {
//                     amount: orderData.total_amount,
//                     phoneNumber: formattedPhone,
//                     checkoutRequestId: paymentData.checkout_request_id
//                 }
//             });

//         } catch (err) {
//             console.error("Payment error:", err);
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="checkout-container">
//             <div className="checkout-card">

//                 <h2>FarmConnect Checkout</h2>

//                 <p className="checkout-subtitle">
//                     Review your order before making payment.
//                 </p>

//                 <div className="checkout-items">
//                     {cartItems.map((item) => (
//                         <div
//                             key={item.id}
//                             className="checkout-item"
//                         >
//                             <span>
//                                 {item.name} × {item.quantity || 1}
//                             </span>

//                             <span>
//                                 KSh{" "}
//                                 {(
//                                     Number(item.price) *
//                                     Number(item.quantity || 1)
//                                 ).toFixed(2)}
//                             </span>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="checkout-total">
//                     <strong>Total Amount</strong>
//                     <strong>
//                         KSh {totalAmount.toFixed(2)}
//                     </strong>
//                 </div>

//                 <div className="payment-section">

//                     <label htmlFor="phone">
//                         M-Pesa Phone Number
//                     </label>

//                     <input
//                         id="phone"
//                         type="tel"
//                         placeholder="0712345678"
//                         value={phoneNumber}
//                         onChange={(e) =>
//                             setPhoneNumber(e.target.value)
//                         }
//                     />

//                     <small>
//                         You will receive an M-Pesa payment prompt
//                         on this phone.
//                     </small>

//                     {error && (
//                         <p className="payment-error">
//                             {error}
//                         </p>
//                     )}

//                     <button
//                         className="mpesa-button"
//                         onClick={handlePayment}
//                         disabled={loading || cartItems.length === 0}
//                     >
//                         {loading
//                             ? "Processing..."
//                             : `Pay KSh ${totalAmount.toFixed(2)} with M-Pesa`}
//                     </button>

//                     <button
//                         className="back-button"
//                         onClick={() => navigate("/marketplace")}
//                         disabled={loading}
//                     >
//                         Back to Marketplace
//                     </button>

//                 </div>

//             </div>
//         </div>
//     );
// }

// export default Checkout;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components.css";

function Checkout({ cartItems }) {

    const navigate = useNavigate();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalAmount = cartItems.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity || 1),
        0
    );

    const handlePayment = async () => {

        setError("");

        if (!phoneNumber.trim()) {
            setError(
                "Please enter your M-Pesa phone number."
            );
            return;
        }

        let formattedPhone =
            phoneNumber.trim();

        // 07XXXXXXXX → 2547XXXXXXXX
        if (formattedPhone.startsWith("07")) {
            formattedPhone =
                "254" +
                formattedPhone.substring(1);
        }

        // +2547XXXXXXXX → 2547XXXXXXXX
        if (formattedPhone.startsWith("+254")) {
            formattedPhone =
                formattedPhone.substring(1);
        }

        if (!/^2547\d{8}$/.test(formattedPhone)) {
            setError(
                "Enter a valid Kenyan M-Pesa number, e.g. 0712345678."
            );
            return;
        }

        if (cartItems.length === 0) {
            setError(
                "Your cart is empty."
            );
            return;
        }

        setLoading(true);

        try {

            // --------------------------------
            // 1. CREATE ORDER
            // --------------------------------

            const orderResponse =
                await fetch(
                    "http://127.0.0.1:5000/api/orders",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            customer_id:
                                "test-customer",

                            phone_number:
                                formattedPhone,

                            items:
                                cartItems.map(
                                    (item) => ({
                                        product_id:
                                            item.id,

                                        quantity:
                                            Number(
                                                item.quantity ||
                                                1
                                            )
                                    })
                                )
                        })
                    }
                );

            const orderData =
                await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(
                    orderData.error ||
                    "Unable to create order."
                );
            }

            // --------------------------------
            // 2. INITIATE STK PUSH
            // --------------------------------

            const paymentResponse =
                await fetch(
                    "http://127.0.0.1:5000/api/mpesa/stkpush",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            order_id:
                                orderData.order_id,

                            phone_number:
                                formattedPhone
                        })
                    }
                );

            const paymentData =
                await paymentResponse.json();

            if (!paymentResponse.ok) {
                throw new Error(
                    paymentData.error ||
                    "Unable to initiate M-Pesa payment."
                );
            }

            // --------------------------------
            // 3. MOVE TO PAYMENT STATUS
            // --------------------------------

            navigate(
                `/payment-status/${orderData.order_id}`,
                {
                    state: {
                        amount:
                            orderData.total_amount,

                        phoneNumber:
                            formattedPhone,

                        checkoutRequestId:
                            paymentData.checkout_request_id
                    }
                }
            );

        } catch (err) {

            console.error(
                "Payment error:",
                err
            );

            setError(err.message);

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">

            <div className="checkout-card">

                <h2>
                    FarmConnect Checkout
                </h2>

                <p className="checkout-subtitle">
                    Review your order before making payment.
                </p>

                {/* ORDER ITEMS */}

                <div className="checkout-items">

                    {cartItems.map((item) => (

                        <div
                            key={item.id}
                            className="checkout-item"
                        >

                            <span>
                                {item.name} ×{" "}
                                {item.quantity || 1}
                            </span>

                            <span>
                                KSh{" "}
                                {(
                                    Number(item.price) *
                                    Number(
                                        item.quantity || 1
                                    )
                                ).toFixed(2)}
                            </span>

                        </div>

                    ))}

                </div>

                {/* TOTAL */}

                <div className="checkout-total">

                    <strong>
                        Total Amount
                    </strong>

                    <strong>
                        KSh{" "}
                        {totalAmount.toFixed(2)}
                    </strong>

                </div>

                {/* PAYMENT */}

                <div className="payment-section">

                    <label htmlFor="phone">

                        M-Pesa Phone Number

                    </label>

                    <input
                        id="phone"
                        type="tel"
                        placeholder="0712345678"
                        value={phoneNumber}
                        onChange={(e) =>
                            setPhoneNumber(
                                e.target.value
                            )
                        }
                    />

                    <small>

                        You will receive an
                        M-Pesa payment prompt
                        on this phone.

                    </small>

                    {error && (

                        <p className="payment-error">
                            {error}
                        </p>

                    )}

                    <button
                        className="mpesa-button"
                        onClick={handlePayment}
                        disabled={
                            loading ||
                            cartItems.length === 0
                        }
                    >

                        {loading
                            ? "Processing..."
                            : `Pay KSh ${totalAmount.toFixed(
                                  2
                              )} with M-Pesa`}

                    </button>

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate(
                                "/marketplace"
                            )
                        }
                        disabled={loading}
                    >

                        Back to Marketplace

                    </button>

                </div>

            </div>

        </div>
    );
}

export default Checkout;