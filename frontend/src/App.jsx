// import React from "react";
// import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import Header from "./components/header.jsx";
// import Home from "./pages/home.jsx";
// import MarketPlace from "./pages/buyers.jsx";
// import FarmersHub from "./pages/farmers.jsx";
// import Login from "./pages/login.jsx";
// import Register from "./pages/register.jsx";
// import SeasonalPlanner from './components/seasonalPlanner';
// import "./styles/app.css";
// import ProtectedRoute from "./components/protectedRoute";

// function App() {
//     return (
//         <div className="App-container">
//             <Router>
//                 <Header />
//                 <Routes>
//                     <Route path="/home" element={
//                         <ProtectedRoute>
//                             <Home />
//                         </ProtectedRoute>
//                     } />
//                     <Route path="/marketplace" element={
//                         <ProtectedRoute>
//                             <MarketPlace />
//                         </ProtectedRoute>
//                     } />
//                     <Route path="/farmers-hub" element={
//                         <ProtectedRoute>
//                             <FarmersHub />
//                         </ProtectedRoute>
//                     } />
//                     <Route path="/" element={<Login />} />
//                     <Route path="/register" element={<Register />} />
//                     <Route path="/planner" element={
//                         <ProtectedRoute>
//                             <SeasonalPlanner />
//                         </ProtectedRoute>
//                     } />
//                 </Routes>
//             </Router>
//         </div>
//     )
// }

// export default App;

import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import Header from "./components/header.jsx";
import Home from "./pages/home.jsx";
import MarketPlace from "./pages/buyers.jsx";
import FarmersHub from "./pages/farmers.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import SeasonalPlanner from "./components/seasonalPlanner";
import Checkout from "./pages/checkout.jsx";
import PaymentStatus from "./pages/paymentStatus.jsx";

import ProtectedRoute from "./components/protectedRoute";

import "./styles/app.css";

function App() {

    // Shared shopping cart
    const [cart, setCart] = useState([]);

    // Clear cart after successful payment
    const clearCart = () => {
        setCart([]);
    };

    return (
        <div className="App-container">

            <Router>

                <Header />

                <Routes>

                    {/* Home */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />

                    {/* Marketplace */}
                    <Route
                        path="/marketplace"
                        element={
                            <ProtectedRoute>
                                <MarketPlace
                                    cart={cart}
                                    setCart={setCart}
                                />
                            </ProtectedRoute>
                        }
                    />

                    {/* Checkout */}
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout
                                    cartItems={cart}
                                    onClearCart={clearCart}
                                />
                            </ProtectedRoute>
                        }
                    />

                    {/* Payment Status */}
                    <Route
                        path="/payment-status/:orderId"
                        element={
                            <ProtectedRoute>
                                <PaymentStatus
                                    onClearCart={clearCart}
                                />
                            </ProtectedRoute>
                        }
                    />

                    {/* Farmers Hub */}
                    <Route
                        path="/farmers-hub"
                        element={
                            <ProtectedRoute>
                                <FarmersHub />
                            </ProtectedRoute>
                        }
                    />

                    {/* Login */}
                    <Route
                        path="/"
                        element={<Login />}
                    />

                    {/* Registration */}
                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    {/* Seasonal Planner */}
                    <Route
                        path="/planner"
                        element={
                            <ProtectedRoute>
                                <SeasonalPlanner />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </Router>

        </div>
    );
}

export default App;