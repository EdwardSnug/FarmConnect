// import React, { useEffect, useState } from "react";
// import FarmersSearchBar from "../components/farmersSearchBar";
// import ProductForm from "../components/productForm";
// import FarmersCard from "../components/farmersCard";
// import Sidebar from "../components/sidebar";

// function Farmers() {
//   const [products, setProducts] = useState([]);
//   const [editingProduct, setEditingProduct] = useState(null);

//   // Fetch products from backend
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("http://127.0.0.1:5000/api/products");
//         const data = await res.json();
//         setProducts(data);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       }
//     }
//     fetchProducts();
//   }, []);

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
//         method: "DELETE",
//       });
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     }
//   };

//   const handleSubmit = (savedProduct) => {
//     if (editingProduct) {
//       setProducts((prev) =>
//         prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
//       );
//       setEditingProduct(null);
//     } else {
//       setProducts((prev) => [...prev, savedProduct]);
//     }
//   };

//   return (
//     <div className="home-container">
//       <Sidebar />
//       <div className="main-content">
//         <h1> Welcome to the Farmers Hub! </h1>
//         <p> Post your products here and connect with buyers across the country. </p>
//         <p> To join our community of verified and trusted farmers, email us at verifyme@farmershub.com </p>
//          <ProductForm
//           initialData={editingProduct}
//           onSubmit={handleSubmit}
//           onCancel={() => setEditingProduct(null)}
//         />
//         <h1>Your Products</h1>
//         <div className="farmer-product-grid">
//           <div className="product-list">
//           {products.length === 0 ? (
//             <p>No products available.</p>
//           ) : (
//             products.map((product) => (
//               <FarmersCard
//                 key={product.id}
//                 product={product}
//                 onEdit={() => handleEdit(product)}
//                 onDelete={() => handleDelete(product.id)}
//               />
//               )
//             )
//           )}
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// }

// export default Farmers;

import React, { useEffect, useState } from "react";
import { onAuthStateChanged,} from "firebase/auth";
import { auth } from "../api/firebase";
import FarmersSearchBar from "../components/farmersSearchBar";
import ProductForm from "../components/productForm";
import FarmersCard from "../components/farmersCard";
import Sidebar from "../components/sidebar";

function Farmers() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  // Monitor Firebase authentication state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      setEditingProduct(null);
    });

    return unsubscribe;
  }, []);

  // Fetch products when authentication state is resolved.
  useEffect(() => {
    if (authLoading) return;

    async function fetchProducts() {
      setProductsLoading(true);

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch products.");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, [authLoading]);

  // Only display products owned by the signed-in farmer.
  const myProducts = currentUser
    ? products.filter(
        (product) => product.owner_uid === currentUser.uid
      )
    : [];

  const handleEdit = (product) => {
    if (!currentUser || product.owner_uid !== currentUser.uid) {
      alert("You can only edit your own products.");
      return;
    }

    setEditingProduct(product);
  };

  const handleDelete = async (id) => {
    const product = myProducts.find((item) => item.id === id);

    if (!currentUser || !product) {
      alert("You can only delete your own products.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const token = await currentUser.getIdToken();

      const response = await fetch(
        `http://127.0.0.1:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          responseData.error ||
            responseData.message ||
            "Failed to delete product."
        );
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));

      if (editingProduct?.id === id) {
        setEditingProduct(null);
      }

      alert("Product deleted successfully.");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.message || "Unable to delete product.");
    }
  };

  const handleSubmit = (savedProduct) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);

      if (exists) {
        return prev.map((p) =>
          p.id === savedProduct.id ? savedProduct : p
        );
      }

      return [...prev, savedProduct];
    });

    setEditingProduct(null);
  };

  if (authLoading) {
    return <p>Checking your sign-in status...</p>;
  }

  return (
    <div className="home-container">
      <Sidebar />

      <div className="main-content">
        <h1>Welcome to the Farmers Hub!</h1>

        <p>
          Post your products here and connect with buyers across the country.
        </p>

        <p>
          To join our community of verified and trusted farmers, email us at
          verifyme@farmershub.com
        </p>

        {!currentUser ? (
          <p>Please sign in to post and manage your products.</p>
        ) : (
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => setEditingProduct(null)}
          />
        )}

        <h1>Your Products</h1>

        <div className="farmer-product-grid">
          <div className="product-list">
            {productsLoading ? (
              <p>Loading your products...</p>
            ) : !currentUser ? (
              <p>Sign in to view and manage your products.</p>
            ) : myProducts.length === 0 ? (
              <p>
                You haven't posted any products yet. Add your first product
                using the form above.
              </p>
            ) : (
              myProducts.map((product) => (
                <FarmersCard
                  key={product.id}
                  product={product}
                  onEdit={() => handleEdit(product)}
                  onDelete={() => handleDelete(product.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Farmers;