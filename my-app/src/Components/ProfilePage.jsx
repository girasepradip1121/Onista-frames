import React, { useEffect, useState } from "react";
import Profile from "../image/Profile.svg";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, userToken } from "./Variable";
import axios from "axios";

const ProfilePage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const userdata = userToken();
  const token = userdata?.token;
  const userId = userdata?.userId;

  // Fetch user data and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user details
        const userResponse = await axios.get(
          `${API_URL}/user/getuserbyid/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch orders
        const ordersResponse = await axios.get(
          `${API_URL}/order/getuserorder/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(userResponse.data);
        setOrders(ordersResponse.data);
        console.log("Orders fetched:", ordersResponse.data);
      } catch (error) {
        setErrorMessage("Failed to fetch data. Please try again later.");
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, token, userId]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Tracking steps configuration
  const trackingSteps = [
    { title: "Order Confirmed", desc: "Order has been confirmed" },
    { title: "Processing", desc: "Order is being processed" },
    { title: "Shipped", desc: "Order has been shipped" },
    { title: "Delivered", desc: "Order has been delivered" },
  ];

  // Render order items
  const renderOrderItems = (order) => {
    return order.orderItems?.map((item, index) => {
      if (item.productType === "pre-listed") {
        const frame = item.frameSize?.frame;
        const images = frame?.images || [];

        return (
          <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {images[0] && (
                <img
                  src={`${API_URL}${images[0].imageUrl}`}
                  alt="Frame"
                  className="w-32 h-32 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                    console.error("Pre-listed image load error:", images[0].imageUrl);
                  }}
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{frame?.name || "Unknown Frame"}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Size:</span>{" "}
                    {item.frameSize?.size?.label ||
                      (item.frameSize?.size?.width && item.frameSize?.size?.height
                        ? `${item.frameSize.size.width} x ${item.frameSize.size.height} inch`
                        : "N/A")}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Quantity:</span> {item.quantity || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Color:</span> {item.color || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Price:</span> ₹{(item.price || 0).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Total:</span> ₹{(item.totalAmount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // Custom order rendering
        const dimensions = item.dimensions || {};
        return (
          <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              
              {item.imageUrl ? (
                <img
                  src={`${API_URL}/${item.imageUrl}`
                  }
                  alt="Custom Frame"
                  className="w-32 h-32 object-cover rounded-md"

                />
              ) : (
                <p className="text-gray-600">No image available</p>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Custom Frame</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {item.customSize && (
                    <p className="text-gray-600">
                      <span className="font-medium">Size:</span> {item.customSize}
                    </p>
                  )}
                  {(dimensions.width || dimensions.height) && (
                    <p className="text-gray-600">
                      <span className="font-medium">Dimensions:</span>{" "}
                      {dimensions.width && dimensions.height
                        ? `${dimensions.width} x ${dimensions.height} inch`
                        : "N/A"}
                    </p>
                  )}
                  {item.material && (
                    <p className="text-gray-600">
                      <span className="font-medium">Material:</span> {item.material}
                    </p>
                  )}
                  {item.frameShape && (
                    <p className="text-gray-600">
                      <span className="font-medium">Frame Shape:</span> {item.frameShape}
                    </p>
                  )}
                  {item.frameMaterial && (
                    <p className="text-gray-600">
                      <span className="font-medium">Frame Material:</span> {item.frameMaterial}
                    </p>
                  )}
                  {item.thickness && (
                    <p className="text-gray-600">
                      <span className="font-medium">Thickness:</span> {item.thickness}mm
                    </p>
                  )}
                  {item.glassThickness && (
                    <p className="text-gray-600">
                      <span className="font-medium">Glass Thickness:</span> {item.glassThickness}mm
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">Color:</span> {item.color || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Quantity:</span> {item.quantity || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Price:</span> ₹{(item.price || 0).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Total:</span> ₹{(item.totalAmount || 0).toLocaleString()}
                  </p>
                  {item.instructions && (
                    <p className="text-gray-600 col-span-2">
                      <span className="font-medium">Instructions:</span> {item.instructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
  };

  // Order details view
  if (selectedOrder) {
    const currentStatus = selectedOrder.status || 0;
    const currentStepIndex = Math.min(currentStatus, trackingSteps.length) - 1;

    console.log("Selected Order:", selectedOrder);

    return (
      <div className="max-w-7xl mx-auto px-4 py-10 bg-white">
        <div className="mb-6 text-sm cursor-pointer">
          <Link to="/">
            <span className="text-gray-800 hover:underline">Home</span>
          </Link>
          {" / "}
          <span
            className="text-gray-800 hover:underline"
            onClick={() => setSelectedOrder(null)}
          >
            Orders
          </span>
          {" / Order #"}{selectedOrder.orderId}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Items Section */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            {renderOrderItems(selectedOrder)}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Shipping Details</h3>
              <p className="text-gray-600">
                {selectedOrder.firstName} {selectedOrder.lastName}
              </p>
              <p className="text-gray-600">
                {selectedOrder.address}, {selectedOrder.city}
                <br />
                {selectedOrder.state} - {selectedOrder.postalCode}
              </p>
              <p className="mt-2 text-gray-600">Phone: {selectedOrder.phone}</p>
            </div>
          </div>

          {/* Tracking Section */}
          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Order Tracking</h2>
              {trackingSteps?.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={index} className="flex items-start mb-8">
                    <div className="flex flex-col items-center mr-4">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center 
                        ${isCompleted ? "bg-blue-500" : "bg-gray-200"}`}
                      >
                        {isCompleted && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`w-px h-12 ${isCompleted ? "bg-blue-500" : "bg-gray-200"}`}
                        ></div>
                      )}
                    </div>
                    <div
                      className={`flex-1 pb-6 ${isCurrent ? "text-blue-600" : "text-gray-600"}`}
                    >
                      <h3
                        className={`font-semibold ${isCurrent ? "text-lg" : "text-base"}`}
                      >
                        {step.title}
                        {isCurrent && <span className="ml-2 text-sm">(Current Status)</span>}
                      </h3>
                      <p className="text-sm mt-1">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading and error states
  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (errorMessage) return <div className="text-center py-8 text-red-500">{errorMessage}</div>;

  // Main orders list view
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-16 py-8 bg-white">
      <nav className="mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
          Home / Profile
        </Link>
      </nav>

      {/* User Information */}
      <div className="max-w-7xl mx-auto bg-white px-4 md:px-16 py-8">
        {/* User Info */}
        <div className="bg-gray-100 p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl mb-4 font-[Times New Roman]">
            User Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={userData?.firstName || ""}
              className="border border-gray-300 rounded-md px-4 py-2 outline-none font-[Times New Roman]"
              readOnly
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={userData?.phone || ""}
              className="border border-gray-300 rounded-md px-4 py-2 outline-none font-[Times New Roman]"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={userData?.email || ""}
              className="border border-gray-300 rounded-md px-4 py-2 outline-none font-[Times New Roman]"
              readOnly
            />
            <input
              type="text"
              placeholder="DOB"
              value={userData?.dob || ""}
              className="border border-gray-300 rounded-md px-4 py-2 outline-none font-[Times New Roman]"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-gray-100 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
          {orders.length === 0 ? (
            <p className="text-center py-4">No orders found</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-lg shadow-sm mb-4 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 4
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {trackingSteps[order.status - 1]?.title || "Unknown Status"}
                  </span>
                </div>

                <div className="border-t pt-2">
                  <p className="font-medium">
                    Total: ₹{order.grandTotal?.toLocaleString()}
                  </p>
                  <p className="font-medium">
                    Payment Status: {order.paymentStatus}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
            />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;