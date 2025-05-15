import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { API_URL, userToken } from "./Variable";
import axios from "axios";
import { toast } from "react-hot-toast";
import Login from "./Login";
import Signup from "./Signup";

const Items = () => {
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // State for login popup
  const [showSignup, setShowSignup] = useState(false); // State for signup popup
  const [pendingCartItem, setPendingCartItem] = useState(null); // Store item to add after login

  const navigate = useNavigate();
  const userData = userToken();
  const userId = userData?.userId;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/frame/newarrival`);
        console.log("response", response.data);
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        toast.error("Failed to load new arrivals");
      }
    };
    fetchProducts();
  }, []);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Toggle signup popup and close login popup
  const toggleSignupPopup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  // Toggle login popup and close signup popup
  const toggleLoginPopup = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleAddToCart = async (frame, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error("Please log in to add items to cart");
      setShowLogin(true); // Show login popup
      setPendingCartItem(frame); // Store the item to add after login
      return;
    }

    try {
      const frameSizeId = frame.frameSizes[0]?.frameSizeId;
      const color = frame.colors[0] || "Black";

      if (!frameSizeId) {
        toast.error("Product size not available");
        return;
      }

      const response = await axios.post(
        `${API_URL}/cart/addtocart`,
        {
          userId,
          frameSizeId,
          quantity: 1,
          color,
        },
        {
          headers: { Authorization: `Bearer ${userData?.token}` },
        }
      );

      if (response.data.success) {
        toggleCart();
        toast.success("Item added to cart!");
      } else {
        toast.error(response.data.error || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add item to cart");
    }
  };

  // Handle successful login
  const handleLoginSuccess = async () => {
    setShowLogin(false); // Close login popup
    if (pendingCartItem) {
      // Add the pending item to cart after login
      try {
        const frameSizeId = pendingCartItem.frameSizes[0]?.frameSizeId;
        const color = pendingCartItem.colors[0] || "Black";

        if (!frameSizeId) {
          toast.error("Product size not available");
          setPendingCartItem(null);
          return;
        }

        const response = await axios.post(
          `${API_URL}/cart/addtocart`,
          {
            userId: userData?.userId,
            frameSizeId,
            quantity: 1,
            color,
          },
          {
            headers: { Authorization: `Bearer ${userData?.token}` },
          }
        );

        if (response.data.success) {
          toggleCart();
          toast.success("Item added to cart!");
        } else {
          toast.error(response.data.error || "Failed to add item to cart");
        }
      } catch (error) {
        console.error("Add to cart error:", error);
        toast.error("Failed to add item to cart");
      }
      setPendingCartItem(null); // Clear pending item
    }
  };

  return (
    <>
      <div
        style={{ fontFamily: "Times New Roman" }}
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl">
            FEATURED COLLECTION
          </h2>
          <p className="text-xs sm:text-sm mt-2">
            Discover our featured art collection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products?.length > 0 ? (
            products.map((frame) => (
              <div
                key={frame.frameId}
                className="relative rounded-lg overflow-hidden group"
              >
                <div className="aspect-square relative">
                  <img
                    src={`${API_URL}/${frame.images[0]?.imageUrl}`}
                    alt={frame.name || "Artwork"}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => navigate(`/Singleproduct/${frame.frameId}`)}
                  />

                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="bg-black text-white p-2 rounded-full hover:bg-gray-800 cursor-pointer"
                      onClick={(e) => handleAddToCart(frame, e)}
                      title="Add to Cart"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    <h3 className="font-medium text-lg">{frame.name}</h3>
                    <p className="text-xs">
                      {frame.description?.length > 100
                        ? `${frame.description.slice(0, 20)}...`
                        : frame.description || "No description"}
                    </p>
                    <p className="mt-2 font-semibold">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 2,
                      }).format(frame.basePrice)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">No New Arrivals Found</p>
          )}
        </div>

        <div className="flex justify-center items-center mt-10">
          <Link to="/ProductListing">
            <button
              style={{ fontFamily: "Times New Roman" }}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition cursor-pointer"
            >
              Explore New Arrivals
            </button>
          </Link>
        </div>
      </div>

      {isCartOpen && <Cart toggleCart={toggleCart} />}

      {/* Login Popup */}
      {showLogin && (
        <Login
          onClose={() => {
            setShowLogin(false);
            setPendingCartItem(null); // Clear pending item if popup is closed
          }}
          toggSigupPopup={toggleSignupPopup}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Signup Popup */}
      {showSignup && (
        <Signup
          onClose={() => {
            setShowSignup(false);
            setPendingCartItem(null); // Clear pending item if popup is closed
          }}
          toggleLoginPopup={toggleLoginPopup}
        />
      )}
    </>
  );
};

export default Items;