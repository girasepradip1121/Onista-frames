// import React, { useState, useEffect } from "react";
// import Profile from "../image/Profile.svg";
// import checklogo1 from "../image/checklogo1.svg";
// import checklogo2 from "../image/checklogo2.svg";
// import { useLocation, useNavigate } from "react-router-dom";
// import { API_URL, userToken } from "./Variable";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const CheckoutPage = () => {
//   const location = useLocation();
//   const userData = userToken();
//   const userId = userData?.userId;
//   const token = userData?.token;
//   const navigate = useNavigate();

//   const { cartItems = [], subtotal = 0 } = location.state || {};
//   const [customOrder, setCustomOrder] = useState(null); // For custom order from sessionStorage
//   const [imageFile, setImageFile] = useState(null); // For image file
//   const [imagePreview, setImagePreview] = useState(null); // For image preview
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "India",
//     paymentMethod: "COD",
//   });

//   // Fetch custom order from sessionStorage
//   useEffect(() => {
//     console.log("location.state:", location.state);
//     console.log("cartItems:", cartItems);
//     const storedCustomOrder = sessionStorage.getItem("customOrder");
//     if (storedCustomOrder) {
//       const parsedCustomOrder = JSON.parse(storedCustomOrder);
//       setCustomOrder(parsedCustomOrder);
//       console.log("customOrder:", parsedCustomOrder);
//     } else {
//       console.log("No customOrder in sessionStorage");
//     }

//     const storedImageUrl = sessionStorage.getItem("customOrderImageUrl");
//     if (storedImageUrl) {
//       console.log("Attempting to load storedImageUrl:", storedImageUrl);
//       setImagePreview(storedImageUrl);
//       // Fetch image to create File object for FormData
//       fetch(storedImageUrl)
//         .then((res) => {
//           if (!res.ok) throw new Error("Failed to fetch image");
//           return res.blob();
//         })
//         .then((blob) => {
//           const file = new File([blob], "custom-image.jpg", {
//             type: blob.type,
//           });
//           setImageFile(file);
//           console.log("imageFile set:", file);
//         })
//         .catch((err) => {
//           console.error("Error fetching image:", err);
//           sessionStorage.removeItem("customOrderImageUrl");
//           setError(
//             "Custom order image failed to load. Please upload the image again."
//           );
//         });
//     } else if (storedCustomOrder) {
//       setError("Custom order image is missing. Please upload the image.");
//       console.log("No customOrderImageUrl in sessionStorage");
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       const newPreview = URL.createObjectURL(file);
//       setImagePreview(newPreview);
//       // Store new Blob URL in sessionStorage
//       sessionStorage.setItem("customOrderImage", newPreview);
//       // Revoke old Blob URL if exists
//       const oldImageUrl = sessionStorage.getItem("customOrderImage");
//       if (oldImageUrl && oldImageUrl !== newPreview) {
//         URL.revokeObjectURL(oldImageUrl);
//       }
//     }
//   };

//   const validateForm = () => {
//     if (!formData.firstName) return "First name is required";
//     if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
//       return "Valid email is required";
//     if (!formData.phone || !/^\d{10}$/.test(formData.phone))
//       return "Valid 10-digit phone number is required";
//     if (!formData.address) return "Address is required";
//     if (!formData.city) return "City is required";
//     if (!formData.state) return "State is required";
//     if (!formData.postalCode || !/^\d{6}$/.test(formData.postalCode))
//       return "Valid 6-digit PIN code is required";
//     if (!formData.country) return "Country is required";
//     if (customOrder && !imageFile) return "Image is required for custom order";
//     return null;
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Validate token
//       if (!token) {
//         throw new Error("Please log in to place an order");
//       }

//       // Validate cart or custom order
//       if ((!cartItems || cartItems.length === 0) && !customOrder) {
//         throw new Error("Your cart is empty and no custom order provided");
//       }

//       // Validate form
//       const validationError = validateForm();
//       if (validationError) {
//         throw new Error(validationError);
//       }

//       // Prepare FormData for multipart/form-data
//       const formDataPayload = new FormData();
//       const orderData = {
//         userId,
//         shippingInfo: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address,
//           city: formData.city,
//           state: formData.state,
//           postalCode: formData.postalCode,
//           country: formData.country,
//         },
//         paymentMethod: formData.paymentMethod,
//         cartItems: cartItems.map((item) => ({
//           frameSizeId: item.frameSizeId,
//           quantity: item.quantity,
//           price: item.price,
//           color:item.color,
//         })),
//         customOrder: customOrder
//           ? {
//               price: customOrder.price,
//               quantity: customOrder.quantity || 1,
//               customSize: customOrder.customSize,
//               dimensions: customOrder.dimensions,
//               material: customOrder.material,
//               frameShape: customOrder.frameShape,
//               frameMaterial: customOrder.frameMaterial,
//               thickness: customOrder.thickness,
//               glassThickness: customOrder.glassThickness,
//               instructions: customOrder.instructions,
//               color:customOrder.color,

//             }
//           : null,
//       };
//       console.log("orderData:", orderData); // Debug: Check payload before sending

//       // Append JSON data and image file
//       formDataPayload.append("data", JSON.stringify(orderData));
//       if (imageFile) {
//         formDataPayload.append("image", imageFile);
//       }

//       const response = await axios.post(
//         `${API_URL}/order/createorder`,
//         formDataPayload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       toast.success("Order placed successfully!");
//       sessionStorage.removeItem("customOrder");
//       sessionStorage.removeItem("customOrderImage");
//       // Navigate to order success page
//         navigate("/order-success", {
//         state: {
//           order: {
//             orderId: response.data.order.orderId,
//             items: [
//               ...cartItems.map((item) => ({
//                 name: item.name,
//                 image: item.image,
//                 quantity: item.quantity,
//                 size: item.size,
//                 price: item.price,
//                 color:item.color
//               })),
//               ...(customOrder
//                 ? [
//                     {
//                       name: "Custom Frame",
//                       image: response.data.orderItems.find(
//                         (item) => item.productType === "custom"
//                       )?.imageUrl,
//                       quantity: customOrder.quantity || 1,
//                       size: customOrder.customSize,
//                       price: customOrder.price,
//                     },
//                   ]
//                 : []),
//             ],
//             total: response.data.order.grandTotal,
//             deliveryDate: new Date(
//               Date.now() + 5 * 24 * 60 * 60 * 1000
//             ).toLocaleDateString("en-IN", {
//               weekday: "short",
//               day: "numeric",
//               month: "short",
//               year: "numeric",
//             }),
//           },
//         },
//       });
//     } catch (err) {
//       const message =
//         err.response?.data?.error || err.message || "Failed to place order";
//       setError(message);
//       toast.error(message);
//       console.error("Checkout error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateTotal = () => {
//     let calculatedSubtotal = subtotal;
//     if (customOrder) {
//       calculatedSubtotal += customOrder.price * (customOrder.quantity || 1);
//     }
//     const tax = calculatedSubtotal * 0.18;
//     const total = calculatedSubtotal + tax;
//     return { subtotal: calculatedSubtotal, tax, total };
//   };

//   const { subtotal: calculatedSubtotal, tax, total } = calculateTotal();

//   const formatPrice = (price) => {
//     return (
//       price?.toLocaleString("en-IN", {
//         maximumFractionDigits: 2,
//         minimumFractionDigits: 2,
//       }) || "0.00"
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white px-6 py-10 lg:px-20">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
//         {/* Shipping Info */}
//         <div className="lg:col-span-2">
//           <button
//             onClick={() => navigate("/cart")}
//             style={{ fontFamily: "Times New Roman" }}
//             className="text-sm text-gray-500 mb-6 hover:text-gray-700 transition"
//           >
//             ← Continue Shopping
//           </button>
//           <h2
//             style={{ fontFamily: "Times New Roman" }}
//             className="text-2xl tracking-widest mb-6"
//           >
//             Shipping Information
//           </h2>

//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//               {error}
//             </div>
//           )}

//           <form
//             onSubmit={handlePlaceOrder}
//             className="grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 First Name *
//               </label>
//               <input
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="First Name"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 Last Name
//               </label>
//               <input
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="Last Name"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 Email Address *
//               </label>
//               <input
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="email"
//                 placeholder="Email Address"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 Phone Number *
//               </label>
//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="tel"
//                 placeholder="Phone Number"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 Street Address *
//               </label>
//               <input
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="Street Address"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">City *</label>
//               <input
//                 name="city"
//                 value={formData.city}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="City"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 State *
//               </label>
//               <select
//                 name="state"
//                 value={formData.state}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               >
//                 <option value="">Select State</option>
//                 <option value="Gujarat">Gujarat</option>
//                 <option value="Maharashtra">Maharashtra</option>
//                 <option value="Delhi">Delhi</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 PIN Code *
//               </label>
//               <input
//                 name="postalCode"
//                 value={formData.postalCode}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="PIN Code"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600 mb-1">
//                 Country *
//               </label>
//               <select
//                 name="country"
//                 value={formData.country}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               >
//                 <option value="">Select Country</option>
//                 <option value="India">India</option>
//                 <option value="USA">USA</option>
//                 <option value="UK">UK</option>
//               </select>
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600 mb-1">
//                 Payment Method *
//               </label>
//               <select
//                 name="paymentMethod"
//                 value={formData.paymentMethod}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               >
//                 <option value="COD">Cash on Delivery</option>
//                 <option value="ONLINE">Online Payment</option>
//               </select>
//             </div>

//             {/* Place Order Button */}
//             <div className="md:col-span-2">
//               <button
//                 type="submit"
//                 style={{ fontFamily: "Times New Roman" }}
//                 className={`w-full bg-black text-white py-3 text-lg tracking-widest rounded ${
//                   loading
//                     ? "opacity-50 cursor-not-allowed"
//                     : "hover:bg-gray-800"
//                 }`}
//                 disabled={loading}
//               >
//                 {loading ? "Placing Order..." : "Place Order"}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Order Summary */}
//         <div className="pt-10 lg:pt-10 lg:pl-10">
//           <h2
//             style={{ fontFamily: "Times New Roman" }}
//             className="text-2xl tracking-widest mb-6"
//           >
//             Order Summary
//           </h2>

//           {cartItems.length === 0 && !customOrder ? (
//             <p className="text-gray-600">Your Cart is empty</p>
//           ) : (
//             <>
//               {/* Cart Items */}
//               {cartItems.map((item, index) => (
//                 <div key={index} className="flex items-start gap-4 mb-6">
//                   <img
//                     src={`${API_URL}/${item.image}`}
//                     alt={item.name}
//                     className="w-20 h-20 object-cover rounded"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/80";
//                     }}
//                   />
//                   <div>
//                     <h3
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="font-medium text-lg"
//                     >
//                       {item.name}
//                     </h3>
//                     <p
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="text-lg text-gray-500"
//                     >
//                       {item.size} | {item.color}
//                     </p>
//                     <p
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="text-lg text-gray-500"
//                     >
//                       Qty: {item.quantity}
//                     </p>
//                     <p
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="text-base mt-1 font-medium"
//                     >
//                       ₹{formatPrice(item.price * item.quantity)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//               {/* Custom Order */}
//               {customOrder && (
//                 <div className="mb-6">
//                   <h3
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="font-medium text-lg mb-2"
//                   >
//                     Custom Frame
//                   </h3>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Size: {customOrder.customSize}
//                   </p>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Material: {customOrder.material}
//                   </p>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Frame Shape: {customOrder.frameShape}
//                   </p>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Frame Material: {customOrder.frameMaterial}
//                   </p>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Thickness: {customOrder.thickness}
//                   </p>
//                   {customOrder.glassThickness && (
//                     <p
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="text-lg text-gray-500"
//                     >
//                       Glass Thickness: {customOrder.glassThickness}
//                     </p>
//                   )}
//                   {customOrder.instructions && (
//                     <p
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="text-lg text-gray-500"
//                     >
//                       Instructions: {customOrder.instructions}
//                     </p>
//                   )}
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Qty: {customOrder.quantity || 1}
//                   </p>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-base mt-1 font-medium"
//                   >
//                     ₹
//                     {formatPrice(
//                       customOrder.price * (customOrder.quantity || 1)
//                     )}
//                   </p>
//                   <div className="mt-4">
//                     {/* <label
//                       className="block text-sm text-gray-600 mb-1"
//                       style={{ fontFamily: "Times New Roman" }}
//                     >
//                       Custom Image{" "}
//                       {imagePreview ? "(Change Image)" : "(Upload Image)"} *
//                     </label> */}
//                     {/* <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="border border-gray-300 rounded px-4 py-2 w-full"
//                       // Image is required only if no image is already selected
//                       required={!imagePreview}
//                     /> */}
//                     {imagePreview && (
//                       <img
//                         src={imagePreview}
//                         alt="Custom Frame Preview"
//                         className="w-20 h-20 object-cover rounded mt-2"
//                       />
//                     )}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           <div
//             style={{ fontFamily: "Times New Roman" }}
//             className="text-lg text-gray-600 pt-4 space-y-2"
//           >
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>₹{formatPrice(calculatedSubtotal)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Shipping</span>
//               <span>Free</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Tax (18% GST)</span>
//               <span>₹{formatPrice(tax)}</span>
//             </div>
//             <div className="flex justify-between font-semibold border-t pt-2">
//               <span>Total</span>
//               <span>₹{formatPrice(total)}</span>
//             </div>
//           </div>

//           <div
//             style={{ fontFamily: "Times New Roman" }}
//             className="space-y-2 items-center gap-4 text-lg mt-6"
//           >
//             <div className="flex items-center gap-2">
//               <img src={checklogo1} alt="Free Shipping" className="h-10" />
//               Free Shipping
//             </div>
//             <div className="flex items-center gap-2">
//               <img src={checklogo2} alt="Warranty" className="h-8" />
//               2-Year Warranty
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;


// import React, { useState } from "react";
// import checklogo1 from "../image/checklogo1.svg";
// import checklogo2 from "../image/checklogo2.svg";
// import { useLocation, useNavigate } from "react-router-dom";
// import { API_URL, userToken } from "./Variable";
// import axios from "axios";
// import toast from "react-hot-toast";

// const CheckoutPage = () => {
//   const location = useLocation();
//   const userData = userToken();
//   const userId = userData?.userId;
//   const token = userData?.token;
//   const navigate = useNavigate();

//   const { cartItems = [], subtotal = 0, customOrder = null, imageFile = null } = location.state || {};
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "India",
//     paymentMethod: "COD",
//   });

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const validateForm = () => {
//     if (!formData.firstName) return "First name is required";
//     if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
//       return "Valid email is required";
//     if (!formData.phone || !/^\d{10}$/.test(formData.phone))
//       return "Valid 10-digit phone number is required";
//     if (!formData.address) return "Address is required";
//     if (!formData.city) return "City is required";
//     if (!formData.state) return "State is required";
//     if (!formData.postalCode || !/^\d{6}$/.test(formData.postalCode))
//       return "Valid 6-digit PIN code is required";
//     if (!formData.country) return "Country is required";
//     if (customOrder && !imageFile) return "Image is required for custom order";
//     return null;
//   };

//   const loadRazorpay = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const placeOrder = async (orderData) => {
//     const formDataPayload = new FormData();
//     formDataPayload.append("data", JSON.stringify(orderData));
//     if (imageFile) {
//       formDataPayload.append("image", imageFile);
//     }

//     try {
//       const response = await axios.post(
//         `${API_URL}/order/createorder`,
//         formDataPayload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       toast.success("Order placed successfully!");
//       navigate("/order-success", {
//         state: {
//           order: {
//             orderId: response.data.order.orderId,
//             items: [
//               ...cartItems.map((item) => ({
//                 name: item.name,
//                 image: item.image,
//                 quantity: item.quantity,
//                 size: item.size,
//                 price: item.price,
//                 color: item.color,
//               })),
//               ...(customOrder
//                 ? [
//                     {
//                       name: "Custom Frame",
//                       image: response.data.orderItems.find(
//                         (item) => item.productType === "custom"
//                       )?.imageUrl,
//                       quantity: customOrder.quantity || 1,
//                       size: customOrder.customSize,
//                       price: customOrder.price,
//                     },
//                   ]
//                 : []),
//             ],
//             total: response.data.order.grandTotal,
//             deliveryDate: new Date(
//               Date.now() + 5 * 24 * 60 * 60 * 1000
//             ).toLocaleDateString("en-IN", {
//               weekday: "short",
//               day: "numeric",
//               month: "short",
//               year: "numeric",
//             }),
//           },
//         },
//       });
//     } catch (err) {
//       const message =
//         err.response?.data?.error || err.message || "Failed to place order";
//       throw new Error(message);
//     }
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       if (!token) {
//         throw new Error("Please log in to place an order");
//       }

//       if ((!cartItems || cartItems.length === 0) && !customOrder) {
//         throw new Error("Your cart is empty and no custom order provided");
//       }

//       const validationError = validateForm();
//       if (validationError) {
//         throw new Error(validationError);
//       }

//       const orderData = {
//         userId,
//         shippingInfo: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address,
//           city: formData.city,
//           state: formData.state,
//           postalCode: formData.postalCode,
//           country: formData.country,
//         },
//         paymentMethod: formData.paymentMethod,
//         cartItems: cartItems.map((item) => ({
//           frameSizeId: item.frameSizeId,
//           quantity: item.quantity,
//           price: item.price,
//           color: item.color,
//         })),
//         customOrder: customOrder
//           ? {
//               price: customOrder.price,
//               quantity: customOrder.quantity || 1,
//               customSize: customOrder.customSize,
//               dimensions: customOrder.dimensions,
//               material: customOrder.material,
//               frameShape: customOrder.frameShape,
//               frameMaterial: customOrder.frameMaterial,
//               thickness: customOrder.thickness,
//               glassThickness: customOrder.glassThickness,
//               instructions: customOrder.instructions,
//               color: "Blue",
//             }
//           : null,
//       };

//       if (formData.paymentMethod === "Card") {
//         // Load Razorpay SDK
//         const isLoaded = await loadRazorpay();
//         if (!isLoaded) {
//           throw new Error("Failed to load Razorpay SDK");
//         }

//         // Create Razorpay order
//         const razorpayRes = await axios.post(
//           `${API_URL}/razorpay/create-razorpay-order`,
//           { totalPrice: total },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const { orderId, key, amount, currency } = razorpayRes.data;

//         // Initialize Razorpay Checkout
//         const options = {
//           key,
//           amount,
//           currency,
//           order_id: orderId,
//           name: "RAHA ORGANIC",
//           description: "Order Payment",
//           handler: async function (response) {
//             try {
//               // Verify payment
//               const verifyResponse = await axios.post(
//                 `${API_URL}/razorpay/verify-payment`,
//                 {
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_signature: response.razorpay_signature,
//                 },
//                 {
//                   headers: {
//                     Authorization: `Bearer ${token}`,
//                   },
//                 }
//               );

//               if (verifyResponse.data.success) {
//                 // Payment verified, place order
//                 await placeOrder({
//                   ...orderData,
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_signature: response.razorpay_signature,
//                 });
//               } else {
//                 throw new Error("Payment verification failed");
//               }
//             } catch (err) {
//               const message =
//                 err.response?.data?.message ||
//                 err.message ||
//                 "Failed to verify payment";
//               setError(message);
//               toast.error(message);
//             }
//           },
//           prefill: {
//             name: `${formData.firstName} ${formData.lastName}`,
//             email: formData.email,
//             contact: formData.phone,
//           },
//           theme: { color: "#000000" }, // Match first CheckoutPage
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.on('payment.failed', () => {
//           setError("Payment failed. Please try again.");
//           toast.error("Payment failed. Please try again.");
//         });
//         rzp.open();
//       } else {
//         // COD: Place order directly
//         await placeOrder(orderData);
//       }
//     } catch (err) {
//       const message =
//         err.response?.data?.error || err.message || "Failed to place order";
//       setError(message);
//       toast.error(message);
//       console.error("Checkout error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateTotal = () => {
//     let calculatedSubtotal = subtotal;
//     if (customOrder) {
//       calculatedSubtotal += customOrder.price * (customOrder.quantity || 1);
//     }
//     const tax = calculatedSubtotal * 0.18;
//     const total = calculatedSubtotal + tax;
//     return { subtotal: calculatedSubtotal, tax, total };
//   };

//   const { subtotal: calculatedSubtotal, tax, total } = calculateTotal();

//   const formatPrice = (price) => {
//     return (
//       price?.toLocaleString("en-IN", {
//         maximumFractionDigits: 2,
//         minimumFractionDigits: 2,
//       }) || "0.00"
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white px-6 py-10 lg:px-20">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
//         {/* Shipping Info */}
//         <div className="lg:col-span-2">
//           <button
//             onClick={() => navigate("/cart")}
//             style={{ fontFamily: "Times New Roman" }}
//             className="text-sm text-gray-500 mb-6 hover:text-gray-700 transition"
//           >
//             ← Continue Shopping
//           </button>
//           <h2
//             style={{ fontFamily: "Times New Roman" }}
//             className="text-2xl tracking-widest mb-6"
//           >
//             Shipping Information
//           </h2>

//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//               {error}
//             </div>
//           )}

//           <form
//             onSubmit={handlePlaceOrder}
//             className="grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 First Name *
//               </label>
//               <input
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="First Name"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 Last Name
//               </label>
//               <input
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="Last Name"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600 mb-1">
//                 Email Address *
//               </label>
//               <input
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="email"
//                 placeholder="Email Address"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600 mb-1">
//                 Phone Number *
//               </label>
//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="Phone Number"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600 mb-1">
//                 Address *
//               </label>
//               <input
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="Address"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">City *</label>
//               <input
//                 name="city"
//                 value={formData.city}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="City"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 State *
//               </label>
//               <input
//                 name="state"
//                 value={formData.state}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="State"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 PIN Code *
//               </label>
//               <input
//                 name="postalCode"
//                 value={formData.postalCode}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="PIN Code"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 Country *
//               </label>
//               <input
//                 name="country"
//                 value={formData.country}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 type="text"
//                 placeholder="Country"
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600 mb-1">
//                 Payment Method *
//               </label>
//               <select
//                 name="paymentMethod"
//                 value={formData.paymentMethod}
//                 onChange={handleInputChange}
//                 style={{ fontFamily: "Times New Roman" }}
//                 className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
//               >
//                 <option value="COD">Cash on Delivery</option>
//                 <option value="Card">Credit/Debit Card</option>
//               </select>
//             </div>
//             <div className="md:col-span-2">
//               <button
//                 type="submit"
//                 style={{ fontFamily: "Times New Roman" }}
//                 className={`w-full bg-black text-white py-3 text-lg tracking-widest rounded ${
//                   loading
//                     ? "opacity-50 cursor-not-allowed"
//                     : "hover:bg-gray-800"
//                 }`}
//                 disabled={loading}
//               >
//                 {loading ? "Placing Order..." : "Place Order"}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Order Summary */}
//         <div className="pt-10 lg:pt-10 lg:pl-10">
//           <h2
//             style={{ fontFamily: "Times New Roman" }}
//             className="text-2xl tracking-widest mb-6"
//           >
//             Order Summary
//           </h2>

//           {cartItems.length === 0 && !customOrder ? (
//             <p className="text-gray-600">Your Cart is empty</p>
//           ) : (
//             <>
//               {cartItems.map((item, index) => (
//                 <div key={index} className="flex items-start gap-4 mb-6">
//                   <img
//                     src={`${API_URL}/${item.image}`}
//                     alt={item.name}
//                     className="w-20 h-20 object-cover rounded"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/80";
//                     }}
//                   />
//                   <div>
//                     <h3
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="font-medium text-lg"
//                     >
//                       {item.name}
//                     </h3>
//                     <p
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="text-lg text-gray-500"
//                     >
//                       {item.size} | {item.color}
//                     </p>
//                     <p
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="text-lg text-gray-500"
//                     >
//                       Qty: {item.quantity}
//                     </p>
//                     <p
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="text-base mt-1 font-medium"
//                     >
//                       ₹{formatPrice(item.price * item.quantity)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//               {customOrder && (
//                 <div className="mb-6">
//                   <h3
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="font-medium text-lg mb-2"
//                   >
//                     Custom Frame
//                   </h3>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Size: {customOrder.customSize}
//                   </p>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Material: {customOrder.material}
//                   </p>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Frame Shape: {customOrder.frameShape}
//                   </p>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Frame Material: {customOrder.frameMaterial}
//                   </p>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Thickness: {customOrder.thickness}
//                   </p>
//                   {customOrder.glassThickness && (
//                     <p
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="text-lg text-gray-500"
//                     >
//                       Glass Thickness: {customOrder.glassThickness}
//                     </p>
//                   )}
//                   {customOrder.instructions && (
//                     <p
//                       style={{ fontFamily: "Times New Roman" }}
//                       className="text-lg text-gray-500"
//                     >
//                       Instructions: {customOrder.instructions}
//                     </p>
//                   )}
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-lg text-gray-500"
//                   >
//                     Qty: {customOrder.quantity || 1}
//                   </p>
//                   <p
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-base mt-1 font-medium"
//                   >
//                     ₹
//                     {formatPrice(
//                       customOrder.price * (customOrder.quantity || 1)
//                     )}
//                   </p>
//                   {imageFile && (
//                     <img
//                       src={URL.createObjectURL(imageFile)}
//                       alt="Custom Frame Preview"
//                       className="w-20 h-20 object-cover rounded mt-2"
//                     />
//                   )}
//                 </div>
//               )}
//             </>
//           )}

//           <div
//             style={{ fontFamily: "Times New Roman" }}
//             className="text-lg text-gray-600 pt-4 space-y-2"
//           >
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>₹{formatPrice(calculatedSubtotal)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Shipping</span>
//               <span>Free</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Tax (18% GST)</span>
//               <span>₹{formatPrice(tax)}</span>
//             </div>
//             <div className="flex justify-between font-semibold border-t pt-2">
//               <span>Total</span>
//               <span>₹{formatPrice(total)}</span>
//             </div>
//           </div>

//           <div
//             style={{ fontFamily: "Times New Roman" }}
//             className="space-y-2 items-center gap-4 text-lg mt-6"
//           >
//             <div className="flex items-center gap-2">
//               <img src={checklogo1} alt="Free Shipping" className="h-10" />
//               Free Shipping
//             </div>
//             <div className="flex items-center gap-2">
//               <img src={checklogo2} alt="Warranty" className="h-8" />
//               2-Year Warranty
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

import React, { useState } from "react";
import checklogo1 from "../image/checklogo1.svg";
import checklogo2 from "../image/checklogo2.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL, userToken } from "./Variable";
import axios from "axios";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const location = useLocation();
  const userData = userToken();
  const userId = userData?.userId;
  const token = userData?.token;
  const navigate = useNavigate();

  const { cartItems = [], subtotal = 0, customOrder = null, imageFile = null } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "COD",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.firstName) return "First name is required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
      return "Valid email is required";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone))
      return "Valid 10-digit phone number is required";
    if (!formData.address) return "Address is required";
    if (!formData.city) return "City is required";
    if (!formData.state) return "State is required";
    if (!formData.postalCode || !/^\d{6}$/.test(formData.postalCode))
      return "Valid 6-digit PIN code is required";
    if (!formData.country) return "Country is required";
    if (customOrder && !imageFile) return "Image is required for custom order";
    return null;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async (orderData) => {
    const formDataPayload = new FormData();
    formDataPayload.append("data", JSON.stringify(orderData));
    if (imageFile) {
      formDataPayload.append("image", imageFile);
    }

    console.log("Order Data sent to backend:", orderData); // Debug log

    try {
      const response = await axios.post(
        `${API_URL}/order/createorder`,
        formDataPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Order placed successfully!");
      navigate("/order-success", {
        state: {
          order: {
            orderId: response.data.order.orderId,
            items: [
              ...cartItems.map((item) => ({
                name: item.name,
                image: item.image,
                quantity: item.quantity,
                size: item.size,
                price: item.price,
                color: item.color,
              })),
              ...(customOrder
                ? [
                    {
                      name: "Custom Frame",
                      image: response.data.orderItems.find(
                        (item) => item.productType === "custom"
                      )?.imageUrl,
                      quantity: customOrder.quantity || 1,
                      size: customOrder.customSize,
                      price: customOrder.price,
                    },
                  ]
                : []),
            ],
            total: response.data.order.grandTotal,
            deliveryDate: new Date(
              Date.now() + 5 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Failed to place order";
      throw new Error(message);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!token) {
        throw new Error("Please log in to place an order");
      }

      if ((!cartItems || cartItems.length === 0) && !customOrder) {
        throw new Error("Your cart is empty and no custom order provided");
      }

      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      const orderData = {
        userId,
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        cartItems: cartItems.map((item) => ({
          frameSizeId: item.frameSizeId,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
        })),
        customOrder: customOrder
          ? {
              price: customOrder.price,
              quantity: customOrder.quantity || 1,
              customSize: customOrder.customSize,
              dimensions: customOrder.dimensions,
              material: customOrder.material,
              frameShape: customOrder.frameShape,
              frameMaterial: customOrder.frameMaterial,
              thickness: customOrder.thickness,
              glassThickness: customOrder.glassThickness,
              instructions: customOrder.instructions,
              color: "Blue",
            }
          : null,
      };

      if (formData.paymentMethod === "Card") {
        // Load Razorpay SDK
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          throw new Error("Failed to load Razorpay SDK");
        }

        // Create Razorpay order
        const razorpayRes = await axios.post(
          `${API_URL}/razorpay/create-razorpay-order`,
          { totalPrice: total },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { orderId, key, amount, currency } = razorpayRes.data;

        // Initialize Razorpay Checkout
        const options = {
          key,
          amount,
          currency,
          order_id: orderId,
          name: "Onista Frames",
          description: "Order Payment",
          handler: async function (response) {
            try {
              console.log("Razorpay Response:", response); // Debug log

              // Verify payment
              const verifyResponse = await axios.post(
                `${API_URL}/razorpay/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (verifyResponse.data.success) {
                // Payment verified, place order with Razorpay details
                const updatedOrderData = {
                  ...orderData,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  paymentStatus: "Paid",
                };

                console.log("Updated Order Data:", updatedOrderData); // Debug log

                await placeOrder(updatedOrderData);
              } else {
                throw new Error("Payment verification failed");
              }
            } catch (err) {
              const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to verify payment";
              setError(message);
              toast.error(message);
              console.error("Payment verification error:", err);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#000000" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', () => {
          setError("Payment failed. Please try again.");
          toast.error("Payment failed. Please try again.");
        });
        rzp.open();
      } else {
        // COD: Place order directly
        await placeOrder(orderData);
      }
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Failed to place order";
      setError(message);
      toast.error(message);
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    let calculatedSubtotal = subtotal;
    if (customOrder) {
      calculatedSubtotal += customOrder.price * (customOrder.quantity || 1);
    }
    const tax = calculatedSubtotal * 0.18;
    const total = calculatedSubtotal + tax;
    return { subtotal: calculatedSubtotal, tax, total };
  };

  const { subtotal: calculatedSubtotal, tax, total } = calculateTotal();

  const formatPrice = (price) => {
    return (
      price?.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) || "0.00"
    );
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Shipping Info */}
        <div className="lg:col-span-2">
          <button
            onClick={() => navigate("/cart")}
            style={{ fontFamily: "Times New Roman" }}
            className="text-sm text-gray-500 mb-6 hover:text-gray-700 transition"
          >
            ← Continue Shopping
          </button>
          <h2
            style={{ fontFamily: "Times New Roman" }}
            className="text-2xl tracking-widest mb-6"
          >
            Shipping Information
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                First Name *
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                style={{ fontFamily: "Times New Roman" }}
                type="text"
                placeholder="First Name"
                className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                style={{ fontFamily: "Times New Roman" }}
                type="text"
                placeholder="Last Name"
                className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Email Address *
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ fontFamily: "Times New Roman" }}
                type="email"
                placeholder="Email Address"
                className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Phone Number *
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{ fontFamily: "Times New Roman" }}
                type="text"
                placeholder="Phone Number"
                className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Address *
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                style={{ fontFamily: "Times New Roman" }}
                type="text"
                placeholder="Address"
                className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">City *</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                style={{ fontFamily: "Times New Roman" }}
                type="text"
                placeholder="City"
                className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                State *
              </label>
              <input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                style={{ fontFamily: "Times New Roman" }}
                type="text"
                placeholder="State"
                className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                PIN Code *
              </label>
              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                style={{ fontFamily: "Times New Roman" }}
                type="text"
                placeholder="PIN Code"
                className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Country *
              </label>
              <input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                style={{ fontFamily: "Times New Roman" }}
                type="text"
                placeholder="Country"
                className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Payment Method *
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                style={{ fontFamily: "Times New Roman" }}
                className="border border-gray-300 rounded px-4 py-2 w-full outline-none focus:ring-2 focus:ring-black"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="Card">Credit/Debit Card</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                style={{ fontFamily: "Times New Roman" }}
                className={`w-full bg-black text-white py-3 text-lg tracking-widest rounded ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="pt-10 lg:pt-10 lg:pl-10">
          <h2
            style={{ fontFamily: "Times New Roman" }}
            className="text-2xl tracking-widest mb-6"
          >
            Order Summary
          </h2>

          {cartItems.length === 0 && !customOrder ? (
            <p className="text-gray-600">Your Cart Is Empty</p>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4 mb-6">
                  <img
                    src={`${API_URL}/${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80";
                    }}
                  />
                  <div>
                    <h3
                      style={{ fontFamily: "Times New Roman" }}
                      className="font-medium text-lg"
                    >
                      {item.name}
                    </h3>
                    <p
                      style={{ fontFamily: "Times New Roman" }}
                      className="text-lg text-gray-500"
                    >
                      {item.size} | {item.color}
                    </p>
                    <p
                      style={{ fontFamily: "Times New Roman" }}
                      className="text-lg text-gray-500"
                    >
                      Qty: {item.quantity}
                    </p>
                    <p
                      style={{ fontFamily: "Times New Roman" }}
                      className="text-base mt-1 font-medium"
                    >
                      ₹{formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
              {customOrder && (
                <div className="mb-6">
                  <h3
                    style={{ fontFamily: "Times New Roman" }}
                    className="font-medium text-lg mb-2"
                  >
                    Custom Frame
                  </h3>
                  <p
                    style={{ fontFamily: "Times New Roman" }}
                    className="text-lg text-gray-500"
                  >
                    Size: {customOrder.customSize}
                  </p>
                  <p
                    style={{ fontFamily: "Times New Roman" }}
                    className="text-lg text-gray-500"
                  >
                    Material: {customOrder.material}
                  </p>
                  <p
                    style={{ fontFamily: "Times New Roman" }}
                    className="text-lg text-gray-500"
                  >
                    Frame Shape: {customOrder.frameShape}
                  </p>
                  <p
                    style={{ fontFamily: "Times New Roman" }}
                    className="text-lg text-gray-500"
                  >
                    Frame Material: {customOrder.frameMaterial}
                  </p>
                  <p
                    style={{ fontFamily: "Times New Roman" }}
                    className="text-lg text-gray-500"
                  >
                    Thickness: {customOrder.thickness}
                  </p>
                  {customOrder.glassThickness && (
                    <p
                      style={{ fontFamily: "Times New Roman" }}
                      className="text-lg text-gray-500"
                    >
                      Glass Thickness: {customOrder.glassThickness}
                    </p>
                  )}
                  {customOrder.instructions && (
                    <p
                      style={{ fontFamily: "Times New Roman" }}
                      className="text-lg text-gray-500"
                    >
                      Instructions: {customOrder.instructions}
                    </p>
                  )}
                  <p
                    style={{ fontFamily: "Times New Roman" }}
                    className="text-lg text-gray-500"
                  >
                    Qty: {customOrder.quantity || 1}
                  </p>
                  <p
                    style={{ fontFamily: "Times New Roman" }}
                    className="text-base mt-1 font-medium"
                    >
                    ₹
                    {formatPrice(
                      customOrder.price * (customOrder.quantity || 1)
                    )}
                  </p>
                  {imageFile && (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Custom Frame Preview"
                      className="w-20 h-20 object-cover rounded mt-2"
                    />
                  )}
                </div>
              )}
            </>
          )}

          <div
            style={{ fontFamily: "Times New Roman" }}
            className="text-lg text-gray-600 pt-4 space-y-2"
          >
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{formatPrice(calculatedSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18% GST)</span>
              <span>₹{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>₹{formatPrice(total)}</span>
            </div>
          </div>

          <div
            style={{ fontFamily: "Times New Roman" }}
            className="space-y-2 items-center gap-4 text-lg mt-6"
          >
            <div className="flex items-center gap-2">
              <img src={checklogo1} alt="Free Shipping" className="h-10" />
              Free Shipping
            </div>
            <div className="flex items-center gap-2">
              <img src={checklogo2} alt="Warranty" className="h-8" />
              2-Year Warranty
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;