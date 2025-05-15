// import React, { useEffect, useState } from "react";
// import {
//   FaTrash,
//   FaInfoCircle,
//   FaRupeeSign,
//   FaChevronDown,
//   FaChevronUp,
// } from "react-icons/fa";
// import axios from "axios";
// import { API_URL, userToken } from "../../Components/Variable";
// import {toast} from 'react-hot-toast'

// const statusOptions = [
//   { value: 1, label: "Pending", color: "bg-blue-500" },
//   { value: 2, label: "Processing", color: "bg-indigo-500" },
//   { value: 3, label: "Shipped", color: "bg-purple-500" },
//   { value: 4, label: "Delivered", color: "bg-green-500" },
//   { value: 5, label: "Cancelled", color: "bg-red-500" },
// ];

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const userData = userToken();

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await axios.get(`${API_URL}/order/getallorders`, {
//         headers: { Authorization: `Bearer ${userData?.token}` },
//       });
//       console.log("response", data.data);

//       setOrders(data.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       await axios.put(
//         `${API_URL}/order/updatestatus/${orderId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${userData?.token}` } }
//       );
//       fetchOrders();
//       toast.success("Status updated successfully!");
//     } catch (error) {
//       console.error("Status update failed:", error);
//       toast.error("Status update failed!");
//     }
//   };

//   const confirmDelete = (orderId) => {
//     if (window.confirm("Are you sure you want to delete this order?")) {
//       deleteOrder(orderId);
//     }
//   };

//   const deleteOrder = async (orderId) => {
//     try {
//       await axios.delete(`${API_URL}/order/delete/${orderId}`);
//       fetchOrders();
//       toast.success("Order deleted successfully!");
//     } catch (error) {
//       console.error("Delete failed:", error);
//       toast.error("Order deletion failed!");
//     }
//   };

//   const toggleExpand = (orderId) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-pulse text-xl text-gray-600">
//           Loading orders...
//         </div>
//       </div>
//     );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
//         Order Management
//       </h1>

//       <div className="space-y-4">
//         {currentOrders.map((order) => (
//           <div
//             key={order.orderId}
//             className="bg-white rounded-lg shadow-md overflow-hidden"
//           >
//             <div
//               className="p-4 hover:bg-gray-50 cursor-pointer border-b"
//               onClick={() => toggleExpand(order.orderId)}
//             >
//               <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
//                 <div className="space-y-1">
//                   <p className="font-semibold text-gray-700">Order #</p>
//                   <p className="text-sm text-gray-600">{order.orderId}</p>
//                 </div>

//                 <div className="space-y-1">
//                   <p className="font-semibold text-gray-700">Customer</p>
//                   <p className="text-sm text-gray-600">
//                     {order.firstName} {order.lastName}
//                   </p>
//                 </div>

//                 <div className="space-y-1">
//                   <p className="font-semibold text-gray-700">Amount</p>
//                   <p className="text-green-600 font-semibold">
//                     ₹{order.grandTotal}
//                   </p>
//                 </div>

//                 <div className="space-y-1">
//                   <p className="font-semibold text-gray-700">Status</p>
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-sm text-white ${
//                       statusOptions.find((s) => s.value === order.status)?.color
//                     }`}
//                   >
//                     {statusOptions.find((s) => s.value === order.status)?.label}
//                   </span>
//                 </div>

//                 <div className="flex justify-end">
//                   {expandedOrder === order.orderId ? (
//                     <FaChevronUp className="text-gray-500" />
//                   ) : (
//                     <FaChevronDown className="text-gray-500" />
//                   )}
//                 </div>
//               </div>
//             </div>

//             {expandedOrder === order.orderId && (
//               <div className="p-4 bg-gray-50 space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   {/* Shipping Details */}
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <div className="flex items-center mb-4">
//                       <FaInfoCircle className="text-blue-500 mr-2" />
//                       <h3 className="font-semibold text-lg">
//                         Shipping Details
//                       </h3>
//                     </div>
//                     <div className="space-y-2 text-gray-600">
//                       <p>
//                         {order.firstName} {order.lastName}
//                       </p>
//                       <p>
//                         {order.address}, {order.apt}
//                       </p>
//                       <p>
//                         {order.city}, {order.state} - {order.postalCode}
//                       </p>
//                       <p>Phone: {order.phone}</p>
//                     </div>
//                   </div>

//                   {/* Payment Details */}
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <div className="flex items-center mb-4">
//                       <FaRupeeSign className="text-green-500 mr-2" />
//                       <h3 className="font-semibold text-lg">Payment Details</h3>
//                     </div>
//                     <div className="space-y-2 text-gray-600">
//                       <div className="flex justify-between">
//                         <span>Subtotal:</span>
//                         <span>₹{order.totalPrice}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Shipping:</span>
//                         <span>₹{order.shippingCharge}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Tax:</span>
//                         <span>₹{order.tax}</span>
//                       </div>
//                       <div className="flex justify-between font-semibold border-t pt-2">
//                         <span>Grand Total:</span>
//                         <span>₹{order.grandTotal}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Order Items */}
//                 <div className="bg-white p-4 rounded-lg shadow-sm">
//                   <h3 className="font-semibold text-lg mb-4">Order Items</h3>
//                   <div className="space-y-4">
//                     {order?.orderItems?.map((item) => (
//                       <div
//                         key={item.orderItemId}
//                         className="flex items-start border-b pb-4 last:border-0"
//                       >
//                         <img
//                           // src={`${API_URL}${item?.Frame?.images[0]?.imageUrl}`}
//                           src={`${API_URL}${item.frameSize?.frame?.images[0]?.imageUrl}`}

//                           alt={item?.frame?.name}
//                           className="w-16 h-16 object-cover rounded mr-4"
//                         />
//                         <div className="flex-1">
//                           <h4 className="font-medium text-gray-800">
//                             {item?.frame?.name}
//                           </h4>
//                           <p className="text-sm text-gray-600">
//                             {item.quantity} × ₹{item.price} = ₹
//                             {item.totalAmount}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
//                   <select
//                     value={order.status}
//                     onChange={(e) =>
//                       handleStatusChange(order.orderId, e.target.value)
//                     }
//                     className="w-full sm:w-48 px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     {statusOptions?.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>

//                   <button
//                     onClick={() => confirmDelete(order.orderId)}
//                     className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <FaTrash />
//                     Delete Order
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center mt-8 space-x-2">
//         {Array.from(
//           { length: Math.ceil(orders.length / itemsPerPage) },
//           (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-4 py-2 rounded-md ${
//                 currentPage === i + 1
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               {i + 1}
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;

// import React, { useEffect, useState } from "react";
// import {
//   FaTrash,
//   FaInfoCircle,
//   FaRupeeSign,
//   FaChevronDown,
//   FaChevronUp,
// } from "react-icons/fa";
// import axios from "axios";
// import { API_URL, userToken } from "../../Components/Variable";
// import { toast } from "react-hot-toast";

// const statusOptions = [
//   { value: 1, label: "Pending", color: "bg-blue-500" },
//   { value: 2, label: "Processing", color: "bg-indigo-500" },
//   { value: 3, label: "Shipped", color: "bg-purple-500" },
//   { value: 4, label: "Delivered", color: "bg-green-500" },
//   { value: 5, label: "Cancelled", color: "bg-red-500" },
// ];

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const userData = userToken();

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await axios.get(`${API_URL}/order/getallorders`, {
//         headers: { Authorization: `Bearer ${userData?.token}` },
//       });
//       console.log("Orders response:", data.data); // Debug: Log orders data

//       setOrders(data.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       await axios.put(
//         `${API_URL}/order/updatestatus/${orderId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${userData?.token}` } }
//       );
//       fetchOrders();
//       toast.success("Status updated successfully!");
//     } catch (error) {
//       console.error("Status update failed:", error);
//       toast.error("Status update failed!");
//     }
//   };

//   const confirmDelete = (orderId) => {
//     if (window.confirm("Are you sure you want to delete this order?")) {
//       deleteOrder(orderId);
//     }
//   };

//   const deleteOrder = async (orderId) => {
//     try {
//       await axios.delete(`${API_URL}/order/delete/${orderId}`);
//       fetchOrders();
//       toast.success("Order deleted successfully!");
//     } catch (error) {
//       console.error("Delete failed:", error);
//       toast.error("Order deletion failed!");
//     }
//   };

//   const toggleExpand = (orderId) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-pulse text-xl text-gray-600">
//           Loading orders...
//         </div>
//       </div>
//     );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
//         Order Management
//       </h1>

//       <div className="space-y-4">
//         {currentOrders.map((order) => (
//           <div
//             key={order.orderId}
//             className="bg-white rounded-lg shadow-md overflow-hidden"
//           >
//             <div
//               className="p-4 hover:bg-gray-50 cursor-pointer border-b"
//               onClick={() => toggleExpand(order.orderId)}
//             >
//               <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
//                 <div className="space-y-1">
//                   <p className="font-semibold text-gray-700">Order #</p>
//                   <p className="text-sm text-gray-600">{order.orderId}</p>
//                 </div>

//                 <div className="space-y-1">
//                   <p className="font-semibold text-gray-700">Customer</p>
//                   <p className="text-sm text-gray-600">
//                     {order.firstName} {order.lastName}
//                   </p>
//                 </div>

//                 <div className="space-y-1">
//                   <p className="font-semibold text-gray-700">Amount</p>
//                   <p className="text-green-600 font-semibold">
//                     ₹{order.grandTotal}
//                   </p>
//                 </div>

//                 <div className="space-y-1">
//                   <p className="font-semibold text-gray-700">Status</p>
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-sm text-white ${
//                       statusOptions.find((s) => s.value === order.status)?.color
//                     }`}
//                   >
//                     {statusOptions.find((s) => s.value === order.status)?.label}
//                   </span>
//                 </div>

//                 <div className="flex justify-end">
//                   {expandedOrder === order.orderId ? (
//                     <FaChevronUp className="text-gray-500" />
//                   ) : (
//                     <FaChevronDown className="text-gray-500" />
//                   )}
//                 </div>
//               </div>
//             </div>

//             {expandedOrder === order.orderId && (
//               <div className="p-4 bg-gray-50 space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   {/* Shipping Details */}
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <div className="flex items-center mb-4">
//                       <FaInfoCircle className="text-blue-500 mr-2" />
//                       <h3 className="font-semibold text-lg">
//                         Shipping Details
//                       </h3>
//                     </div>
//                     <div className="space-y-2 text-gray-600">
//                       <p>
//                         {order.firstName} {order.lastName}
//                       </p>
//                       <p>
//                         {order.address}, {order.apt}
//                       </p>
//                       <p>
//                         {order.city}, {order.state} - {order.postalCode}
//                       </p>
//                       <p>Phone: {order.phone}</p>
//                     </div>
//                   </div>

//                   {/* Payment Details */}
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <div className="flex items-center mb-4">
//                       <FaRupeeSign className="text-green-500 mr-2" />
//                       <h3 className="font-semibold text-lg">Payment Details</h3>
//                     </div>
//                     <div className="space-y-2 text-gray-600">
//                       <div className="flex justify-between">
//                         <span>Subtotal:</span>
//                         <span>₹{order.totalPrice}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Shipping:</span>
//                         <span>₹{order.shippingCharge}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Tax:</span>
//                         <span>₹{order.tax}</span>
//                       </div>
//                       <div className="flex justify-between font-semibold border-t pt-2">
//                         <span>Grand Total:</span>
//                         <span>₹{order.grandTotal}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Order Items */}
//                 <div className="bg-white p-4 rounded-lg shadow-sm">
//                   <h3 className="font-semibold text-lg mb-4">Order Items</h3>
//                   <div className="space-y-4">
//                     {order?.orderItems?.map((item) => {
//                       console.log("Rendering item:", item); // Debug: Log each item
//                       if (item.productType === "pre-listed") {
//                         const frame = item.frameSize?.frame; // Changed from frameSize.frame to Product (based on getUserOrders)
//                         const images = frame?.images || [];
//                         return (
//                           <div
//                             key={item.orderItemId}
//                             className="flex items-start border-b pb-4 last:border-0"
//                           >
//                             <img
//                              src={`${API_URL}/${images[0].imageUrl}`}

//                               alt={item.frameSize?.Frame?.name || "Item"}
//                               className="w-16 h-16 object-cover rounded mr-4"
//                               onError={(e) => {
//                                 e.target.src = "https://via.placeholder.com/150";
//                                 console.error(
//                                   "Image load error:",
//                                   item.frameSize?.Frame?.Images?.[0]?.imageUrl
//                                 );
//                               }}
//                             />
//                             <div className="flex-1">
//                               <h4 className="font-medium text-gray-800">
//                                 {frame.name || "Unknown Item"}
//                               </h4>
//                               <p className="text-sm text-gray-600">
//                                 Size: {item.frameSize?.size?.label || (item.frameSize?.size?.width && item.frameSize?.size?.height ? `${item.frameSize.size.width} x ${item.frameSize.size.height} inch` : "N/A")}
//                               </p>
//                               <p className="text-sm text-gray-600">
//                                 {item.quantity} × ₹{item.price} = ₹
//                                 {item.totalAmount}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       } else {
//                         return (
//                           <div
//                             key={item.orderItemId}
//                             className="flex items-start border-b pb-4 last:border-0"
//                           >
//                             <img
//                               src={
//                                 item.imageUrl
//                                   ? `${API_URL}/${item.imageUrl}`
//                                   : "https://via.placeholder.com/150"
//                               }
//                               alt="Custom Item"
//                               className="w-16 h-16 object-cover rounded mr-4"
//                               onError={(e) => {
//                                 e.target.src = "https://via.placeholder.com/150";
//                                 console.error(
//                                   "Custom image load error:",
//                                   item.imageUrl
//                                 );
//                               }}
//                             />
//                             <div className="flex-1">
//                               <h4 className="font-medium text-gray-800">
//                                 Custom Frame
//                               </h4>
//                               <p className="text-sm text-gray-600">
//                                 Size:{" "}
//                                 {item.customSize ||
//                                   (item.width && item.height
//                                     ? `${item.width} x ${item.height}`
//                                     : "N/A")}
//                               </p>
//                               {item.material && (
//                                 <p className="text-sm text-gray-600">
//                                   Material: {item.material}
//                                 </p>
//                               )}
//                               {item.frameShape && (
//                                 <p className="text-sm text-gray-600">
//                                   Frame Shape: {item.frameShape}
//                                 </p>
//                               )}
//                               {item.frameMaterial && (
//                                 <p className="text-sm text-gray-600">
//                                   Frame Material: {item.frameMaterial}
//                                 </p>
//                               )}
//                               {item.thickness && (
//                                 <p className="text-sm text-gray-600">
//                                   Thickness: {item.thickness}
//                                 </p>
//                               )}
//                               {item.glassThickness && (
//                                 <p className="text-sm text-gray-600">
//                                   Glass Thickness: {item.glassThickness}
//                                 </p>
//                               )}
//                               {item.instructions && (
//                                 <p className="text-sm text-gray-600">
//                                   Instructions: {item.instructions}
//                                 </p>
//                               )}
//                               <p className="text-sm text-gray-600">
//                                 {item.quantity} × ₹{item.price} = ₹
//                                 {item.totalAmount}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       }
//                     })}
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
//                   <select
//                     value={order.status}
//                     onChange={(e) =>
//                       handleStatusChange(order.orderId, e.target.value)
//                     }
//                     className="w-full sm:w-48 px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     {statusOptions?.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>

//                   <button
//                     onClick={() => confirmDelete(order.orderId)}
//                     className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <FaTrash />
//                     Delete Order
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center mt-8 space-x-2">
//         {Array.from(
//           { length: Math.ceil(orders.length / itemsPerPage) },
//           (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-4 py-2 rounded-md ${
//                 currentPage === i + 1
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               {i + 1}
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;

import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaInfoCircle,
  FaRupeeSign,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import axios from "axios";
import { API_URL, userToken } from "../../Components/Variable";
import { toast } from "react-hot-toast";

const statusOptions = [
  { value: 1, label: "Pending", color: "bg-blue-500" },
  { value: 2, label: "Processing", color: "bg-indigo-500" },
  { value: 3, label: "Shipped", color: "bg-purple-500" },
  { value: 4, label: "Delivered", color: "bg-green-500" },
  { value: 5, label: "Cancelled", color: "bg-red-500" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("regular"); // New state for view mode
  const userData = userToken();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/order/getallorders`, {
        headers: { Authorization: `Bearer ${userData?.token}` },
      });
      console.log("Orders response:", data.data); // Debug: Log orders data

      setOrders(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/order/updatestatus/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${userData?.token}` } }
      );
      fetchOrders();
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Status update failed!");
    }
  };

  const confirmDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder(orderId);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`${API_URL}/order/delete/${orderId}`);
      fetchOrders();
      toast.success("Order deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Order deletion failed!");
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Filter orders based on viewMode
  const filteredOrders = orders.filter((order) => {
    if (viewMode === "regular") {
      return order.orderItems?.some(
        (item) => item.productType === "pre-listed"
      );
    } else {
      return order.orderItems?.some((item) => item.productType === "custom");
    }
  });

  console.log(`Filtered orders (${viewMode}):`, filteredOrders); // Debug: Log filtered orders

  // Pagination logic for filtered orders
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-xl text-gray-600">
          Loading orders...
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Order Management
      </h1>

      {/* Toggle Switch */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-200 rounded-full p-1">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              viewMode === "regular"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => {
              setViewMode("regular");
              setCurrentPage(1); // Reset pagination
            }}
          >
            Regular Orders
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              viewMode === "custom"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => {
              setViewMode("custom");
              setCurrentPage(1); // Reset pagination
            }}
          >
            Custom Orders
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600">
          No {viewMode === "regular" ? "regular" : "custom"} orders found.
        </p>
      ) : (
        <div className="space-y-4">
          {currentOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="p-4 hover:bg-gray-50 cursor-pointer border-b"
                onClick={() => toggleExpand(order.orderId)}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-700">Order #</p>
                    <p className="text-sm text-gray-600">{order.orderId}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-gray-700">Customer</p>
                    <p className="text-sm text-gray-600">
                      {order.firstName} {order.lastName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-gray-700">Amount</p>
                    <p className="text-green-600 font-semibold">
                      ₹{order.grandTotal} 
                      <p>Payment Status: {order.paymentStatus}</p>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-gray-700">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm text-white ${
                        statusOptions.find((s) => s.value === order.status)
                          ?.color
                      }`}
                    >
                      {
                        statusOptions.find((s) => s.value === order.status)
                          ?.label
                      }
                    </span>
                  </div>

                  <div className="flex justify-end">
                    {expandedOrder === order.orderId ? (
                      <FaChevronUp className="text-gray-500" />
                    ) : (
                      <FaChevronDown className="text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              {expandedOrder === order.orderId && (
                <div className="p-4 bg-gray-50 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Shipping Details */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-4">
                        <FaInfoCircle className="text-blue-500 mr-2" />
                        <h3 className="font-semibold text-lg">
                          Shipping Details
                        </h3>
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <p>
                          {order.firstName} {order.lastName}
                        </p>
                        <p>
                          {order.address}, {order.apt || ""}
                        </p>
                        <p>
                          {order.city}, {order.state} - {order.postalCode}
                        </p>
                        <p>Phone: {order.phone}</p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-4">
                        <FaRupeeSign className="text-blue-500 mr-2" />
                        <h3 className="font-semibold text-lg">
                          Payment Details
                        </h3>
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{order.totalPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>₹{order.shippingCharge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>₹{order.tax}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span>Grand Total:</span>
                          <span>₹{order.grandTotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Order Items */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order?.orderItems?.map((item) => {
                        console.log("Rendering item:", item); // Debug: Log each item
                        if (item.productType === "pre-listed") {
                          const frame = item.frameSize?.frame; // Changed from frameSize.frame to Product (based on getUserOrders)
                          const images = frame?.images || [];
                          return (
                            <div
                              key={item.orderItemId}
                              className="flex items-start border-b pb-4 last:border-0"
                            >
                              <img
                                src={`${API_URL}/${images[0].imageUrl}`}
                                alt={item.frameSize?.Frame?.name || "Item"}
                                className="w-16 h-16 object-cover rounded mr-4"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/150";
                                  console.error(
                                    "Image load error:",
                                    item.frameSize?.Frame?.Images?.[0]?.imageUrl
                                  );
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">
                                  {frame?.name ||
                                    "Unknown Item"}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Size:{" "}
                                  {item.frameSize?.size?.label || (item.frameSize?.size?.width && item.frameSize?.size?.height ? `${item.frameSize.size.width} x ${item.frameSize.size.height} inch` : "N/A")}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} × ₹{item.price} = ₹
                                  {item.totalAmount}
                                </p>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={item.orderItemId}
                              className="flex items-start border-b pb-4 last:border-0"
                            >
                              <img
                                src={
                                  item.imageUrl
                                    ? `${API_URL}/${item.imageUrl}`
                                    : "https://via.placeholder.com/150"
                                }
                                alt="Custom Item"
                                className="w-16 h-16 object-cover rounded mr-4"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/150";
                                  console.error(
                                    "Custom image load error:",
                                    item.imageUrl
                                  );
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">
                                  Custom Frame
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Size:{" "}
                                  {item.customSize ||
                                    (item.width && item.height
                                      ? `${item.width} x ${item.height}`
                                      : "N/A")}
                                </p>
                                {item.material && (
                                  <p className="text-sm text-gray-600">
                                    Material: {item.material}
                                  </p>
                                )}
                                {item.frameShape && (
                                  <p className="text-sm text-gray-600">
                                    Frame Shape: {item.frameShape}
                                  </p>
                                )}
                                {item.frameMaterial && (
                                  <p className="text-sm text-gray-600">
                                    Frame Material: {item.frameMaterial}
                                  </p>
                                )}
                                {item.thickness && (
                                  <p className="text-sm text-gray-600">
                                    Thickness: {item.thickness}
                                  </p>
                                )}
                                {item.glassThickness && (
                                  <p className="text-sm text-gray-600">
                                    Glass Thickness: {item.glassThickness}
                                  </p>
                                )}
                                {item.instructions && (
                                  <p className="text-sm text-gray-600">
                                    Instructions: {item.instructions}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600">
                                  {item.quantity} × ₹{item.price} = ₹
                                  {item.totalAmount}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <select
                      value={order.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                      className="w-full sm:w-48 px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => confirmDelete(order.orderId)}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTrash />
                      Delete Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from(
          { length: Math.ceil(filteredOrders.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
