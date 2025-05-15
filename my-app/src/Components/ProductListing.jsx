// // //--------------new update----------------

// // import { ShoppingBag } from "lucide-react";
// // import { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import Cart from "./Cart";
// // import { IoFilterSharp } from "react-icons/io5";
// // import { API_URL, userToken } from "./Variable";
// // import axios from "axios";
// // import toast from "react-hot-toast";

// // const frameShapes = [
// //   { id: 1, name: "Four Corner Round" },
// //   { id: 2, name: "Square" },
// //   { id: 3, name: "Rectangle" },
// //   { id: 4, name: "Oval" },
// //   { id: 5, name: "Round" },
// //   { id: 6, name: "Top Round" },
// //   { id: 7, name: "Bottom Round" }, // सातवां शेप
// // ];
// // // Custom hook to detect mobile view
// // function useIsMobile(breakpoint = 768) {
// //   const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
// //   useEffect(() => {
// //     const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, [breakpoint]);
// //   return isMobile;
// // }

// // export default function ProductListing() {
// //   const navigate = useNavigate();
// //   const [productList, setProductList] = useState([]);
// //   const [priceRange, setPriceRange] = useState(2400);
// //   const [selectedCategories, setSelectedCategories] = useState([]);
// //   const [selectedMaterials, setSelectedMaterials] = useState([]);
// //   const [selectedSizes, setSelectedSizes] = useState([]);
// //   const [selectedframe, setSelectedframe] = useState([]);
// //   const [filteredProducts, setFilteredProducts] = useState([]);
// //   const [isFilterOpen, setIsFilterOpen] = useState(false);
// //   const [isCartOpen, setIsCartOpen] = useState(false);
// //   const [materials, setMaterials] = useState([]);
// //   const [frameMaterial, setFrameMaterial] = useState([]);
// //   const [sizes, setSizes] = useState([]);
// //   const [frames, setFrames] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [itemsPerPage] = useState(12);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [cartItems, setCartItems] = useState([]);
// //   const userData = userToken();
// //   const token = userData?.token;

// //   const isMobile = useIsMobile();

// //   useEffect(() => {
// //     const fetchDropdownData = async () => {
// //       try {
// //         const materialsRes = await axios.get(
// //           `${API_URL}/material/getallmaterial`
// //         );
// //         setMaterials(materialsRes.data || []);

// //         const frameMatRes = await axios.get(
// //           `${API_URL}/framematerial/getallframemat`
// //         );
// //         setFrameMaterial(frameMatRes.data || []);

// //         const sizesRes = await axios.get(`${API_URL}/size/getallsize`);
// //         setSizes(sizesRes.data.sizes || []);
// //       } catch (error) {
// //         console.error("Error fetching dropdown data:", error);
// //         toast.error("Failed to load dropdown options");
// //       }
// //     };

// //     fetchDropdownData();
// //   }, []);

// //   const fetchFrames = async (page = 1) => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API_URL}/frame/getallframes`, {
// //         params: {
// //           page,
// //           limit: itemsPerPage,
// //           search: searchTerm,
// //         },
// //       });
// //       console.log("response", response.data.data);

// //       setFrames(response.data.data || []);
// //       setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
// //       setCurrentPage(page);
// //     } catch (error) {
// //       console.error("Error fetching frames:", error);
// //       toast.error("Failed to fetch frames");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchFrames();
// //   }, []);

// //   const handleAddToCart = async (frame) => {
// //     try {
// //       if (!token) {
// //         navigate("/login");
// //         return;
// //       }
// //       if (!frame.frameSizes || frame.frameSizes.length === 0) {
// //         toast.error("No available sizes for this product");
// //         return;
// //       }
// //       const frameSizeId = frame.frameSizes[0].frameSizeId;
// //       const response = await axios.post(
// //         `${API_URL}/cart/addtocart`,
// //         { userId: userData?.userId, frameSizeId, quantity: 1 },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       if (response.data.success) {
// //         toast.success("Added to cart successfully!");
// //         // Update cart items state
// //         setCartItems([...cartItems, response.data.data]);
// //         // toggleCart();
// //       }
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || "Failed to add to cart");
// //       console.log(error);
// //     }
// //   };

// //   const handleCategoryChange = (category) => {
// //     setSelectedCategories((prev) =>
// //       prev.includes(category)
// //         ? prev.filter((c) => c !== category)
// //         : [...prev, category]
// //     );
// //   };

// //   const handleMaterialChange = (material) => {
// //     setSelectedMaterials((prev) =>
// //       prev.includes(material)
// //         ? prev.filter((m) => m !== material)
// //         : [...prev, material]
// //     );
// //   };

// //   const handleSizeChange = (size) => {
// //     if (size === "All Sizes") {
// //       setSelectedSizes((prev) =>
// //         prev.includes("All Sizes") ? [] : ["All Sizes"]
// //       );
// //       return;
// //     }
// //     setSelectedSizes((prev) => {
// //       const newSizes = prev.filter((s) => s !== "All Sizes");
// //       return newSizes.includes(size)
// //         ? newSizes.filter((s) => s !== size)
// //         : [...newSizes, size];
// //     });
// //   };

// //   const handleFrameChange = (frameType) => {
// //     setSelectedframe((prev) =>
// //       prev.includes(frameType)
// //         ? prev.filter((f) => f !== frameType)
// //         : [...prev, frameType]
// //     );
// //   };

// //   const toggleFilter = () => {
// //     setIsFilterOpen((prev) => !prev);
// //   };

// //   const toggleCart = () => {
// //     setIsCartOpen(!isCartOpen);
// //   };

// //   useEffect(() => {
// //     let result = frames;
// //     result = result.filter((frame) => frame.price <= priceRange);
// //     if (selectedCategories.length > 0) {
// //       result = result.filter((frame) =>
// //         selectedCategories.includes(frame.category)
// //       );
// //     }
// //     if (selectedMaterials.length > 0) {
// //       result = result.filter((frame) =>
// //         selectedMaterials.includes(frame.materialId)
// //       );
// //     }
// //     if (selectedSizes.length > 0 && !selectedSizes.includes("All Sizes")) {
// //       result = result.filter((frame) => selectedSizes.includes(frame.size));
// //     }
// //     if (selectedframe.length > 0) {
// //       result = result.filter((frame) => selectedframe.includes(frame.frame));
// //     }
// //     setFilteredProducts(result);
// //   }, [
// //     priceRange,
// //     selectedCategories,
// //     selectedMaterials,
// //     selectedSizes,
// //     selectedframe,
// //   ]);

// //   const renderProductCard = (frame) => (
// //     <div
// //       key={frame.frameId}
// //       className="group max-w-7xl mx-auto"
// //       style={{ fontFamily: "Times New Roman" }}
// //     >
// //       <div className="relative mb-3 overflow-hidden bg-gray-100">
// //         <img
// //           src={`${API_URL}/${frame.images[0].imageUrl}`}
// //           alt={frame.name}
// //           className="w-full h-full object-cover"
// //           onClick={() => navigate(`/Singleproduct/${frame.frameId}`)}
// //         />
// //         <div
// //           className="absolute top-3 right-3 flex flex-col gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
// //           onClick={toggleCart}
// //         >
// //           <button
// //             className="bg-black text-white p-2 rounded-full cursor-pointer"
// //             onClick={() => handleAddToCart(frame)}
// //           >
// //             <ShoppingBag size={20} />
// //           </button>
// //         </div>
// //       </div>
// //       <div>
// //         <h3 className="text-lg font-medium uppercase mb-1">{frame.name}</h3>
// //         <p className="text-sm text-gray-600 mb-2">
// //           {frame.description
// //             ? frame.description.split(" ").slice(0, 6).join(" ") +
// //               (frame.description.split(" ").length > 10 ? "..." : "")
// //             : ""}
// //         </p>
// //         <p className="font-medium">
// //           ₹{frame.price && !isNaN(frame.price) ? frame.price.toFixed(2) : "N/A"}
// //         </p>
// //       </div>
// //     </div>
// //   );

// //   // Filter Sidebar JSX (for reuse)
// //   const filterSidebar = (
// //     <div
// //       className="border border-gray-200 rounded-lg p-6 h-full overflow-y-auto bg-white"
// //       style={{ fontFamily: "Times New Roman" }}
// //     >
// //       {/* Size Filter */}
// //       <div className="mb-6">
// //         <h3 className="text-lg font-medium uppercase mb-4">Size</h3>
// //         <div className="space-y-2">
// //           {sizes.map((size) => (
// //             <label key={size.sizeId} className="flex items-center">
// //               <input
// //                 type="checkbox"
// //                 className="w-4 h-4 mr-2 border-gray-300 rounded"
// //                 checked={selectedCategories.includes(size.sizeId)}
// //                 onChange={() => handleCategoryChange(size.sizeId)}
// //               />
// //               <span className="text-gray-600">
// //                 {size.width} x {size.height}
// //               </span>
// //             </label>
// //           ))}
// //         </div>
// //       </div>
// //       {/* Material Filter */}
// //       <div className="mb-6">
// //         <h3 className="text-lg font-medium uppercase mb-4">Product Material</h3>
// //         <div className="space-y-2">
// //           {materials.map((material) => (
// //             <label key={material.materialId} className="flex items-center">
// //               <input
// //                 type="checkbox"
// //                 className="w-4 h-4 mr-2 border-gray-300 rounded"
// //                 checked={selectedMaterials.includes(material.materialId)}
// //                 onChange={() => handleMaterialChange(material.materialId)}
// //               />
// //               <span className="text-gray-600">{material.materialName}</span>
// //             </label>
// //           ))}
// //         </div>
// //       </div>
// //       {/* Frame Shape Filter */}
// //       <div className="mb-6">
// //         <h3 className="text-lg font-medium uppercase mb-4">Frame Shape</h3>
// //         <div className="space-y-2">
// //           {frameShapes.map((shape) => (
// //             <label key={shape.id} className="flex items-center">
// //               <input
// //                 type="checkbox"
// //                 className="w-4 h-4 mr-2 border-gray-300 rounded"
// //                 checked={selectedSizes.includes(shape.name)}
// //                 onChange={() => handleSizeChange(shape.name)}
// //               />
// //               <span className="text-gray-600">{shape.name}</span>
// //             </label>
// //           ))}
// //         </div>
// //       </div>
// //       {/* Frame Material Filter */}
// //       <div className="mb-6">
// //         <h3 className="text-lg font-medium uppercase mb-4">Frame Material</h3>
// //         <div className="space-y-2">
// //           {frameMaterial.map((mat) => (
// //             <label key={mat.frameMaterialId} className="flex items-center">
// //               <input
// //                 type="checkbox"
// //                 className="w-4 h-4 mr-2 border-gray-300 rounded"
// //                 checked={selectedframe.includes(mat.frameMaterialId)}
// //                 onChange={() => handleFrameChange(mat.frameMaterialId)}
// //               />
// //               <span className="text-gray-600">{mat.materialName}</span>
// //             </label>
// //           ))}
// //         </div>
// //       </div>
// //       {/* Price Filter */}
// //       <div>
// //         <h3 className="text-lg font-medium uppercase mb-4">Price</h3>
// //         <div className="space-y-4">
// //           <input
// //             type="range"
// //             min="200"
// //             max="2400"
// //             step="100"
// //             value={priceRange}
// //             onChange={(e) => setPriceRange(Number(e.target.value))}
// //             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
// //           />
// //           <div className="flex justify-between">
// //             <span className="text-gray-600">₹0</span>
// //             <span className="text-gray-600">₹{priceRange}</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <>
// //       <div className="max-w-7xl mx-auto px-4 py-8">
// //         <div className="mb-6 text-sm">
// //           <Link to="/">
// //             <span
// //               style={{ fontFamily: "Times New Roman" }}
// //               className="text-gray-800 hover:underline"
// //             >
// //               Home
// //             </span>
// //           </Link>{" "}
// //           /{" "}
// //           <span
// //             style={{ fontFamily: "Times New Roman" }}
// //             className="text-gray-800 hover:underline"
// //           >
// //             Product
// //           </span>
// //         </div>

// //         {/* Filter Button for Mobile */}
// //         {isMobile && (
// //           <div className="mb-4">
// //             <IoFilterSharp
// //               onClick={toggleFilter}
// //               className="w-auto h-[30px] cursor-pointer"
// //               style={{ fontFamily: "Times New Roman" }}
// //             />
// //           </div>
// //         )}

// //         {/* Overlay for mobile filter */}
// //         {isMobile && isFilterOpen && (
// //           <div className="fixed inset-0 z-40" onClick={toggleFilter} />
// //         )}

// //         <div className="flex flex-col md:flex-row gap-8">
// //           {/* Sidebar */}
// //           {/* Desktop: always visible; Mobile: slide in from left */}
// //           {isMobile ? (
// //             <div
// //               className={`fixed top-0 left-0 h-full w-3/4 max-w-xs z-50 bg-white shadow-lg transition-transform duration-300 ${
// //                 isFilterOpen ? "translate-x-0" : "-translate-x-full"
// //               }`}
// //               style={{ fontFamily: "Times New Roman" }}
// //             >
// //               <button
// //                 className="absolute top-4 right-4 text-2xl"
// //                 onClick={toggleFilter}
// //                 aria-label="Close Filter"
// //               >
// //                 &times;
// //               </button>
// //               {filterSidebar}
// //             </div>
// //           ) : (
// //             <div className="w-72 shrink-0 block">{filterSidebar}</div>
// //           )}

// //           {/* Product Grid */}
// //           <div className="flex-1">
// //             {frames.length === 0 ? (
// //               <div className="text-center py-8">
// //                 <p className="text-lg text-gray-600">
// //                   No products match your filters.
// //                 </p>
// //                 <button
// //                   className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md"
// //                   onClick={() => {
// //                     setPriceRange(2400);
// //                     setSelectedCategories([]);
// //                     setSelectedMaterials([]);
// //                     setSelectedSizes([]);
// //                     setSelectedframe([]);
// //                   }}
// //                 >
// //                   Clear All Filters
// //                 </button>
// //               </div>
// //             ) : (
// //               <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                 {frames.map((frame) => renderProductCard(frame))}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* {isCartOpen && <Cart toggleCart={toggleCart} items={cartItems} />} */}
// //     </>
// //   );
// // }

import { ShoppingBag } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Cart from "./Cart";
import { IoFilterSharp } from "react-icons/io5";
import { API_URL, userToken } from "./Variable";
import axios from "axios";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import Login from "./Login";
import Signup from "./Signup";

const frameShapes = [
  { id: 1, name: "Four Corner Round" },
  { id: 2, name: "Square" },
  { id: 3, name: "Rectangle" },
  { id: 4, name: "Oval" },
  { id: 5, name: "Round" },
  { id: 6, name: "Top Round" },
  { id: 7, name: "Bottom Round" },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

export default function ProductListing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState(49000);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedFrameMaterials, setSelectedFrameMaterials] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedFrameShapes, setSelectedFrameShapes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [frameMaterial, setFrameMaterial] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [selectedFrameColors, setSelectedFrameColors] = useState({});

  const [showLogin, setShowLogin] = useState(false); // State for login popup
  const [showSignup, setShowSignup] = useState(false); // State for signup popup
  const [pendingCartItem, setPendingCartItem] = useState(null); // Store item to add after login

  const userData = userToken();
  const token = userData?.token;

  const isMobile = useIsMobile();

  // Sync search term with URL
  useEffect(() => {
    const query = searchParams.get("query") || "";
    setSearchTerm(query);
    setCurrentPage(1);
  }, [searchParams]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const materialsRes = await axios.get(
          `${API_URL}/material/getallmaterial`
        );
        setMaterials(materialsRes.data || []);
        const frameMatRes = await axios.get(
          `${API_URL}/framematerial/getallframemat`
        );
        setFrameMaterial(frameMatRes.data || []);
        const sizesRes = await axios.get(`${API_URL}/size/getallsize`);
        setSizes(sizesRes.data.sizes || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load filter options");
      }
    };
    fetchDropdownData();
  }, []);

  // Debounced fetch frames
  const fetchFrames = useCallback(
    debounce(async (page = 1, term = searchTerm, filters = {}) => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: itemsPerPage,
          search: term,
          frameMaterialIds: filters.frameMaterials?.join(",") || "",
          materialIds: filters.materials?.join(",") || "",
          sizeIds: filters.sizes?.join(",") || "",
          frameShapes: filters.frameShapes?.join(",") || "",
          color: filters.colors?.join(",") || "",
          minPrice: 200,
          maxPrice: filters.priceRange || 49000,
        };

        const response = await axios.get(`${API_URL}/frame/getallframes`, {
          params,
        });
        const framesData = response.data.data || [];

        const parsedFrames = framesData.map((frame) => ({
          ...frame,
          colors: frame.colors ? JSON.parse(frame.colors) : [],
        }));

        setFrames(parsedFrames);
        setTotalPages(response.data.pagination.totalPages);

        const defaultColors = {};
        parsedFrames.forEach((frame) => {
          if (frame.colors?.length > 0) {
            defaultColors[frame.frameId] = frame.colors[0];
          }
        });
        setSelectedFrameColors(defaultColors);
      } catch (error) {
        console.error("Error fetching frames:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }, 300),
    [itemsPerPage] // Only depend on itemsPerPage
  );

  // Initial fetch and search term changes
  useEffect(() => {
    fetchFrames(currentPage, searchTerm, {
      frameMaterials: selectedFrameMaterials,
      materials: selectedMaterials,
      sizes: selectedSizes,
      frameShapes: selectedFrameShapes,
      colors: selectedColors,
      priceRange,
    });
  }, [currentPage, searchTerm, fetchFrames]);

  const handleFilterChange = (setter) => (value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedFrameMaterials([]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
    setSelectedFrameShapes([]);
    setSelectedColors([]);
    setPriceRange(5999);
    setSearchTerm("");
    setSearchParams({});
    setCurrentPage(1);
    fetchFrames(1, "", {}); // Fetch all frames without filters
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchFrames(1, searchTerm, {
      frameMaterials: selectedFrameMaterials,
      materials: selectedMaterials,
      sizes: selectedSizes,
      frameShapes: selectedFrameShapes,
      colors: selectedColors,
      priceRange,
    });
    if (isMobile) setIsFilterOpen(false); // Close sidebar on mobile
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchParams({});
    setCurrentPage(1);
    fetchFrames(1, "", {
      frameMaterials: selectedFrameMaterials,
      materials: selectedMaterials,
      sizes: selectedSizes,
      frameShapes: selectedFrameShapes,
      colors: selectedColors,
      priceRange,
    });
  };

  const handleAddToCart = async (frame,e) => {
        e.preventDefault();
    e.stopPropagation();

    if (!userData?.userId) {
      toast.error("Please log in to add items to cart");
      setShowLogin(true); // Show login popup
      setPendingCartItem(frame); // Store the item to add after login
      return;
    }

    try {
      if (!token) {
        navigate("/login");
        toast.error("Please login to add to cart");
        return;
      }
      if (!frame.frameSizes || frame.frameSizes.length === 0) {
        toast.error("No available sizes for this product");
        return;
      }
      if (!selectedFrameColors[frame.frameId]) {
        toast.error("Please select a color");
        return;
      }
      const frameSizeId = frame.frameSizes[0].frameSizeId;
      const color = selectedFrameColors[frame.frameId];
      const response = await axios.post(
        `${API_URL}/cart/addtocart`,
        {
          userId: userData?.userId,
          frameSizeId,
          color,
          quantity: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Added to cart successfully!");
        setCartItems([...cartItems, response.data.data]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

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

  const toggleSignupPopup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  // Toggle login popup and close signup popup
  const toggleLoginPopup = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const renderProductCard = (frame) => (
    <div
      key={frame.frameId}
      className="group max-w-7xl mx-auto"
      style={{ fontFamily: "Times New Roman" }}
    >
      <div className="relative mb-3 overflow-hidden bg-gray-100">
        <img
          src={`${API_URL}/${frame.images[0].imageUrl}`}
          alt={frame.name}
          className="w-full h-full object-cover"
          onClick={() => navigate(`/Singleproduct/${frame.frameId}`)}
        />
        <div
          className="absolute top-3 right-3 flex flex-col gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
          onClick={toggleCart}
        >
          <button
            className="bg-black text-white p-2 rounded-full cursor-pointer"
            onClick={(e) => handleAddToCart(frame, e)}
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium uppercase mb-1">{frame.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {frame.description
            ? frame.description.split(" ").slice(0, 6).join(" ") +
              (frame.description.split(" ").length > 10 ? "..." : "")
            : ""}
        </p>
        <p className="font-medium">
          Starting From ₹
          {frame?.basePrice && !isNaN(frame.basePrice)
            ? frame.basePrice.toFixed(2)
            : "N/A"}
        </p>
      </div>
    </div>
  );

  const filterSidebar = (
    <div
      className="border border-gray-200 rounded-lg p-6 h-full overflow-y-auto bg-white"
      style={{ fontFamily: "Times New Roman" }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-medium uppercase mb-4">Size</h3>
        <div className="space-y-2">
          {sizes.map((size) => (
            <label key={size.sizeId} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedSizes.includes(size.sizeId)}
                onChange={() =>
                  handleFilterChange(setSelectedSizes)(size.sizeId)
                }
                className="w-4 h-4 mr-2"
              />
              {size.width}x{size.height}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium uppercase mb-4">Material</h3>
        <div className="space-y-2">
          {materials.map((material) => (
            <label key={material.materialId} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedMaterials.includes(material.materialId)}
                onChange={() =>
                  handleFilterChange(setSelectedMaterials)(material.materialId)
                }
                className="w-4 h-4 mr-2"
              />
              {material.materialName}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium uppercase mb-4">Frame Shape</h3>
        <div className="space-y-2">
          {frameShapes.map((shape) => (
            <label key={shape.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFrameShapes.includes(shape.name)}
                onChange={() =>
                  handleFilterChange(setSelectedFrameShapes)(shape.name)
                }
                className="w-4 h-4 mr-2"
              />
              {shape.name}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium uppercase mb-4">Frame Material</h3>
        <div className="space-y-2">
          {frameMaterial.map((mat) => (
            <label key={mat.frameMaterialId} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFrameMaterials.includes(mat.frameMaterialId)}
                onChange={() =>
                  handleFilterChange(setSelectedFrameMaterials)(
                    mat.frameMaterialId
                  )
                }
                className="w-4 h-4 mr-2"
              />
              {mat.materialName}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium uppercase mb-4">Price</h3>
        <input
          type="range"
          min="200"
          max="49000"
          value={priceRange}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            setPriceRange(newValue);
            console.log("Price Range Updated:", newValue); // Debug: Log priceRange change
          }}
          className="w-full"
        />
        <div className="flex justify-between text-sm">
          <span>₹200</span>
          <span>₹{priceRange}</span>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          onClick={applyFilters}
        >
          Apply Filter
        </button>
        <button
          className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>
    </div>
  );

  const Pagination = () => (
    <div className="flex justify-center mt-8 gap-2">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-4 py-2 rounded ${
            currentPage === i + 1 ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        Next
      </button>
    </div>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 text-sm" style={{ fontFamily: "Times New Roman" }}>
          <Link to="/">
            <span className="text-gray-800 hover:underline">Home</span>
          </Link>{" "}
          / <span className="text-gray-800 hover:underline">Product</span>
          {searchTerm && (
            <>
              {" "}
              / <span className="text-gray-800">Search: {searchTerm}</span>
            </>
          )}
        </div>

        {searchTerm && (
          <div className="mb-4 flex justify-between items-center">
            <p
              style={{ fontFamily: "Times New Roman" }}
              className="text-gray-600"
            >
              Showing results for "{searchTerm}"
            </p>
            <button
              className="text-gray-800 hover:underline"
              onClick={clearSearch}
              style={{ fontFamily: "Times New Roman" }}
            >
              Clear Search
            </button>
          </div>
        )}

        {isMobile && (
          <div className="mb-4">
            <IoFilterSharp
              onClick={toggleFilter}
              className="w-auto h-[30px] cursor-pointer"
              style={{ fontFamily: "Times New Roman" }}
            />
          </div>
        )}

        {isMobile && isFilterOpen && (
          <div className="fixed inset-0 z-40" onClick={toggleFilter} />
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {isMobile ? (
            <div
              className={`fixed top-0 left-0 h-full w-3/4 max-w-xs z-50 bg-white shadow-lg transition-transform duration-300 ${
                isFilterOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              style={{ fontFamily: "Times New Roman" }}
            >
              <button
                className="absolute top-4 right-4 text-2xl"
                onClick={toggleFilter}
                aria-label="Close Filter"
              >
                ×
              </button>
              {filterSidebar}
            </div>
          ) : (
            <div className="w-72 shrink-0 block">{filterSidebar}</div>
          )}

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="animate-spin text-gray-800 text-4xl">↻</span>
              </div>
            ) : frames.length === 0 ? (
              <div className="text-center py-8">
                <p
                  className="text-lg text-gray-600"
                  style={{ fontFamily: "Times New Roman" }}
                >
                  No products match your filters.
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {frames.map((frame) => renderProductCard(frame))}
                </div>
                <Pagination />
              </>
            )}
          </div>
        </div>
      </div>

      {isCartOpen && <Cart toggleCart={toggleCart} items={cartItems} />}

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
}
