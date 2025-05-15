import React from "react";
import { CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "./Variable";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    navigate("/");
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Order Placed Successfully!
            </h1>
            <p className="mt-2 text-gray-600">
              Thank you for shopping with us! Your order is confirmed.
            </p>
          </div>

          {/* Order Details */}
          <div className="border-t border-b border-gray-200 py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600">Order ID</p>
                <p className="font-medium">#{order.orderId || "123456"}</p>
              </div>
              <div>
                <p className="text-gray-600">Estimated Delivery</p>
                <p className="font-medium">
                  {order.deliveryDate || "Fri, 25th Oct 2024"}
                </p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Ordered Items
              </h3>
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center border rounded-lg p-4"
                >
                  <img
                    src={`${API_URL}/${item.image}`}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <div className="ml-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-gray-600">Size: {item.size}</p>
                    <p className="text-gray-600">Size: {item.color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="py-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <span className="font-medium text-gray-900">Total Paid</span>
              <span className="text-xl font-bold text-green-600">
                ₹{order.total?.toLocaleString("en-IN") || "5,999.00"}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/ProductListing")}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/ProfilePage")}
              className="border-2 border-black px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              View Order Details
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-center text-gray-600">
            <p>Need help? Contact our support team:</p>
            <div className="mt-2 flex justify-center items-center gap-4">
              <a href="tel:+919876543210" className="flex items-center gap-1">
                📞 +91 98765 43210
              </a>
              <a
                href="mailto:support@jnwex.com"
                className="flex items-center gap-1"
              >
                ✉️ support@jnwex.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
