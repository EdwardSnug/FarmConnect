// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import "../styles/components.css";

// function PaymentStatus({ onClearCart }) {
//     const { orderId } = useParams();
//     const location = useLocation();
//     const navigate = useNavigate();

//     const [status, setStatus] = useState("PENDING");
//     const [payment, setPayment] = useState(null);

//     useEffect(() => {
//         let interval;

//         const checkStatus = async () => {
//             try {
//                 const response = await fetch(
//                     `http://127.0.0.1:5000/api/orders/${orderId}`
//                 );

//                 const data = await response.json();

//                 setStatus(data.order_status);
//                 setPayment(data.payment);

//                 if (
//                     data.order_status === "PAID" ||
//                     data.order_status === "PAYMENT_FAILED"
//                 ) {
//                     clearInterval(interval);

//                     if (data.order_status === "PAID") {
//                         onClearCart();
//                     }
//                 }

//             } catch (error) {
//                 console.error(
//                     "Error checking payment status:",
//                     error
//                 );
//             }
//         };

//         checkStatus();

//         interval = setInterval(checkStatus, 3000);

//         return () => clearInterval(interval);
//     }, [orderId, onClearCart]);

//     const goToMarketplace = () => {
//         navigate("/marketplace");
//     };

//     if (status === "PENDING") {
//         return (
//             <div className="payment-status-container">
//                 <div className="payment-status-card">

//                     <div className="payment-icon">
//                         📱
//                     </div>

//                     <h2>Waiting for M-Pesa Payment</h2>

//                     <p>
//                         Check your phone and complete the
//                         M-Pesa payment request.
//                     </p>

//                     <p>
//                         Order #{orderId}
//                     </p>

//                     <strong>
//                         KSh{" "}
//                         {location.state?.amount?.toFixed
//                             ? location.state.amount.toFixed(2)
//                             : location.state?.amount}
//                     </strong>

//                     <div className="loading-spinner">
//                         Checking payment status...
//                     </div>

//                 </div>
//             </div>
//         );
//     }

//     if (status === "PAID") {
//         return (
//             <div className="payment-status-container">
//                 <div className="payment-status-card">

//                     <div className="payment-icon">
//                         ✓
//                     </div>

//                     <h2>Payment Successful</h2>

//                     <p>
//                         Your FarmConnect order has been
//                         successfully paid.
//                     </p>

//                     <p>
//                         Order #{orderId}
//                     </p>

//                     {payment?.receipt_number && (
//                         <p>
//                             M-Pesa Receipt:
//                             <strong>
//                                 {" "}
//                                 {payment.receipt_number}
//                             </strong>
//                         </p>
//                     )}

//                     <button
//                         className="mpesa-button"
//                         onClick={goToMarketplace}
//                     >
//                         Continue Shopping
//                     </button>

//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="payment-status-container">
//             <div className="payment-status-card">

//                 <div className="payment-icon">
//                     !
//                 </div>

//                 <h2>Payment Not Completed</h2>

//                 <p>
//                     Your M-Pesa payment was not completed.
//                 </p>

//                 {payment?.result_description && (
//                     <p>
//                         {payment.result_description}
//                     </p>
//                 )}

//                 <button
//                     className="mpesa-button"
//                     onClick={goToMarketplace}
//                 >
//                     Return to Marketplace
//                 </button>

//             </div>
//         </div>
//     );
// }

// export default PaymentStatus;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/components.css";

function PaymentStatus({ onClearCart }) {

    const { orderId } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] =
        useState("PENDING");

    const [payment, setPayment] =
        useState(null);

    useEffect(() => {

        let interval;

        const checkStatus = async () => {

            try {

                const response =
                    await fetch(
                        `http://127.0.0.1:5000/api/orders/${orderId}`
                    );

                const data =
                    await response.json();

                setStatus(
                    data.order_status
                );

                setPayment(
                    data.payment
                );

                if (
                    data.order_status === "PAID" ||
                    data.order_status ===
                        "PAYMENT_FAILED"
                ) {

                    clearInterval(interval);

                    if (
                        data.order_status ===
                        "PAID"
                    ) {
                        onClearCart();
                    }
                }

            } catch (error) {

                console.error(
                    "Error checking payment status:",
                    error
                );
            }
        };

        // Check immediately
        checkStatus();

        // Then every 3 seconds
        interval = setInterval(
            checkStatus,
            3000
        );

        return () => {
            clearInterval(interval);
        };

    }, [orderId, onClearCart]);

    // -----------------------------
    // PENDING
    // -----------------------------

    if (status === "PENDING") {

        return (
            <div className="payment-status-container">

                <div className="payment-status-card">

                    <div className="payment-icon">
                        📱
                    </div>

                    <h2>
                        Waiting for M-Pesa Payment
                    </h2>

                    <p>
                        Check your phone and
                        complete the M-Pesa
                        payment request.
                    </p>

                    <p>
                        Order #{orderId}
                    </p>

                    <div className="loading-spinner">
                        Checking payment status...
                    </div>

                </div>

            </div>
        );
    }

    // -----------------------------
    // PAID
    // -----------------------------

    if (status === "PAID") {

        return (
            <div className="payment-status-container">

                <div className="payment-status-card">

                    <div className="payment-icon">
                        ✓
                    </div>

                    <h2>
                        Payment Successful
                    </h2>

                    <p>
                        Your FarmConnect order
                        has been successfully paid.
                    </p>

                    <p>
                        Order #{orderId}
                    </p>

                    {payment?.receipt_number && (

                        <p>
                            M-Pesa Receipt:
                            <strong>
                                {" "}
                                {
                                    payment.receipt_number
                                }
                            </strong>
                        </p>

                    )}

                    <button
                        className="mpesa-button"
                        onClick={() =>
                            navigate(
                                "/marketplace"
                            )
                        }
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>
        );
    }

    // -----------------------------
    // FAILED
    // -----------------------------

    return (
        <div className="payment-status-container">

            <div className="payment-status-card">

                <div className="payment-icon">
                    !
                </div>

                <h2>
                    Payment Not Completed
                </h2>

                <p>
                    Your M-Pesa payment was
                    not completed.
                </p>

                {payment?.result_description && (

                    <p>
                        {payment.result_description}
                    </p>

                )}

                <button
                    className="mpesa-button"
                    onClick={() =>
                        navigate(
                            "/marketplace"
                        )
                    }
                >
                    Return to Marketplace
                </button>

            </div>

        </div>
    );
}

export default PaymentStatus;