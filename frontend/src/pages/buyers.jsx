// import React, { useState, useEffect } from "react";
// import ProductCard from "../components/productCard";
// import ProductSidebar from "../components/productSideBar";
// import '../styles/components.css';

// function Marketplace() {
//     const [products, setProducts] = useState([]);
//     const [filtered, setFiltered] = useState([]);
//     const [searchText, setSearchText] = useState("");
//     const [filters, setFilters] = useState({
//         price: "",
//         location: "",
//         category: ""
//     });
//     const [cart, setCart] = useState([]);   //Cart state

//     // Fetch products from Flask backend
//     useEffect(() => {
//         fetch("http://127.0.0.1:5000/api/products")
//             .then((res) => res.json())
//             .then((data) => {
//                 const normalized = data.map((item) => ({
//                     id: item.id,
//                     name: item.product_name,
//                     category: item.selected_category,
//                     price: item.price,
//                     quantity: item.quantity,
//                     unit: item.unit,
//                     location: item.location,
//                     description: item.description,
//                     image: item.image_url,
//                     contact_info: item.contact_info
//                 }));

//                 setProducts(normalized);
//                 setFiltered(normalized);
//             })
//             .catch((err) => console.error("Error fetching products:", err));
//     }, []);

//     // Filtering logic
//     useEffect(() => {
//         let updated = [...products];

//         if (searchText) {
//             updated = updated.filter(product =>
//                 product.name.toLowerCase().includes(searchText.toLowerCase()) ||
//                 (product.location && product.location.toLowerCase().includes(searchText.toLowerCase()))
//             );
//         }

//         if (filters.price) {
//             updated = updated.filter(product =>
//                 Number(product.price) <= Number(filters.price)
//             );
//         }

//         if (filters.location) {
//             updated = updated.filter(product =>
//                 product.location === filters.location
//             );
//         }

//         if (filters.category) {
//             updated = updated.filter(product =>
//                 product.category === filters.category
//             );
//         }

//         setFiltered(updated);
//     }, [searchText, filters, products]);

//     // Cart logic
//     const addToCart = (product) => {
//         if (!cart.some((item) => item.id === product.id)) {
//             setCart([...cart, product]);
//         }
//     };

//     const removeFromCart = (product) => {
//         setCart(cart.filter((item) => item.id !== product.id));
//     };

//     return (
//         <div className="home-container">
//             <ProductSidebar
//                 products={products}
//                 onSearch={setSearchText}
//                 onFilter={setFilters}
//             />
//             <div className="marketplace-content">
//                 <div className="marketplace-header">
//                     <h2 className="marketplace-heading">Browse Available Produce</h2>

//                     {/* Cart count icon */}
//                     <div className="cart-icon">
//                         🛒 <span className="cart-count">{cart.length}</span>
//                     </div>
//                 </div>

//                 <div className="product-grid">
//                     {filtered.length === 0 ? (
//                         <p>No Produce Found.</p>
//                     ) : (
//                         filtered.map(product => (
//                             <ProductCard
//                                 key={product.id}
//                                 product={product}
//                                 inCart={cart.some((item) => item.id === product.id)}
//                                 onAddToCart={addToCart}
//                                 onRemoveFromCart={removeFromCart}
//                             />
//                         ))
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Marketplace;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/productCard";
import ProductSidebar from "../components/productSideBar";
import "../styles/components.css";

function Marketplace({ cart, setCart }) {

    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [filters, setFilters] = useState({
        price: "",
        location: "",
        category: ""
    });

    const [cartOpen, setCartOpen] = useState(false);

    const navigate = useNavigate();

    // =====================================================
    // FETCH PRODUCTS
    // =====================================================

    useEffect(() => {

        fetch("http://127.0.0.1:5000/api/products")

            .then((res) => res.json())

            .then((data) => {

                const normalized = data.map((item) => ({
                    id: item.id,
                    name: item.product_name,
                    category: item.selected_category,
                    price: item.price,
                    quantity: item.quantity,
                    unit: item.unit,
                    location: item.location,
                    description: item.description,
                    image: item.image_url,
                    contact_info: item.contact_info
                }));

                setProducts(normalized);
                setFiltered(normalized);

            })

            .catch((err) =>
                console.error(
                    "Error fetching products:",
                    err
                )
            );

    }, []);


    // =====================================================
    // FILTER PRODUCTS
    // =====================================================

    useEffect(() => {

        let updated = [...products];

        if (searchText) {

            updated = updated.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(
                            searchText.toLowerCase()
                        ) ||

                    (product.location &&
                        product.location
                            .toLowerCase()
                            .includes(
                                searchText.toLowerCase()
                            ))
            );
        }

        if (filters.price) {

            updated = updated.filter(
                (product) =>
                    Number(product.price) <=
                    Number(filters.price)
            );
        }

        if (filters.location) {

            updated = updated.filter(
                (product) =>
                    product.location ===
                    filters.location
            );
        }

        if (filters.category) {

            updated = updated.filter(
                (product) =>
                    product.category ===
                    filters.category
            );
        }

        setFiltered(updated);

    }, [
        searchText,
        filters,
        products
    ]);


    // =====================================================
    // CART FUNCTIONS
    // =====================================================

    const addToCart = (product) => {

        const existingItem = cart.find(
            (item) =>
                item.id === product.id
        );

        if (existingItem) {

            setCart(
                cart.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity:
                                  Number(
                                      item.quantity
                                  ) + 1
                          }
                        : item
                )
            );

        } else {

            setCart([
                ...cart,
                {
                    ...product,
                    quantity: 1
                }
            ]);
        }

        // Automatically open cart
        setCartOpen(true);
    };


    const removeFromCart = (product) => {

        setCart(
            cart.filter(
                (item) =>
                    item.id !== product.id
            )
        );
    };


    const increaseQuantity = (productId) => {

        setCart(
            cart.map((item) =>
                item.id === productId
                    ? {
                          ...item,
                          quantity:
                              Number(
                                  item.quantity
                              ) + 1
                      }
                    : item
            )
        );
    };


    const decreaseQuantity = (productId) => {

        setCart(

            cart
                .map((item) =>
                    item.id === productId
                        ? {
                              ...item,
                              quantity:
                                  Number(
                                      item.quantity
                                  ) - 1
                          }
                        : item
                )

                .filter(
                    (item) =>
                        item.quantity > 0
                )
        );
    };


    // =====================================================
    // CART CALCULATIONS
    // =====================================================

    const cartItemCount =
        cart.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 0
                ),
            0
        );


    const cartTotal =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                    Number(
                        item.quantity || 0
                    ),
            0
        );


    // =====================================================
    // MARKETPLACE
    // =====================================================

    return (

        <div className="marketplace-page">

            {/* ============================================
                SIDEBAR
            ============================================ */}

            <ProductSidebar
                products={products}
                onSearch={setSearchText}
                onFilter={setFilters}
            />


            {/* ============================================
                MAIN MARKETPLACE
            ============================================ */}

            <main className="marketplace-content">

                {/* HEADER */}

                <div className="marketplace-header">

                    <div>

                        <h2 className="marketplace-heading">
                            Browse Available Produce
                        </h2>

                        <p className="marketplace-subtitle">
                            Find fresh produce from
                            farmers across Kenya.
                        </p>

                    </div>


                    {/* CART BUTTON */}

                    <button
                        className="cart-icon"
                        onClick={() =>
                            setCartOpen(true)
                        }
                        aria-label="Open shopping cart"
                    >

                        <span className="cart-icon-symbol">
                            🛒
                        </span>

                        <span>
                            Cart
                        </span>

                        <span className="cart-count">
                            {cartItemCount}
                        </span>

                    </button>

                </div>


                {/* PRODUCT COUNT */}

                <div className="marketplace-results">

                    <span>
                        {filtered.length}{" "}
                        {filtered.length === 1
                            ? "product"
                            : "products"}{" "}
                        available
                    </span>

                </div>


                {/* PRODUCTS */}

                <div className="product-grid">

                    {filtered.length === 0 ? (

                        <div className="no-products-message">

                            <div className="no-products-icon">
                                🔎
                            </div>

                            <h3>
                                No produce found
                            </h3>

                            <p>
                                Try adjusting your
                                search or filters.
                            </p>

                        </div>

                    ) : (

                        filtered.map(
                            (product) => (

                                <ProductCard
                                    key={product.id}
                                    product={product}

                                    inCart={cart.some(
                                        (item) =>
                                            item.id ===
                                            product.id
                                    )}

                                    onAddToCart={
                                        addToCart
                                    }

                                    onRemoveFromCart={
                                        removeFromCart
                                    }
                                />

                            )
                        )

                    )}

                </div>

            </main>


            {/* ============================================
                CART OVERLAY + DRAWER
            ============================================ */}

            {cartOpen && (

                <>

                    {/* Dark background */}

                    <div
                        className="cart-drawer-overlay"
                        onClick={() =>
                            setCartOpen(false)
                        }
                    />


                    {/* Cart drawer */}

                    <aside className="cart-drawer">

                        {/* CART HEADER */}

                        <div className="cart-drawer-header">

                            <div>

                                <h2>
                                    Your Cart
                                </h2>

                                <span className="cart-header-count">
                                    {cartItemCount}{" "}
                                    {cartItemCount === 1
                                        ? "item"
                                        : "items"}
                                </span>

                            </div>


                            <button
                                className="cart-close-button"
                                onClick={() =>
                                    setCartOpen(false)
                                }
                                aria-label="Close cart"
                            >
                                ×
                            </button>

                        </div>


                        {/* CART CONTENT */}

                        <div className="cart-drawer-body">

                            {cart.length === 0 ? (

                                <div className="cart-empty">

                                    <div className="cart-empty-icon">
                                        🛒
                                    </div>

                                    <h3>
                                        Your cart is empty
                                    </h3>

                                    <p>
                                        Add some fresh
                                        produce to get
                                        started.
                                    </p>

                                    <button
                                        className="continue-shopping-button"
                                        onClick={() =>
                                            setCartOpen(
                                                false
                                            )
                                        }
                                    >
                                        Continue Shopping
                                    </button>

                                </div>

                            ) : (

                                cart.map(
                                    (item) => (

                                        <div
                                            key={item.id}
                                            className="cart-drawer-item"
                                        >

                                            {/* IMAGE */}

                                            {item.image ? (

                                                <img
                                                    src={
                                                        item.image
                                                    }
                                                    alt={
                                                        item.name
                                                    }
                                                    className="cart-item-image"
                                                />

                                            ) : (

                                                <div className="cart-item-image cart-item-placeholder">
                                                    🌱
                                                </div>

                                            )}


                                            {/* INFORMATION */}

                                            <div className="cart-item-info">

                                                <p className="cart-item-name">
                                                    {item.name}
                                                </p>

                                                <p className="cart-item-price">
                                                    KSh{" "}
                                                    {Number(
                                                        item.price
                                                    ).toFixed(
                                                        2
                                                    )}
                                                    {" / "}
                                                    {item.unit}
                                                </p>


                                                {/* QUANTITY */}

                                                <div className="cart-quantity">

                                                    <button
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                        aria-label="Decrease quantity"
                                                    >
                                                        −
                                                    </button>

                                                    <span>
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>

                                                </div>


                                                {/* REMOVE */}

                                                <button
                                                    className="cart-remove-button"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </div>


                                            {/* SUBTOTAL */}

                                            <div className="cart-item-subtotal">

                                                KSh{" "}
                                                {(
                                                    Number(
                                                        item.price
                                                    ) *
                                                    Number(
                                                        item.quantity
                                                    )
                                                ).toFixed(
                                                    2
                                                )}

                                            </div>

                                        </div>

                                    )
                                )

                            )}

                        </div>


                        {/* CART FOOTER */}

                        {cart.length > 0 && (

                            <div className="cart-drawer-footer">

                                <div className="cart-subtotal">

                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        KSh{" "}
                                        {cartTotal.toFixed(
                                            2
                                        )}
                                    </strong>

                                </div>


                                <button
                                    className="checkout-button"
                                    onClick={() => {

                                        setCartOpen(
                                            false
                                        );

                                        navigate(
                                            "/checkout"
                                        );

                                    }}
                                >
                                    Proceed to Checkout
                                </button>


                                <button
                                    className="continue-shopping-button"
                                    onClick={() =>
                                        setCartOpen(
                                            false
                                        )
                                    }
                                >
                                    Continue Shopping
                                </button>

                            </div>

                        )}

                    </aside>

                </>

            )}

        </div>
    );
}

export default Marketplace;