import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, userToken } from "./Variable";
import toast from "react-hot-toast";
import Login from "./Login";
import Signup from "./Signup";

export default function Cart({ toggleCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [showLogin, setShowLogin] = useState(false); // State for login popup
  const [showSignup, setShowSignup] = useState(false); // State for signup popup
  const userData = userToken();
  const token = userData?.token;
  const navigate = useNavigate();

  // Fetch cart data from API
  const fetchCartData = async () => {
    try {
      if (!token) {
        return; // Handled by login check below
      }

      const response = await axios.get(
        `${API_URL}/cart/getcartitems/${userData?.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("API Response:", response.data);
        const formattedItems = response.data.data.items.map((item) => {
          const size = item.frameSize?.size;
          const formattedSize =
            size?.width && size?.height
              ? `${size.height}x${size.width}`
              : "N/A";

          return {
            cartId: item.cartId,
            name: item.frame.name,
            size: formattedSize,
            frameSizeId: item.frameSize.frameSizeId,
            color: item.color,
            price: item.frameSize.offer_price || item.frameSize.price,
            quantity: item.quantity,
            image: item.frame.images[0]?.imageUrl,
          };
        });

        setCartItems(formattedItems);
        console.log("Formatted Cart Items:", formattedItems);
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCartData();
    }
  }, [token]);

  // Update quantity in backend
  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(
        `${API_URL}/cart/updatecart/${cartId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(
        cartItems.map((item) =>
          item.cartId === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    }
  };

  // Remove item from cart
  const removeItem = async (cartId) => {
    try {
      await axios.delete(`${API_URL}/cart/removeitem/${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(cartItems.filter((item) => item.cartId !== cartId));
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
    }
  };

  // Format price
  const formatPrice = (price) => {
    return price.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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

  // Handle checkout
  const handleCheckout = () => {
    if (!token) {
      toast.error("Please log in to proceed to checkout.");
      setShowLogin(true); // Show login popup
      return;
    }
    toggleCart();
    navigate("/CheckoutPage", { state: { cartItems, subtotal } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setShowLogin(false); // Close login popup
    fetchCartData(); // Refresh cart data
  };

  // Check if user is not logged in
  if (!token) {
    return (
      <>
        <div
          className="fixed inset-0 bg-opacity-50 z-40"
          onClick={toggleCart}
        />
        <div
          style={{ fontFamily: "Times New Roman" }}
          className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg flex flex-col h-full z-50"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside cart from closing it
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-lg font-normal tracking-wide">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-4">
                Please login to view your cart.
              </p>
              <button
                onClick={() => setShowLogin(true)} // Show login popup
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Login
              </button>
            </div>
          </div>

          {/* Login Popup */}
          {showLogin && (
            <Login
              onClose={() => setShowLogin(false)}
              toggSigupPopup={toggleSignupPopup}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {/* Signup Popup */}
          {showSignup && (
            <Signup
              onClose={() => setShowSignup(false)}
              toggleLoginPopup={toggleLoginPopup}
            />
          )}
        </div>
      </>
    );
  }

  // Check if cart is empty
  if (cartItems.length === 0) {
    return (
      <>
        <div
          className="fixed inset-0 bg-opacity-50 z-40"
          onClick={toggleCart}
        />
        <div
          style={{ fontFamily: "Times New Roman" }}
          className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg flex flex-col h-full z-50"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside cart from closing it
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-lg font-normal tracking-wide">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-4">Your cart is empty.</p>
              <Link to="/ProductListing">
                <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>

          {/* Login Popup */}
          {showLogin && (
            <Login
              onClose={() => setShowLogin(false)}
              toggSigupPopup={toggleSignupPopup}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {/* Signup Popup */}
          {showSignup && (
            <Signup
              onClose={() => setShowSignup(false)}
              toggleLoginPopup={toggleLoginPopup}
            />
          )}
        </div>
      </>
    );
  }

  // Render cart with items
  return (
    <>
      <div
        className="fixed inset-0  bg-opacity-50 z-40"
        onClick={toggleCart}
      />
      <div
        style={{ fontFamily: "Times New Roman" }}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg flex flex-col h-full z-50"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside cart from closing it
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-normal tracking-wide">
            Your Cart ({cartItems.length})
          </h2>
          <button
            onClick={toggleCart}
            className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          {cartItems.map((item) => (
            <div key={item.cartId} className="flex space-x-6 pb-8 cursor-pointer">
              <div className="h-32 w-32 flex-shrink-0 border border-gray-200 p-1">
                {item.image ? (
                  <img
                    src={`${API_URL}/${item.image}`}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="font-normal text-lg">{item.name}</h3>

                {/* Size and Color Display */}
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Size: {item.size}inches</p>
                  <p>Color: {item.color}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center border border-black">
                    <button
                      onClick={() =>
                        updateQuantity(item.cartId, item.quantity - 1)
                      }
                      className="px-3 py-1 border-r border-black cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.cartId, item.quantity + 1)
                      }
                      className="px-3 py-1 border-l border-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.cartId)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <p className="font-normal mt-2">₹{formatPrice(item.price)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Total Section */}
        <div className="border-t px-6 py-4 space-y-3">
          <div className="flex justify-between py-1">
            <span className="font-normal">Subtotal</span>
            <span className="font-normal">₹{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="font-normal">Shipping</span>
            <span className="text-gray-500 font-normal">
              Calculated at checkout
            </span>
          </div>

          <div className="border-t my-2"></div>

          <div className="flex justify-between py-1 font-normal">
            <span>Total</span>
            <span>₹{formatPrice(subtotal)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-3 font-normal mt-4 hover:bg-gray-800 transition cursor-pointer"
          >
            Check Out
          </button>
        </div>

        {/* Login Popup */}
        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            toggSigupPopup={toggleSignupPopup}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* Signup Popup */}
        {showSignup && (
          <Signup
            onClose={() => setShowSignup(false)}
            toggleLoginPopup={toggleLoginPopup}
          />
        )}
      </div>
    </>
  );
}