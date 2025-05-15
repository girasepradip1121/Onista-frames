// import { useEffect, useState } from "react";
// import {
//   Minus,
//   Plus,
//   Truck,
//   ShieldCheck,
//   Star,
//   X,
//   ShoppingBag,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import Cart from "./Cart";
// import axios from "axios";
// import { API_URL, userToken } from "./Variable";
// import toast from "react-hot-toast";

// export default function ProductDetail() {
//   const [quantity, setQuantity] = useState(1);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [selectedFrame, setSelectedFrame] = useState(null);
//   const [activeTab, setActiveTab] = useState("Description");
//   const [showSpecDetails, setShowSpecDetails] = useState(false);
//   const [activeSpec, setActiveSpec] = useState("");
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [reviewRating, setReviewRating] = useState(5);
//   const [reviewTitle, setReviewTitle] = useState("");
//   const [reviewContent, setReviewContent] = useState("");
//   const [reviewName, setReviewName] = useState("");
//   const [hasPurchased, setHasPurchased] = useState(false);
//   const [isLoadingPurchaseCheck, setIsLoadingPurchaseCheck] = useState(true);
//   const [reviews, setReviews] = useState([]);
//   const [bestSellingArtworks, setBestSellingArtworks] = useState([]);
//   const [basePrice, setBasePrice] = useState(0);
//   const [offerBasePrice, setOfferBasePrice] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [frame, setFrame] = useState(null);
//   const [showAllReviews, setShowAllReviews] = useState(false);

//   const { frameId } = useParams();
//   const navigate = useNavigate();
//   const userData = userToken();
//   const userId = userData?.userId;
//   const token = userData?.token;

//   const toggleCart = () => setIsCartOpen(!isCartOpen);

//   const incrementQuantity = () => {
//     if (selectedSize && quantity >= selectedSize.remained_qty) {
//       toast.error(`Only ${selectedSize.remained_qty} units available`);
//       return;
//     }
//     setQuantity(quantity + 1);
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   const handleSpecClick = (spec) => {
//     if (activeSpec === spec) {
//       setActiveSpec("");
//       setShowSpecDetails(false);
//     } else {
//       setActiveSpec(spec);
//       setShowSpecDetails(true);
//     }
//   };

//   const openReviewModal = async () => {
//     if (!token) {
//       toast.error("Please log in to write a review");
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API_URL}/order/hasPurchased/${frameId}`,
//         { userId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("Purchase check response:", response.data);

//       if (response.data.hasPurchased) {
//         setShowReviewModal(true);
//       } else {
//         toast.error("You can only review products you have purchased.");
//       }
//     } catch (error) {
//       console.error("Error checking purchase status:", error);
//       toast.error("Failed to verify purchase status. Please try again.");
//     }
//   };

//   const closeReviewModal = () => {
//     setShowReviewModal(false);
//     setReviewRating(5);
//     setReviewTitle("");
//     setReviewContent("");
//     setReviewName("");
//   };

//   const handleSubmitReview = async (e) => {
//     e.preventDefault();

//     try {
//       const payload = {
//         frameId: parseInt(frameId),
//         userId: userData?.userId,
//         name: reviewName,
//         title: reviewTitle,
//         review: reviewContent,
//         rating: reviewRating,
//       };

//       console.log("Submitting review:", payload);

//       const response = await axios.post(`${API_URL}/review/submit`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//         validateStatus: (status) => status >= 200 && status < 300,
//       });

//       console.log("Review response:", response.data);

//       if (response.data.success) {
//         setReviews([response.data.review, ...reviews]);
//         try {
//           const frameResponse = await axios.get(
//             `${API_URL}/frame/getbyid/${frameId}`
//           );
//           setFrame({
//             ...frameResponse.data.data,
//             colors: parseArray(frameResponse.data.data.colors),
//             careInstruction: parseArray(
//               frameResponse.data.data.careInstruction
//             ),
//             includes: parseArray(frameResponse.data.data.includes),
//           });
//         } catch (frameError) {
//           console.error("Error fetching updated frame:", frameError);
//           toast.error("Failed to update frame data.");
//         }
//         toast.success("Review submitted successfully!");
//         closeReviewModal();
//       }
//     } catch (error) {
//       console.error("Submit review error:", error.response?.data || error);
//       toast.error(error.response?.data?.message || "Failed to submit review.");
//     }
//   };

//   const parseArray = (str) => {
//     try {
//       return JSON.parse(str);
//     } catch (error) {
//       console.log(error);
//       return [];
//     }
//   };

//   useEffect(() => {
//     const fetchFrame = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/frame/getbyid/${frameId}`);
//         const frameData = response.data.data;

//         const parsedColors = parseArray(frameData.colors);
//         const parsedCareInstruction = parseArray(frameData.careInstruction);
//         const parsedIncludes = parseArray(frameData.includes);

//         setFrame({
//           ...frameData,
//           colors: parsedColors,
//           careInstruction: parsedCareInstruction,
//           includes: parsedIncludes,
//         });

//         // Set initial selections
//         if (frameData.frameSizes.length > 0) {
//           setSelectedSize(frameData.frameSizes[0]);
//           setBasePrice(
//             frameData.frameSizes[0].offer_price || frameData.frameSizes[0].price
//           );
//         }

//         if (parsedColors.length > 0) {
//           setSelectedFrame(parsedColors[0]);
//         }

//         if (frameData.images.length > 0) {
//           setSelectedImage(frameData.images[0].imageUrl);
//         }
//       } catch (error) {
//         console.error("Error fetching frame:", error);
//       }
//     };

//     const fetchReviews = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/review/getall/${frameId}`);
//         setReviews(response.data.reviews || []);
//       } catch (error) {
//         setReviews([]);
//         console.error("Error fetching reviews:", error);
//         toast.error("Failed to load reviews.");
//       }
//     };

//     const fetchBestSellingArtworks = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/frame/bestselling`);
//         setBestSellingArtworks(response.data.data);
//       } catch (error) {
//         console.error("Error fetching best-selling artworks:", error);
//       }
//     };

//     const checkPurchaseStatus = async () => {
//       if (!token) {
//         setHasPurchased(false);
//         setIsLoadingPurchaseCheck(false);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_URL}/order/hasPurchased/${frameId}`,
//           { userId },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         console.log("Purchase check:", response.data);

//         setHasPurchased(response.data.hasPurchased);
//       } catch (error) {
//         console.error("Error checking purchase status:", error);
//         setHasPurchased(false);
//       } finally {
//         setIsLoadingPurchaseCheck(false);
//       }
//     };

//     fetchFrame();
//     fetchReviews();
//     fetchBestSellingArtworks();
//     checkPurchaseStatus();
//   }, [frameId, token]);

//   useEffect(() => {
//     if (selectedSize) {
//       setOfferBasePrice(selectedSize.offer_price);
//       setBasePrice(selectedSize.price);
//       // Reset quantity if it exceeds remaining_qty
//       if (quantity > selectedSize.remained_qty) {
//         setQuantity(selectedSize.remained_qty || 1);
//         if (selectedSize.remained_qty > 0) {
//           toast.error(`Only ${selectedSize.remained_qty} units available`);
//         }
//       }
//     }
//   }, [selectedSize, quantity]);

//   const handleAddToCart = async () => {
//     try {
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       if (!selectedSize || !selectedFrame) {
//         toast.error("Please select size and frame color");
//         return;
//       }

//       if (selectedSize.remained_qty < quantity) {
//         toast.error(`Only ${selectedSize.remained_qty} units available`);
//         return;
//       }

//       const payload = {
//         userId: userData.userId,
//         frameSizeId: selectedSize.frameSizeId,
//         quantity: quantity,
//         color: selectedFrame,
//       };

//       const response = await axios.post(`${API_URL}/cart/addtocart`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         toast.success("Product added to cart!");
//         toggleCart();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to add to cart");
//       console.error("Add to cart error:", error);
//     }
//   };

//   // Handlers for View More/View Less
//   const handleViewMore = () => setShowAllReviews(true);
//   const handleViewLess = () => setShowAllReviews(false);

//   // Stock status component
//   const StockStatus = ({ remained_qty }) => {
//     if (remained_qty === 0) {
//       return (
//         <span className="flex items-center text-red-600 text-sm ml-2">
//           <XCircle className="w-3 h-3 mr-1" />
//           Out of Stock
//         </span>
//       );
//     }
//     if (remained_qty <= 5) {
//       return (
//         <span className="flex items-center text-yellow-600 text-sm ml-2">
//           <AlertTriangle className="w-4 h-4 mr-1" />
//           Low Stock: {remained_qty}
//         </span>
//       );
//     }
//     return (
//       <span className="flex items-center text-green-600 text-sm ml-2">
//         <CheckCircle className="w-4 h-4 mr-1" />
//         {remained_qty} available
//       </span>
//     );
//   };

//   return (
//     <>
//       {frame && (
//         <div
//           style={{ fontFamily: "Times New Roman" }}
//           className="max-w-7xl mx-auto px-4 py-8"
//         >
//           <div className="text-sm mb-8">
//             <span className="text-gray-800">
//               <Link to="/" className="hover:underline">
//                 Home
//               </Link>{" "}
//               / {frame?.name}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             <div className="space-y-6">
//               <div className="bg-white flex justify-center">
//                 <img
//                   src={`${API_URL}/${selectedImage}`}
//                   alt={frame.name}
//                   className="mx-auto cursor-pointer w-full"
//                 />
//               </div>
//               <div className="flex space-x-4 rounded-2xl justify-center">
//                 {frame.images.map((image, index) => (
//                   <div
//                     key={index}
//                     className="hover:border cursor-pointer w-24 h-24"
//                     onClick={() => setSelectedImage(image.imageUrl)}
//                   >
//                     <div className="bg-blue-50 h-full w-full flex items-center justify-center">
//                       <div className="bg-white p-1 w-full h-full flex items-center justify-center">
//                         <img
//                           src={`${API_URL}/${image.imageUrl}`}
//                           alt={`Thumbnail ${index + 1}`}
//                           className="object-contain"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div className="bg-green-500 text-white text-xs font-medium px-4 py-1 rounded-full inline-block uppercase tracking-wide">
//                 Best Selling
//               </div>
//               <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
//                 <h1 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-wide">
//                   {frame.name}
//                 </h1>
//                 <span className="text-gray-600 text-sm mt-1 sm:mt-0">
//                   {frame.averageRating.toFixed(1)} ({frame.totalRatings}{" "}
//                   reviews)
//                 </span>
//               </div>
//               <div className="flex flex-wrap items-center gap-2">
//                 <span className="text-xl font-normal">
//                   ₹{(basePrice * quantity).toFixed(2)}
//                 </span>
//                 {offerBasePrice && (
//                   <>
//                     <span className="text-sm text-gray-500 line-through">
//                       ₹{offerBasePrice}
//                     </span>
//                     <span className="text-sm text-green-600">
//                       ₹{(offerBasePrice - basePrice * quantity).toFixed(2)} (
//                       {Math.round(
//                         ((offerBasePrice - basePrice * quantity) /
//                           offerBasePrice) *
//                           100
//                       )}
//                       %)
//                     </span>
//                   </>
//                 )}
//               </div>
//               <div>
//                 <div className="flex items-center pb-2">
//                   <h2 className="text-base sm:text-lg font-semibold text-gray-900 uppercase tracking-wide ">
//                     Size
//                   </h2>
//                   {selectedSize && (
//                     <StockStatus
//                       remained_qty={selectedSize.remained_qty || 0}
//                     />
//                   )}
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   {frame.frameSizes.map((frameSize) => (
//                     <button
//                       key={frameSize.frameSizeId}
//                       type="button"
//                       onClick={() => setSelectedSize(frameSize)}
//                       className={`w-full px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors duration-200 cursor-pointer
//                         ${
//                           selectedSize?.frameSizeId === frameSize.frameSizeId
//                             ? "bg-black text-white"
//                             : frameSize.remained_qty === 0
//                             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                             : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
//                         }`}
//                       disabled={frameSize.remained_qty === 0}
//                     >
//                       {frameSize.size.height} x {frameSize.size.width} inches
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h2 className="text-lg font-normal text-gray-900 uppercase tracking-wide mb-3">
//                   Frame Color
//                 </h2>
//                 <div className="grid grid-cols-3 sm:gap-2 md:w-100 gap-2">
//                   {frame.colors?.map((color) => (
//                     <button
//                       key={color}
//                       type="button"
//                       className={`py-2 text-lg font-normal rounded focus:outline-none
//                         ${
//                           selectedFrame === color
//                             ? "bg-black text-white"
//                             : "bg-white text-gray-900 border border-gray-300 cursor-pointer"
//                         }`}
//                       onClick={() => setSelectedFrame(color)}
//                     >
//                       {color}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h2 className="text-lg font-normal text-gray-900 uppercase tracking-wide mb-3">
//                   Quantity
//                 </h2>
//                 <div className="flex">
//                   <button
//                     type="button"
//                     className="border border-black rounded-l p-2 w-12 flex items-center justify-center cursor-pointer"
//                     onClick={decrementQuantity}
//                     disabled={quantity <= 1}
//                   >
//                     <Minus className="h-4 w-4" />
//                   </button>
//                   <div className="border-t border-b border-black w-12 flex items-center justify-center">
//                     {quantity}
//                   </div>
//                   <button
//                     type="button"
//                     className="border border-black rounded-r p-2 w-12 flex items-center justify-center cursor-pointer"
//                     onClick={incrementQuantity}
//                     disabled={
//                       selectedSize && quantity >= selectedSize.remained_qty
//                     }
//                   >
//                     <Plus className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 onClick={handleAddToCart}
//                 className="w-full bg-black text-white py-3 px-6 rounded focus:outline-none hover:bg-gray-800 text-center cursor-pointer"
//               >
//                 Add to Cart
//               </button>
//               <div className="flex justify-between pt-4">
//                 <div className="flex items-center">
//                   <Truck className="h-10 w-10 mr-2" />
//                   <span
//                     style={{ fontFamily: "Times New Roman" }}
//                     className="text-xl"
//                   >
//                     Free Shipping
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <ShieldCheck className="h-10 w-10 mr-2" />
//                   <span className="text-xl">2-Year Warranty</span>
//                 </div>
//               </div>
//               <div className="flex flex-col sm:flex-row border border-gray-300 items-stretch sm:items-center p-2 sm:p-3 bg-gray-100 rounded-xl gap-2 sm:gap-3">
//                 {["Description", "Details", `Review (${reviews.length})`].map(
//                   (tab) => (
//                     <button
//                       key={tab}
//                       className={`w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 cursor-pointer
//                       ${
//                         activeTab === tab
//                           ? "bg-black text-white"
//                           : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
//                       }`}
//                       onClick={() => setActiveTab(tab)}
//                     >
//                       {tab}
//                     </button>
//                   )
//                 )}
//               </div>
//               <div className="bg-gray-50 rounded-lg overflow-hidden mt-8">
//                 <div className="p-8">
//                   {activeTab === "Description" && (
//                     <div className="space-y-8 text-gray-700 text-base leading-relaxed">
//                       <p>{frame.description}</p>
//                     </div>
//                   )}
//                   {activeTab === "Details" && (
//                     <div className="space-y-6 text-gray-700 text-base">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
//                         <div className="border border-gray-200 rounded-lg p-6">
//                           <h3 className="text-lg font-medium">Materials</h3>
//                           <p className="text-gray-500">
//                             {frame.material.materialName} with{" "}
//                             {frame.frameMaterial.materialName} frame
//                           </p>
//                         </div>
//                         <div className="border border-gray-200 rounded-lg p-6">
//                           <h3 className="text-lg font-medium">Dimensions</h3>
//                           <p className="text-gray-500">
//                             {frame.frameSizes
//                               .map(
//                                 (size) =>
//                                   `${size.size.width} x ${size.size.height} inch`
//                               )
//                               .join(", ")}
//                           </p>
//                         </div>

//                         <div className="border border-gray-200 rounded-lg p-6">
//                           <h3 className="text-lg font-medium">Weight</h3>
//                           <p className="text-gray-500">{frame.weight}</p>
//                         </div>
//                         <div className="border border-gray-200 rounded-lg p-6">
//                           <h3 className="text-lg font-medium">Origin</h3>
//                           <p className="text-gray-500">{frame.origin}</p>
//                         </div>
//                         <div className="border border-gray-200 rounded-lg p-6">
//                           <h3 className="text-lg font-medium">
//                             CARE INSTRUCTIONS
//                           </h3>
//                           <p className="text-gray-500">
//                             {frame.careInstruction.join(", ")}
//                           </p>
//                         </div>
//                         <div className="border border-gray-200 rounded-lg p-6">
//                           <h3 className="text-lg font-medium">Includes</h3>
//                           <p className="text-gray-500">
//                             {frame.includes.join(", ")}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {activeTab.startsWith("Review") && (
//                     <div className="space-y-8 text-gray-700 text-base">
//                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
//                         <h2 className="text-xl sm:text-xl font-semibold text-center sm:text-left">
//                           CUSTOMER REVIEWS
//                         </h2>
//                         {!isLoadingPurchaseCheck && (
//                           <button
//                             onClick={openReviewModal}
//                             className={`px-4 sm:px-6 py-2 sm:py-3 rounded transition-colors w-full sm:w-auto text-sm sm:text-base
//                               ${
//                                 hasPurchased
//                                   ? "bg-black text-white hover:bg-gray-800"
//                                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                               }`}
//                             disabled={!hasPurchased}
//                           >
//                             {hasPurchased
//                               ? "Write Review"
//                               : "Purchase Required"}
//                           </button>
//                         )}
//                       </div>
//                       <div className="space-y-8">
//                         {(showAllReviews ? reviews : reviews.slice(0, 2)).map(
//                           (review) => (
//                             <div
//                               key={review.ratingId}
//                               className="border-b border-gray-200 pb-8"
//                             >
//                               <div className="flex justify-between items-start">
//                                 <h3 className="text-sm font-semibold">
//                                   {review.title}
//                                 </h3>
//                                 <span className="text-sm font-medium">
//                                   {review.name}
//                                 </span>
//                               </div>
//                               <div className="flex my-2">
//                                 {[...Array(5)].map((_, i) => (
//                                   <Star
//                                     key={i}
//                                     className={`h-4 w-4 ${
//                                       i < review.rating
//                                         ? "fill-black text-black"
//                                         : "text-gray-300"
//                                     }`}
//                                   />
//                                 ))}
//                               </div>
//                               <p className="mt-2 text-gray-600">
//                                 {review.review}
//                               </p>
//                             </div>
//                           )
//                         )}
//                         {reviews.length === 0 && (
//                           <p>
//                             No reviews yet. Be the first to share your
//                             experience!
//                           </p>
//                         )}
//                         {reviews.length > 2 && (
//                           <div className="text-center">
//                             {!showAllReviews ? (
//                               <button
//                                 onClick={handleViewMore}
//                                 className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
//                               >
//                                 View More
//                               </button>
//                             ) : (
//                               <button
//                                 onClick={handleViewLess}
//                                 className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
//                               >
//                                 View Less
//                               </button>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {showReviewModal && (
//             <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
//               <div className="border bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                 <div className="flex justify-between items-center p-6 border-b">
//                   <h2 className="text-2xl font-semibold">Write a Review</h2>
//                   <button
//                     onClick={closeReviewModal}
//                     className="text-gray-500 hover:text-black"
//                   >
//                     <X className="h-6 w-6" />
//                     <span className="sr-only">Close</span>
//                   </button>
//                 </div>
//                 <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
//                   <div>
//                     <label className="block text-lg font-medium mb-2">
//                       Rating
//                     </label>
//                     <div className="flex space-x-2">
//                       {[1, 2, 3, 4, 5].map((rating) => (
//                         <button
//                           key={rating}
//                           type="button"
//                           onClick={() => setReviewRating(rating)}
//                           className="focus:outline-none"
//                         >
//                           <Star
//                             className={`h-8 w-8 ${
//                               rating <= reviewRating
//                                 ? "fill-black text-black"
//                                 : "text-gray-300"
//                             }`}
//                           />
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="review-title"
//                       className="block text-lg font-medium mb-2"
//                     >
//                       Review Title
//                     </label>
//                     <input
//                       type="text"
//                       id="review-title"
//                       value={reviewTitle}
//                       onChange={(e) => setReviewTitle(e.target.value)}
//                       className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-black"
//                       placeholder="Summarize your experience"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="review-content"
//                       className="block text-lg font-medium mb-2"
//                     >
//                       Review
//                     </label>
//                     <textarea
//                       id="review-content"
//                       value={reviewContent}
//                       onChange={(e) => setReviewContent(e.target.value)}
//                       className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-black min-h-[150px]"
//                       placeholder="Share your experience with this product"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="review-name"
//                       className="block text-lg font-medium mb-2"
//                     >
//                       Your Name
//                     </label>
//                     <input
//                       type="text"
//                       id="review-name"
//                       value={reviewName}
//                       onChange={(e) => setReviewName(e.target.value)}
//                       className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-black"
//                       placeholder="Your name"
//                       required
//                     />
//                   </div>
//                   <div className="flex justify-end">
//                     <button
//                       type="submit"
//                       className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
//                     >
//                       Submit Review
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           <div
//             style={{ fontFamily: "Times New Roman" }}
//             className="container mx-auto px-4 py-16"
//           >
//             <div className="text-center mb-6 sm:mb-8">
//               <h2 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-wider">
//                 YOU MAY ALSO LIKE
//               </h2>
//               <p className="text-xs sm:text-sm mt-2">
//                 Discover our featured art collection.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {bestSellingArtworks.map((artwork) => (
//                 <div
//                   key={artwork.frameId}
//                   className="relative rounded-lg overflow-hidden group cursor-pointer"
//                 >
//                   <div className="aspect-square relative">
//                     <img
//                       src={`${API_URL}/${artwork.images[0]?.imageUrl}`}
//                       alt={artwork.name}
//                       className="object-cover w-full h-full"
//                     />
//                     <div className="absolute top-4 right-4 flex flex-col gap-2 sm:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
//                       <Link to={`/product/${artwork.frameId}`}>
//                         <button
//                           className="bg-black text-white p-2 rounded-full hover:bg-gray-800 cursor-pointer"
//                           onClick={toggleCart}
//                         >
//                           <ShoppingBag size={18} />
//                         </button>
//                       </Link>
//                     </div>
//                     <div
//                       className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white 
//                         sm:translate-y-0 
//                         md:transform md:translate-y-full md:group-hover:translate-y-0 
//                         transition-transform duration-300 ease-in-out"
//                     >
//                       <h3 className="font-medium text-lg">{artwork.name}</h3>
//                       <p className="text-xs">
//                         {artwork.description.length > 100
//                           ? `${artwork.description.slice(0, 20)}...`
//                           : artwork.description}
//                       </p>
//                       <p className="mt-2 font-semibold">
//                         ₹{artwork.frameSizes[0]?.price}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//       {isCartOpen && <Cart toggleCart={toggleCart} />}
//     </>
//   );
// }

import { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Star,
  X,
  ShoppingBag,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cart from "./Cart";
import axios from "axios";
import { API_URL, userToken } from "./Variable";
import toast from "react-hot-toast";
import Login from "./Login";
import Signup from "./Signup";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [activeTab, setActiveTab] = useState("Description");
  const [showSpecDetails, setShowSpecDetails] = useState(false);
  const [activeSpec, setActiveSpec] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoadingPurchaseCheck, setIsLoadingPurchaseCheck] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [bestSellingArtworks, setBestSellingArtworks] = useState([]);
  const [basePrice, setBasePrice] = useState(0);
  const [offerBasePrice, setOfferBasePrice] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [frame, setFrame] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // State for login popup
  const [showSignup, setShowSignup] = useState(false); // State for signup popup
  const [pendingCartItem, setPendingCartItem] = useState(null); // Store item to add after login

  const { frameId } = useParams();
  const navigate = useNavigate();
  const userData = userToken();
  const userId = userData?.userId;
  const token = userData?.token;

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

  const incrementQuantity = () => {
    if (selectedSize && quantity >= selectedSize.remained_qty) {
      toast.error(`Only ${selectedSize.remained_qty} units available`);
      return;
    }
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleSpecClick = (spec) => {
    if (activeSpec === spec) {
      setActiveSpec("");
      setShowSpecDetails(false);
    } else {
      setActiveSpec(spec);
      setShowSpecDetails(true);
    }
  };

  const openReviewModal = async () => {
    if (!token) {
      toast.error("Please log in to write a review");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/order/hasPurchased/${frameId}`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Purchase check response:", response.data);

      if (response.data.hasPurchased) {
        setShowReviewModal(true);
      } else {
        toast.error("You can only review products you have purchased.");
      }
    } catch (error) {
      console.error("Error checking purchase status:", error);
      toast.error("Failed to verify purchase status. Please try again.");
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewRating(5);
    setReviewTitle("");
    setReviewContent("");
    setReviewName("");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        frameId: parseInt(frameId),
        userId: userData?.userId,
        name: reviewName,
        title: reviewTitle,
        review: reviewContent,
        rating: reviewRating,
      };

      console.log("Submitting review:", payload);

      const response = await axios.post(`${API_URL}/review/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: (status) => status >= 200 && status < 300,
      });

      console.log("Review response:", response.data);

      if (response.data.success) {
        setReviews([response.data.review, ...reviews]);
        try {
          const frameResponse = await axios.get(
            `${API_URL}/frame/getbyid/${frameId}`
          );
          setFrame({
            ...frameResponse.data.data,
            colors: parseArray(frameResponse.data.data.colors),
            careInstruction: parseArray(
              frameResponse.data.data.careInstruction
            ),
            includes: parseArray(frameResponse.data.data.includes),
          });
        } catch (frameError) {
          console.error("Error fetching updated frame:", frameError);
          toast.error("Failed to update frame data.");
        }
        toast.success("Review submitted successfully!");
        closeReviewModal();
      }
    } catch (error) {
      console.error("Submit review error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to submit review.");
    }
  };

  const parseArray = (str) => {
    try {
      return JSON.parse(str);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchFrame = async () => {
      try {
        const response = await axios.get(`${API_URL}/frame/getbyid/${frameId}`);
        const frameData = response.data.data;

        const parsedColors = parseArray(frameData.colors);
        const parsedCareInstruction = parseArray(frameData.careInstruction);
        const parsedIncludes = parseArray(frameData.includes);

        setFrame({
          ...frameData,
          colors: parsedColors,
          careInstruction: parsedCareInstruction,
          includes: parsedIncludes,
        });

        // Set initial selections
        if (frameData.frameSizes.length > 0) {
          setSelectedSize(frameData.frameSizes[0]);
          setBasePrice(
            frameData.frameSizes[0].offer_price || frameData.frameSizes[0].price
          );
        }

        if (parsedColors.length > 0) {
          setSelectedFrame(parsedColors[0]);
        }

        if (frameData.images.length > 0) {
          setSelectedImage(frameData.images[0].imageUrl);
        }
      } catch (error) {
        console.error("Error fetching frame:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/review/getall/${frameId}`);
        setReviews(response.data.reviews || []);
      } catch (error) {
        setReviews([]);
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews.");
      }
    };

    const fetchBestSellingArtworks = async () => {
      try {
        const response = await axios.get(`${API_URL}/frame/bestselling`);
        setBestSellingArtworks(response.data.data);
      } catch (error) {
        console.error("Error fetching best-selling artworks:", error);
      }
    };

    const checkPurchaseStatus = async () => {
      if (!token) {
        setHasPurchased(false);
        setIsLoadingPurchaseCheck(false);
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/order/hasPurchased/${frameId}`,
          { userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Purchase check:", response.data);

        setHasPurchased(response.data.hasPurchased);
      } catch (error) {
        console.error("Error checking purchase status:", error);
        setHasPurchased(false);
      } finally {
        setIsLoadingPurchaseCheck(false);
      }
    };

    fetchFrame();
    fetchReviews();
    fetchBestSellingArtworks();
    checkPurchaseStatus();
  }, [frameId, token]);

  useEffect(() => {
    if (selectedSize) {
      setOfferBasePrice(selectedSize.offer_price);
      setBasePrice(selectedSize.price);
      // Reset quantity if it exceeds remaining_qty
      if (quantity > selectedSize.remained_qty) {
        setQuantity(selectedSize.remained_qty || 1);
        if (selectedSize.remained_qty > 0) {
          toast.error(`Only ${selectedSize.remained_qty} units available`);
        }
      }
    }
  }, [selectedSize, quantity]);

  const handleAddToCart = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      if (!selectedSize || !selectedFrame) {
        toast.error("Please select size and frame color");
        return;
      }

      if (selectedSize.remained_qty < quantity) {
        toast.error(`Only ${selectedSize.remained_qty} units available`);
        return;
      }

      const payload = {
        userId: userData.userId,
        frameSizeId: selectedSize.frameSizeId,
        quantity: quantity,
        color: selectedFrame,
      };

      const response = await axios.post(`${API_URL}/cart/addtocart`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Product added to cart!");
        toggleCart();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
      console.error("Add to cart error:", error);
    }
  };

  const handleAddToCartBestSelling = async (artwork, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please log in to add to cart");
      setShowLogin(true); // Show login popup
      setPendingCartItem(artwork); // Store the item to add after login
      return;
    }

    try {
      const frameSizeId = artwork.frameSizes[0]?.frameSizeId;
      const color = artwork.colors[0] || "Black";

      if (!frameSizeId) {
        toast.error("Product size not available");
        return;
      }

      const payload = {
        userId: userData.userId,
        frameSizeId,
        quantity: 1,
        color,
      };

      const response = await axios.post(`${API_URL}/cart/addtocart`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Product added to cart!");
        toggleCart();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
      console.error("Add to cart error:", error);
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

        const payload = {
          userId: userData.userId,
          frameSizeId,
          quantity: 1,
          color,
        };

        const response = await axios.post(`${API_URL}/cart/addtocart`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          toast.success("Product added to cart!");
          toggleCart();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add to cart");
        console.error("Add to cart error:", error);
      }
      setPendingCartItem(null); // Clear pending item
    }
  };

  // Handlers for View More/View Less
  const handleViewMore = () => setShowAllReviews(true);
  const handleViewLess = () => setShowAllReviews(false);

  // Stock status component
  const StockStatus = ({ remained_qty }) => {
    if (remained_qty === 0) {
      return (
        <span className="flex items-center text-red-600 text-sm ml-2">
          <XCircle className="w-3 h-3 mr-1" />
          Out of Stock
        </span>
      );
    }
    if (remained_qty <= 5) {
      return (
        <span className="flex items-center text-yellow-600 text-sm ml-2">
          <AlertTriangle className="w-4 h-4 mr-1" />
          Low Stock: {remained_qty}
        </span>
      );
    }
    return (
      <span className="flex items-center text-green-600 text-sm ml-2">
        <CheckCircle className="w-4 h-4 mr-1" />
        {remained_qty} available
      </span>
    );
  };

  return (
    <>
      {frame && (
        <div
          style={{ fontFamily: "Times New Roman" }}
          className="max-w-7xl mx-auto px-4 py-8"
        >
          <div className="text-sm mb-8">
            <span className="text-gray-800">
              <Link to="/" className="hover:underline">
                Home
              </Link>{" "}
              / {frame?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-white flex justify-center">
                <img
                  src={`${API_URL}/${selectedImage}`}
                  alt={frame.name}
                  className="mx-auto cursor-pointer w-full"
                />
              </div>
              <div className="flex space-x-4 rounded-2xl justify-center">
                {frame.images.map((image, index) => (
                  <div
                    key={index}
                    className="hover:border cursor-pointer w-24 h-24"
                    onClick={() => setSelectedImage(image.imageUrl)}
                  >
                    <div className="bg-blue-50 h-full w-full flex items-center justify-center">
                      <div className="bg-white p-1 w-full h-full flex items-center justify-center">
                        <img
                          src={`${API_URL}/${image.imageUrl}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-500 text-white text-xs font-medium px-4 py-1 rounded-full inline-block uppercase tracking-wide">
                Best Selling
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <h1 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-wide">
                  {frame.name}
                </h1>
                <span className="text-gray-600 text-sm mt-1 sm:mt-0">
                  {frame.averageRating.toFixed(1)} ({frame.totalRatings}{" "}
                  reviews)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-normal">
                  ₹{(basePrice * quantity).toFixed(2)}
                </span>
                {offerBasePrice && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{offerBasePrice}
                    </span>
                    <span className="text-sm text-green-600">
                      ₹{(offerBasePrice - basePrice * quantity).toFixed(2)} (
                      {Math.round(
                        ((offerBasePrice - basePrice * quantity) /
                          offerBasePrice) *
                          100
                      )}
                      %)
                    </span>
                  </>
                )}
              </div>
              <div>
                <div className="flex items-center pb-2">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 uppercase tracking-wide ">
                    Size
                  </h2>
                  {selectedSize && (
                    <StockStatus
                      remained_qty={selectedSize.remained_qty || 0}
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {frame.frameSizes.map((frameSize) => (
                    <button
                      key={frameSize.frameSizeId}
                      type="button"
                      onClick={() => setSelectedSize(frameSize)}
                      className={`w-full px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors duration-200 cursor-pointer
                        ${
                          selectedSize?.frameSizeId === frameSize.frameSizeId
                            ? "bg-black text-white"
                            : frameSize.remained_qty === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
                        }`}
                      disabled={frameSize.remained_qty === 0}
                    >
                      {frameSize.size.height} x {frameSize.size.width} inches
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-normal text-gray-900 uppercase tracking-wide mb-3">
                  Frame Color
                </h2>
                <div className="grid grid-cols-3 sm:gap-2 md:w-100 gap-2">
                  {frame.colors?.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`py-2 text-lg font-normal rounded focus:outline-none
                        ${
                          selectedFrame === color
                            ? "bg-black text-white"
                            : "bg-white text-gray-900 border border-gray-300 cursor-pointer"
                        }`}
                      onClick={() => setSelectedFrame(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-normal text-gray-900 uppercase tracking-wide mb-3">
                  Quantity
                </h2>
                <div className="flex">
                  <button
                    type="button"
                    className="border border-black rounded-l p-2 w-12 flex items-center justify-center cursor-pointer"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="border-t border-b border-black w-12 flex items-center justify-center">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    className="border border-black rounded-r p-2 w-12 flex items-center justify-center cursor-pointer"
                    onClick={incrementQuantity}
                    disabled={
                      selectedSize && quantity >= selectedSize.remained_qty
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 px-6 rounded focus:outline-none hover:bg-gray-800 text-center cursor-pointer"
              >
                Add to Cart
              </button>
              <div className="flex justify-between pt-4">
                <div className="flex items-center">
                  <Truck className="h-10 w-10 mr-2" />
                  <span
                    style={{ fontFamily: "Times New Roman" }}
                    className="text-xl"
                  >
                    Free Shipping
                  </span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="h-10 w-10 mr-2" />
                  <span className="text-xl">2-Year Warranty</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row border border-gray-300 items-stretch sm:items-center p-2 sm:p-3 bg-gray-100 rounded-xl gap-2 sm:gap-3">
                {["Description", "Details", `Review (${reviews.length})`].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={`w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 cursor-pointer
                      ${
                        activeTab === tab
                          ? "bg-black text-white"
                          : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
              <div className="bg-gray-50 rounded-lg overflow-hidden mt-8">
                <div className="p-8">
                  {activeTab === "Description" && (
                    <div className="space-y-8 text-gray-700 text-base leading-relaxed">
                      <p>{frame.description}</p>
                    </div>
                  )}
                  {activeTab === "Details" && (
                    <div className="space-y-6 text-gray-700 text-base">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-medium">Materials</h3>
                          <p className="text-gray-500">
                            {frame.material.materialName} with{" "}
                            {frame.frameMaterial.materialName} frame
                          </p>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-medium">Dimensions</h3>
                          <p className="text-gray-500">
                            {frame.frameSizes
                              .map(
                                (size) =>
                                  `${size.size.width} x ${size.size.height} inch`
                              )
                              .join(", ")}
                          </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-medium">Weight</h3>
                          <p className="text-gray-500">{frame.weight}</p>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-medium">Origin</h3>
                          <p className="text-gray-500">{frame.origin}</p>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-medium">
                            CARE INSTRUCTIONS
                          </h3>
                          <p className="text-gray-500">
                            {frame.careInstruction.join(", ")}
                          </p>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-medium">Includes</h3>
                          <p className="text-gray-500">
                            {frame.includes.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab.startsWith("Review") && (
                    <div className="space-y-8 text-gray-700 text-base">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
                        <h2 className="text-xl sm:text-xl font-semibold text-center sm:text-left">
                          CUSTOMER REVIEWS
                        </h2>
                        {!isLoadingPurchaseCheck && (
                          <button
                            onClick={openReviewModal}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded transition-colors w-full sm:w-auto text-sm sm:text-base
                              ${
                                hasPurchased
                                  ? "bg-black text-white hover:bg-gray-800"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            disabled={!hasPurchased}
                          >
                            {hasPurchased
                              ? "Write Review"
                              : "Purchase Required"}
                          </button>
                        )}
                      </div>
                      <div className="space-y-8">
                        {(showAllReviews ? reviews : reviews.slice(0, 2)).map(
                          (review) => (
                            <div
                              key={review.ratingId}
                              className="border-b border-gray-200 pb-8"
                            >
                              <div className="flex justify-between items-start">
                                <h3 className="text-sm font-semibold">
                                  {review.title}
                                </h3>
                                <span className="text-sm font-medium">
                                  {review.name}
                                </span>
                              </div>
                              <div className="flex my-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-black text-black"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="mt-2 text-gray-600">
                                {review.review}
                              </p>
                            </div>
                          )
                        )}
                        {reviews.length === 0 && (
                          <p>
                            No reviews yet. Be the first to share your
                            experience!
                          </p>
                        )}
                        {reviews.length > 2 && (
                          <div className="text-center">
                            {!showAllReviews ? (
                              <button
                                onClick={handleViewMore}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                              >
                                View More
                              </button>
                            ) : (
                              <button
                                onClick={handleViewLess}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                              >
                                View Less
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showReviewModal && (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="border bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-2xl font-semibold">Write a Review</h2>
                  <button
                    onClick={closeReviewModal}
                    className="text-gray-500 hover:text-black"
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </button>
                </div>
                <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                  <div>
                    <label className="block text-lg font-medium mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setReviewRating(rating)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              rating <= reviewRating
                                ? "fill-black text-black"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="review-title"
                      className="block text-lg font-medium mb-2"
                    >
                      Review Title
                    </label>
                    <input
                      type="text"
                      id="review-title"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Summarize your experience"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="review-content"
                      className="block text-lg font-medium mb-2"
                    >
                      Review
                    </label>
                    <textarea
                      id="review-content"
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-black min-h-[150px]"
                      placeholder="Share your experience with this product"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="review-name"
                      className="block text-lg font-medium mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="review-name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div
            style={{ fontFamily: "Times New Roman" }}
            className="container mx-auto px-4 py-16"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-wider">
                YOU MAY ALSO LIKE
              </h2>
              <p className="text-xs sm:text-sm mt-2">
                Discover our featured art collection.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestSellingArtworks.map((artwork) => (
                <div
                  key={artwork.frameId}
                  className="relative rounded-lg overflow-hidden group cursor-pointer"
                >
                  <div className="aspect-square relative">
                    <img
                      src={`${API_URL}/${artwork.images[0]?.imageUrl}`}
                      alt={artwork.name}
                      className="object-cover w-full h-full"
                      onClick={() => navigate(`/Singleproduct/${artwork.frameId}`)}
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 sm:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        className="bg-black text-white p-2 rounded-full hover:bg-gray-800 cursor-pointer"
                        onClick={(e) => handleAddToCartBestSelling(artwork, e)}
                        title="Add to Cart"
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white 
                        sm:translate-y-0 
                        md:transform md:translate-y-full md:group-hover:translate-y-0 
                        transition-transform duration-300 ease-in-out"
                    >
                      <h3 className="font-medium text-lg">{artwork.name}</h3>
                      <p className="text-xs">
                        {artwork.description.length > 100
                          ? `${artwork.description.slice(0, 20)}...`
                          : artwork.description}
                      </p>
                      <p className="mt-2 font-semibold">
                        ₹{artwork.frameSizes[0]?.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
        </div>
      )}
      {isCartOpen && <Cart toggleCart={toggleCart} />}
    </>
  );
}