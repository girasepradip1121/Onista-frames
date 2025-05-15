// import { Upload, RotateCw } from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import Cart from "./Cart";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "./Variable";
// import toast from "react-hot-toast";

// export default function ProductCustomizer() {
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedMaterial, setSelectedMaterial] = useState("");
//   const [selectedGlassThickness, setSelectedGlassThickness] = useState("3mm");
//   const [selectedThickness, setSelectedThickness] = useState("");
//   const [selectedFrameShape, setSelectedFrameShape] = useState("Four Corner Round");
//   const [selectedFrameMaterial, setSelectedFrameMaterial] = useState("");
//   const [instructions, setInstructions] = useState("");
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [frameRotation, setFrameRotation] = useState(0);
//   const [price, setPrice] = useState(1000);
//   const [originalPrice, setOriginalPrice] = useState(0);
//   const [discountPercent, setDiscountPercent] = useState(30);
//   const [savings, setSavings] = useState(0);
//   const [dimensions, setDimensions] = useState({ width: 17.5, height: 11.5 });
//   const fileInputRef = useRef(null);
//   const frameRef = useRef(null);
//   const [isCustomSize, setIsCustomSize] = useState(false);
//   const [customSizes, setCustomSizes] = useState([]);
//   const [isRotating, setIsRotating] = useState(false);
//   const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });

//   // State for backend data
//   const [sizes, setSizes] = useState([]);
//   const [materials, setMaterials] = useState([]);
//   const [frameMaterials, setFrameMaterials] = useState([]);
//   const [thicknesses, setThicknesses] = useState([]);
//   const [glassThicknesses, setGlassThicknesses] = useState(["3mm", "4mm", "5mm"]);
//   const [sizeMultipliers, setSizeMultipliers] = useState({});
//   const [materialMultipliers, setMaterialMultipliers] = useState({});
//   const [frameMaterialMultipliers, setFrameMaterialMultipliers] = useState({});
//   const [thicknessMultipliers, setThicknessMultipliers] = useState({});
//   const [glassThicknessMultipliers, setGlassThicknessMultipliers] = useState({
//     "3mm": 1,
//     "4mm": 1.05,
//     "5mm": 1.1,
//   });

//   const navigate=useNavigate()

//   // Fetch all data from backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch Sizes
//         const sizeResponse = await axios.get(`${API_URL}/size/getallsize`);
//         console.log("Sizes Response:", sizeResponse.data);
//         const fetchedSizes = sizeResponse.data.sizes || [];
//         const sizesWithLabels = fetchedSizes.map((s) => ({
//           ...s,
//           label: s.label || `${s.width} x ${s.height} inch`,
//         }));
//         console.log("Sizes with Labels:", sizesWithLabels);
//         setSizes(sizesWithLabels.map((s) => s.label));
//         const sizeMultiplierMap = {};
//         sizesWithLabels.forEach((s) => {
//           sizeMultiplierMap[s.label] = s.multiplier || 1;
//         });
//         setSizeMultipliers(sizeMultiplierMap);
//         console.log("Size Multipliers:", sizeMultiplierMap);
//         if (sizesWithLabels.length > 0) {
//           setSelectedSize(sizesWithLabels[0].label); 
//           setDimensions({
//             width: sizesWithLabels[0].width,
//             height: sizesWithLabels[0].height,
//           });
//           console.log("Initial Size:", sizesWithLabels[0].label, "Dimensions:", {
//             width: sizesWithLabels[0].width,
//             height: sizesWithLabels[0].height,
//           });
//         } else {
//           console.warn("No sizes fetched, using fallback");
//           setSizes(["17.5 x 11.5 inch"]);
//           setSelectedSize("17.5 x 11.5 inch");
//           setDimensions({ width: 17.5, height: 11.5 });
//           setSizeMultipliers({ "17.5 x 11.5 inch": 1 });
//         }

//         // Fetch Materials
//         const materialResponse = await axios.get(`${API_URL}/material/getallmaterial`);
//         const fetchedMaterials = materialResponse.data || [];
//         setMaterials(fetchedMaterials.map((m) => m.materialName));
//         const materialMultiplierMap = {};
//         fetchedMaterials.forEach((m) => {
//           materialMultiplierMap[m.materialName] = m.multiplier || 1;
//         });
//         setMaterialMultipliers(materialMultiplierMap);
//         if (fetchedMaterials.length > 0) {
//           setSelectedMaterial(fetchedMaterials[0].materialName);
//           console.log("Initial Material:", fetchedMaterials[0].materialName);
//         }

//         // Fetch Frame Materials
//         const frameMaterialResponse = await axios.get(`${API_URL}/framematerial/getallframemat`);
//         const fetchedFrameMaterials = frameMaterialResponse.data || [];
//         setFrameMaterials(fetchedFrameMaterials.map((fm) => fm.materialName));
//         const frameMaterialMultiplierMap = {};
//         fetchedFrameMaterials.forEach((fm) => {
//           frameMaterialMultiplierMap[fm.materialName] = fm.multiplier || 1;
//         });
//         setFrameMaterialMultipliers(frameMaterialMultiplierMap);
//         if (fetchedFrameMaterials.length > 0) {
//           setSelectedFrameMaterial(fetchedFrameMaterials[0].materialName);
//           console.log("Initial Frame Material:", fetchedFrameMaterials[0].materialName);
//         }

//         // Fetch Thicknesses
//         const thicknessResponse = await axios.get(`${API_URL}/thickness/getallthickness`);
//         const fetchedThicknesses = thicknessResponse.data.thicknesses || [];
//         console.log("Thicknesses:", fetchedThicknesses);
//         setThicknesses(fetchedThicknesses.map((t) => t.thicknessValue));
//         const thicknessMultiplierMap = {};
//         fetchedThicknesses.forEach((t) => {
//           thicknessMultiplierMap[t.thicknessValue] = t.multiplier || 1;
//         });
//         setThicknessMultipliers(thicknessMultiplierMap);
//         if (fetchedThicknesses.length > 0) {
//           setSelectedThickness(fetchedThicknesses[0].thicknessValue);
//           console.log("Initial Thickness:", fetchedThicknesses[0].thicknessValue);
//         }

//         // Fetch Glass Thicknesses
//         try {
//           const glassThicknessResponse = await axios.get(`${API_URL}/thickness/getallthickness`);
//           const fetchedGlassThicknesses = glassThicknessResponse.data.thicknesses || [];
//           if (fetchedGlassThicknesses.length > 0) {
//             setGlassThicknesses(fetchedGlassThicknesses.map((t) => t.thicknessValue));
//             const glassThicknessMultiplierMap = {};
//             fetchedGlassThicknesses.forEach((t) => {
//               glassThicknessMultiplierMap[t.thicknessValue] = t.multiplier || 1;
//             });
//             setGlassThicknessMultipliers(glassThicknessMultiplierMap);
//             setSelectedGlassThickness(fetchedGlassThicknesses[0].thicknessValue);
//             console.log("Initial Glass Thickness:", fetchedGlassThicknesses[0].thicknessValue);
//           }
//         } catch (glassError) {
//           console.warn("No glass thicknesses fetched, using fallback");
//         }
//       } 
//       catch (error) {
//         console.error("Error fetching data:", error);
//         // Fallback to static data
//         setSizes([
//           "17.5 x 11.5 inch",
//           "12 x 12 inch",
//           "20 x 20 inch",
//           "23.5 x 16 inch",
//           "29.5 x 20 inch",
//           "18 x 18 inch",
//           "24 x 24 inch",
//           "30 x 30 inch",
//           "23.5 x 11.5 inch",
//           "29.5 x 14.5 inch",
//           "35.5 x 17.5 inch",
//           "41.5 x 20.5 inch",
//         ]);
//         setMaterials(["Acrylic", "Acrylic White Matte", "Canvas", "Glass", "Other"]);
//         setFrameMaterials(["PVC", "SSPVD", "Aluminum", "Aluminum Slim", "Without frame"]);
//         setThicknesses(["3mm", "4mm", "5mm"]);
//         setGlassThicknesses(["3mm", "4mm", "5mm"]);
//         setSizeMultipliers({ "17.5 x 11.5 inch": 1 });
//         setMaterialMultipliers({
//           Acrylic: 1,
//           "Acrylic White Matte": 1.05,
//           Canvas: 0.9,
//           Glass: 1.15,
//           Other: 1,
//         });
//         setFrameMaterialMultipliers({
//           PVC: 1,
//           SSPVD: 1.2,
//           Aluminum: 1.1,
//           "Aluminum Slim": 1.1,
//           "Without frame": 0.85,
//         });
//         setThicknessMultipliers({
//           "3mm": 1,
//           "4mm": 1.05,
//           "5mm": 1.1,
//         });
//         setGlassThicknessMultipliers({
//           "3mm": 1,
//           "4mm": 1.05,
//           "5mm": 1.1,
//         });
//         setSelectedSize("17.5 x 11.5 inch");
//         setSelectedMaterial("Acrylic");
//         setSelectedFrameMaterial("PVC");
//         setSelectedThickness("3mm");
//         setSelectedFrameShape("Four Corner Round");
//         setSelectedGlassThickness("3mm");
//         console.log("Fallback Selections:", {
//           size: "17.5 x 11.5 inch",
//           material: "Acrylic",
//           frameMaterial: "PVC",
//           thickness: "3mm",
//           frameShape: "Four Corner Round",
//           glassThickness: "3mm",
//         });
//       }
//     };
//     fetchData();
//   }, []);

//   // Parse size string into dimensions when size changes
//   useEffect(() => {
//     if (!isCustomSize && !isRotating && selectedSize) {
//       const sizeParts = selectedSize.replace("inch", "").trim().replace(/\s/g, "").split(/[x×]/);
//       if (sizeParts.length === 2) {
//         const width = Number.parseFloat(sizeParts[0].replace(",", "."));
//         const height = Number.parseFloat(sizeParts[1].replace(",", "."));
//         if (!isNaN(width) && !isNaN(height)) {
//           setDimensions({
//             width: frameRotation === 90 ? height : width,
//             height: frameRotation === 90 ? width : height,
//           });
//           console.log("Updated Dimensions:", { width, height });
//         }
//       }
//     }
//   }, [selectedSize, isCustomSize, frameRotation, isRotating]);

//   // Calculate price, original price, discount, and savings
//   useEffect(() => {
//     if (dimensions.width && dimensions.height && selectedSize) {
//       let newPrice = 1000; // Base price set to 1000
//       const sizeMultiplier = (dimensions.width * dimensions.height) / (17.5 * 11.5);
//       newPrice = Math.round(newPrice * sizeMultiplier);

//       const materialMultiplier = materialMultipliers[selectedMaterial] || 1;
//       newPrice = Math.round(newPrice * materialMultiplier);

//       // Apply glass thickness multiplier only if material is Glass
//       const glassThicknessMultiplier = selectedMaterial === "Glass" ? (glassThicknessMultipliers[selectedGlassThickness] || 1) : 1;
//       newPrice = Math.round(newPrice * glassThicknessMultiplier);

//       const frameMaterialMultiplier = frameMaterialMultipliers[selectedFrameMaterial] || 1;
//       newPrice = Math.round(newPrice * frameMaterialMultiplier);

//       const thicknessMultiplier = thicknessMultipliers[selectedThickness] || 1;
//       newPrice = Math.round(newPrice * thicknessMultiplier);

//       // Set current price
//       setPrice(newPrice);

//       // Calculate original price (40% markup)
//       const original = Math.round(newPrice * 1.4);
//       setOriginalPrice(original);

//       // Random discount between 30% and 50%
//       const minDiscount = 30;
//       const maxDiscount = 50;
//       const discount = Math.round(minDiscount + Math.random() * (maxDiscount - minDiscount));
//       setDiscountPercent(discount);

//       // Calculate savings
//       const savingsAmount = Math.round(original * (discount / 100));
//       setSavings(savingsAmount);

//       console.log("Price Calculated:", {
//         newPrice,
//         originalPrice: original,
//         discountPercent: discount,
//         savings: savingsAmount,
//         sizeMultiplier,
//         materialMultiplier,
//         glassThicknessMultiplier,
//         frameMaterialMultiplier,
//         thicknessMultiplier,
//       });
//     }
//   }, [
//     selectedMaterial,
//     selectedFrameMaterial,
//     selectedThickness,
//     selectedSize,
//     selectedGlassThickness,
//     dimensions,
//     materialMultipliers,
//     frameMaterialMultipliers,
//     thicknessMultipliers,
//     glassThicknessMultipliers,
//   ]);

//   // Reset frame shape for square and non-square sizes
//   useEffect(() => {
//     if (selectedSize) {
//       const isSquareSize = [...sizes, ...customSizes].some(
//         (size) =>
//           size === selectedSize &&
//           size.replace("inch", "").trim().split(/[x×]/).map(Number).every((dim, _, arr) => dim === arr[0])
//       );

//       if (isSquareSize && (selectedFrameShape === "Rectangle" || selectedFrameShape === "Oval")) {
//         setSelectedFrameShape("Square"); // Set Square for square sizes
//         console.log("Reset Frame Shape to: Square");
//       } else if (!isSquareSize && (selectedFrameShape === "Square" || selectedFrameShape === "Round")) {
//         setSelectedFrameShape("Four Corner Round"); // Default for non-square sizes
//         console.log("Reset Frame Shape to: Four Corner Round");
//       } else if (isSquareSize && !selectedFrameShape) {
//         setSelectedFrameShape("Square"); // Set Square if no shape selected for square size
//         console.log("Set Frame Shape to: Square");
//       }
//     }
//   }, [selectedSize, selectedFrameShape, sizes, customSizes]);

//   const frameShapes = [
//     "Four Corner Round",
//     "Square",
//     "Rectangle",
//     "Oval",
//     "Round",
//     "Top Round",
//     "Bottom Round",
//   ];

//   const handleImageUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const img = new Image();
//         img.onload = () => {
//           setImageNaturalSize({
//             width: img.width,
//             height: img.height,
//           });

//           const isPortrait = img.height > img.width;

//           if (isPortrait && dimensions.width > dimensions.height) {
//             setFrameRotation(90);
//             setDimensions((prev) => ({
//               width: prev.height,
//               height: prev.width,
//             }));
//           } else if (!isPortrait && dimensions.width < dimensions.height) {
//             setFrameRotation(0);
//             setDimensions((prev) => ({
//               width: prev.height,
//               height: prev.width,
//             }));
//           }

//           setUploadedImage(event.target?.result);
//         };
//         img.src = event.target?.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const rotateFrameAndContent = () => {
//     setIsRotating(true);
//     setFrameRotation((prev) => (prev === 0 ? 90 : 0));
//     setDimensions((prev) => ({
//       width: prev.height,
//       height: prev.width,
//     }));
//     setTimeout(() => setIsRotating(false), 50);
//   };

//   const handleCustomSizeChange = (dimension, value) => {
//     if (value === "" || (!isNaN(value) && value > 0)) {
//       if (dimension === "width") {
//         setDimensions((prev) => ({
//           ...prev,
//           width: value === "" ? "" : Number.parseFloat(value),
//         }));
//       } else {
//         setDimensions((prev) => ({
//           ...prev,
//           height: value === "" ? "" : Number.parseFloat(value),
//         }));
//       }
//     }
//   };

//   const handleSaveCustomSize = () => {
//     if (dimensions.width && dimensions.height) {
//       const customSizeString = `${dimensions.width} x ${dimensions.height} inch`;
//       if (!customSizes.includes(customSizeString) && !sizes.includes(customSizeString)) {
//         setCustomSizes((prev) => [...prev, customSizeString]); // Add only to customSizes
//         setSelectedSize(customSizeString);
//         setIsCustomSize(false);
//         console.log("Custom Size Saved:", customSizeString);
//       }
//     }
//   };

//   const formatPrice = (price) => {
//     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

//   const handleCheckout = async () => {
  
//     const customizedProduct = {
//       type: "custom",
//       customSize: selectedSize,
//       dimensions,
//       material: selectedMaterial,
//       glassThickness: selectedGlassThickness,
//       thickness: selectedThickness,
//       frameShape: selectedFrameShape,
//       frameMaterial: selectedFrameMaterial,
//       instructions,
//       price,
//       quantity: 1,
//     };

//     if (!fileInputRef.current.files[0]) {
//       toast.error("Please select an image for custom order");
//       return;
//     }

//     // Upload image to backend
//     let imageUrl = null;
//     try {
//       const formData = new FormData();
//       formData.append("image", fileInputRef.current.files[0]);
//       const response = await axios.post(`${API_URL}/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       imageUrl = response.data.imageUrl;
//       console.log("Uploaded image URL:", imageUrl);
//     } catch (err) {
//       console.error("Image upload error:", err);
//       toast.error("Failed to upload image. Please try again.");
//       return;
//     }
  
//     sessionStorage.setItem("customOrder", JSON.stringify(customizedProduct));
//     sessionStorage.setItem("customOrderImageUrl", imageUrl);

//     // if (uploadedImage && fileInputRef.current.files[0]) {
//     //   const blobUrl = URL.createObjectURL(fileInputRef.current.files[0]);
//     //   sessionStorage.setItem("customOrderImage", blobUrl);
//     // }
    
//     navigate("/CheckoutPage");
//   };

//   return (
//     <>
//       <div style={{ fontFamily: "Times New Roman" }} className="w-full max-w-7xl mx-auto px-4 py-4 md:py-8">
//         <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
//         <div className="text-sm mb-6">
//           <Link to={"/"}>
//             <span style={{ fontFamily: "Times New Roman" }} className="text-gray-800 hover:underline">Home</span>
//           </Link>
//           <span className="mx-2 text-gray-500"></span>
//           <span style={{ fontFamily: "Times New Roman" }} className="text-gray-800">Fruitland</span>
//           <span className="mx-2 text-gray-500"></span>
//           <span style={{ fontFamily: "Times New Roman" }} className="text-gray-800">Customize</span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
//           <div className="p-4 md:p-8 relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: "300px", height: "auto", aspectRatio: "1/1", maxWidth: "100%" }}>
//             <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-full z-10">
//               <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
//                 <div className="h-0.5 w-6 bg-black"></div>
//                 <span className="mx-2 text-sm font-bold">{dimensions.width} inch Width</span>
//                 <div className="h-0.5 w-6 bg-black"></div>
//               </div>
//             </div>
//             <div className="absolute top-1/2 left-1 transform -translate-y-1/2 flex items-center justify-center h-full z-10">
//               <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
//                 <div className="w-0.5 h-6 bg-black"></div>
//                 <span className="mx-2 text-sm font-bold">{dimensions.height} inch Height</span>
//                 <div className="w-0.5 h-6 bg-black"></div>
//               </div>
//             </div>
//             <div className="transition-transform duration-300 origin-center flex items-center justify-center" style={{ maxWidth: "100%", maxHeight: "100%" }}>
//               <div ref={frameRef} className="relative transition-all h-[500px] w-[500px] transform duration-300 overflow-hidden" style={{
//                 transform: `rotate(${frameRotation}deg)`,
//                 aspectRatio: frameRotation === 90 ? `${dimensions.height / dimensions.width}` : `${dimensions.width / dimensions.height}`,
//                 maxWidth: "100%",
//                 maxHeight: "100%",
//                 width: "auto",
//                 height: "auto",
//                 padding: "0px",
//                 boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
//                 backgroundColor: "#fff",
//                 border: selectedFrameMaterial === "Without frame" ? "none" :
//                   selectedFrameMaterial === "PVC" ? `${selectedThickness.replace("mm", "")}px solid #000000` :
//                   selectedFrameMaterial === "SSPVD" ? `${selectedThickness.replace("mm", "")}px solid #C0C0C0` :
//                   selectedFrameMaterial === "Aluminum" ? `${selectedThickness.replace("mm", "")}px solid #A9A9A9` :
//                   selectedFrameMaterial === "Aluminum Slim" ? `${Math.max(Number.parseInt(selectedThickness.replace("mm", "")) / 2, 3)}px solid #A9A9A9` :
//                   `${selectedThickness.replace("mm", "")}px solid #000000`,
//                 borderRadius: selectedFrameShape === "Four Corner Round" ? "12px" :
//                   selectedFrameShape === "Square" ? "0px" :
//                   selectedFrameShape === "Rectangle" ? "0px" :
//                   selectedFrameShape === "Oval" ? "50% / 50%" :
//                   selectedFrameShape === "Round" ? "50%" :
//                   selectedFrameShape === "Top Round" ? "50% 50% 0 0" :
//                   selectedFrameShape === "Bottom Round" ? "0 0 50% 50%" : "0px",
//               }}>
//                 <div className="w-full h-full flex items-center justify-center cursor-pointer overflow-hidden" onClick={triggerFileInput} style={{
//                   borderRadius: selectedFrameShape === "Four Corner Round" ? "12px" :
//                     selectedFrameShape === "Square" ? "0px" :
//                     selectedFrameShape === "Rectangle" ? "0px" :
//                     selectedFrameShape === "Oval" ? "50%" :
//                     selectedFrameShape === "Round" ? "50%" :
//                     selectedFrameShape === "Top Round" ? "50% 50% 0 0" :
//                     selectedFrameShape === "Bottom Round" ? "0 0 50% 50%" : "0px",
//                   clipPath: selectedFrameShape === "Oval" ? "ellipse(50% 50% at 50% 50%)" : "none",
//                 }}>
//                   {uploadedImage ? (
//                     <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded preview" className="w-[500px] h-[500px] transition-all duration-300" style={{
//                       objectFit: "cover",
//                       objectPosition: "center",
//                       transform: frameRotation === 90 ? "rotate(-90deg)" : "rotate(0deg)",
//                       borderRadius: selectedFrameShape === "Four Corner Round" ? "20px" :
//                         selectedFrameShape === "Square" ? "0px" :
//                         selectedFrameShape === "Rectangle" ? "0px" :
//                         selectedFrameShape === "Oval" ? "50% / 50%" :
//                         selectedFrameShape === "Round" ? "50%" :
//                         selectedFrameShape === "Top Round" ? "50px 50px 0 0" :
//                         selectedFrameShape === "Bottom Round" ? "0 0 50px 50px" : "0px",
//                       overflow: "hidden",
//                     }} />
//                   ) : (
//                     <div className="text-center p-4 md:p-12">
//                       <Upload className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 text-gray-500" />
//                       <p className="text-lg md:text-xl font-medium">Upload Image</p>
//                       <p className="text-sm text-red-600 mt-2">Click here</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
//               {uploadedImage && (
//                 <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors" onClick={rotateFrameAndContent} aria-label="Rotate frame and content">
//                   <RotateCw className="w-5 h-5 text-gray-700 cursor-pointer" />
//                 </button>
//               )}
//             </div>
//           </div>

//           <div>
//             <h1 className="text-2xl font-medium mb-1">Geometric Harmony Wall Art</h1>
//             <div className="text-sm text-gray-500 mb-4">4.0 (24 reviews)</div>
//             <div className="flex items-baseline mb-4">
//               <span className="text-xl font-bold">₹{formatPrice(price)}.00</span>
//               <span className="text-gray-500 line-through text-sm ml-2">₹{formatPrice(originalPrice)}</span>
//               <span className="text-green-600 text-sm ml-2">₹{formatPrice(savings)} ({discountPercent}%)</span>
//             </div>
//             <p className="text-sm mb-4">Designed by The Oasis (Made in India)</p>
//             <ul className="text-sm mb-6 space-y-1">
//               <li>
//                 • Made with High Quality {selectedGlassThickness} {selectedMaterial.toLowerCase()}
//                 {selectedMaterial === "Glass" ? " sheet" : selectedMaterial === "Canvas" ? "" : " sheet"}
//               </li>
//               <li>
//                 • Framed with a {selectedThickness} thick premium{" "}
//                 {selectedFrameMaterial === "Without frame" ? "borderless design" : `${selectedFrameMaterial.toLowerCase()} frame`}
//               </li>
//             </ul>

//             <div className="mb-8">
//               <h2 className="text-lg font-medium mb-3">Select Size (inch)</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                 {sizes.map((size, index) => (
//                   <button
//                     key={size}
//                     className={`border rounded-sm py-2 px-4 text-sm ${
//                       (selectedSize === size && !isCustomSize) || (!selectedSize && index === 0)
//                         ? "bg-black text-white"
//                         : "bg-white text-black hover:bg-gray-100"
//                     }`}
//                     onClick={() => {
//                       setSelectedSize(size);
//                       setIsCustomSize(false);
//                       const sizeParts = size.replace("inch", "").trim().replace(/\s/g, "").split(/[x×]/);
//                       if (sizeParts.length === 2) {
//                         const width = Number.parseFloat(sizeParts[0].replace(",", "."));
//                         const height = Number.parseFloat(sizeParts[1].replace(",", "."));
//                         setDimensions({ width, height });
//                         console.log("Size Selected:", size, "Dimensions:", { width, height });
//                       }
//                     }}
//                   >
//                     {size}
//                   </button>
//                 ))}
//                 {customSizes.map((size, index) => (
//                   <button
//                     key={`custom-${size}`}
//                     className={`border rounded-sm py-2 px-4 text-sm ${
//                       selectedSize === size ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
//                     }`}
//                     onClick={() => {
//                       setSelectedSize(size);
//                       const sizeParts = size.replace("inch", "").trim().replace(/\s/g, "").split(/[x×]/);
//                       if (sizeParts.length === 2) {
//                         const width = Number.parseFloat(sizeParts[0].replace(",", "."));
//                         const height = Number.parseFloat(sizeParts[1].replace(",", "."));
//                         setDimensions({ width, height });
//                         console.log("Custom Size Selected:", size, "Dimensions:", { width, height });
//                       }
//                       setIsCustomSize(false);
//                     }}
//                   >
//                     {size}
//                   </button>
//                 ))}
//                 <button
//                   className={`border rounded-sm py-2 px-4 text-sm ${
//                     isCustomSize ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
//                   }`}
//                   onClick={() => setIsCustomSize(true)}
//                 >
//                   Custom Size
//                 </button>
//               </div>
//               {isCustomSize && (
//                 <div className="mt-4">
//                   <div className="grid grid-cols-2 gap-4 mb-2">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Width (inch)</label>
//                       <input
//                         type="number"
//                         min="1"
//                         step="0.1"
//                         value={dimensions.width}
//                         onChange={(e) => handleCustomSizeChange("width", e.target.value)}
//                         className="w-full border rounded-sm p-2"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Height (inch)</label>
//                       <input
//                         type="number"
//                         min="1"
//                         step="0.1"
//                         value={dimensions.height}
//                         onChange={(e) => handleCustomSizeChange("height", e.target.value)}
//                         className="w-full border rounded-sm p-2"
//                       />
//                     </div>
//                   </div>
//                   <button
//                     onClick={handleSaveCustomSize}
//                     className="mt-2 bg-gray-200 hover:bg-gray-300 text-black py-1 px-4 rounded-sm text-sm cursor-pointer"
//                     disabled={!dimensions.width || !dimensions.height}
//                   >
//                     Save Custom Size
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="mb-8">
//               <h2 className="text-lg font-medium mb-3">Product Materials</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                 {materials.map((material, index) => (
//                   <button
//                     key={material}
//                     className={`border rounded-sm py-2 px-4 text-sm ${
//                       selectedMaterial === material || (!selectedMaterial && index === 0)
//                         ? "bg-black text-white"
//                         : "bg-white text-black hover:bg-gray-100"
//                     }`}
//                     onClick={() => setSelectedMaterial(material)}
//                   >
//                     {material}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {selectedMaterial === "Glass" && (
//               <div className="mb-8">
//                 <h2 className="text-lg font-medium mb-3">Glass Thickness</h2>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                   {glassThicknesses.map((thickness, index) => (
//                     <button
//                       key={thickness}
//                       className={`border rounded-sm py-2 px-4 text-sm ${
//                         selectedGlassThickness === thickness || (!selectedGlassThickness && index === 0)
//                           ? "bg-black text-white"
//                           : "bg-white text-black hover:bg-gray-100"
//                       }`}
//                       onClick={() => setSelectedGlassThickness(thickness)}
//                     >
//                       {thickness}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="mb-8">
//               <h2 className="text-lg font-medium mb-3">Thickness (mm)</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                 {thicknesses.map((thickness, index) => (
//                   <button
//                     key={thickness}
//                     className={`border rounded-sm py-2 px-4 text-sm ${
//                       selectedThickness === thickness || (!selectedThickness && index === 0)
//                         ? "bg-black text-white"
//                         : "bg-white text-black hover:bg-gray-100"
//                     }`}
//                     onClick={() => setSelectedThickness(thickness)}
//                   >
//                     {thickness}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-8">
//               <h2 className="text-lg font-medium mb-3">Frame Shape</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                 {frameShapes.filter((shape) => {
//                   const isSquareSize = [...sizes, ...customSizes].some(
//                     (size) =>
//                       size === selectedSize &&
//                       size.replace("inch", "").trim().split(/[x×]/).map(Number).every((dim, _, arr) => dim === arr[0])
//                   );
//                   if (isSquareSize && (shape === "Rectangle" || shape === "Oval")) {
//                     return false; // Filter out Rectangle and Oval for square sizes
//                   }
//                   if (!isSquareSize && (shape === "Square" || shape === "Round")) {
//                     return false; // Filter out Square and Round for non-square sizes
//                   }
//                   return true; // Allow other shapes
//                 }).map((shape) => (
//                   <button
//                     key={shape}
//                     className={`border rounded-sm py-2 px-4 text-sm ${
//                       selectedFrameShape === shape
//                         ? "bg-black text-white"
//                         : "bg-white text-black hover:bg-gray-100"
//                     }`}
//                     onClick={() => setSelectedFrameShape(shape)}
//                   >
//                     {shape}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-8">
//               <h2 className="text-lg font-medium mb-3">Frame Materials</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                 {frameMaterials.filter((material) => {
//                   if (selectedFrameShape === "Square" || selectedFrameShape === "Rectangle") {
//                     return true;
//                   }
//                   return material !== "PVC" && material !== "Aluminum Slim";
//                 }).map((material, index) => (
//                   <button
//                     key={material}
//                     className={`border rounded-sm py-2 px-4 text-sm ${
//                       selectedFrameMaterial === material || (!selectedFrameMaterial && index === 0)
//                         ? "bg-black text-white"
//                         : "bg-white text-black hover:bg-gray-100"
//                     }`}
//                     onClick={() => setSelectedFrameMaterial(material)}
//                   >
//                     {material}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-8">
//               <h2 className="text-lg font-medium mb-3">Write Instructions</h2>
//               <textarea
//                 className="w-full border rounded-sm p-3 h-32 resize-none"
//                 value={instructions}
//                 onChange={(e) => setInstructions(e.target.value)}
//                 placeholder="Add any special instructions here..."
//               />
//             </div>

//             <button
//               onClick={handleCheckout}
//               className="w-full bg-black rounded-sm text-white py-3 font-medium transition-colors cursor-pointer"
//             >
//               Proceed To Checkout
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* {isCartOpen && <Cart toggleCart={toggleCart} />} */}
//     </>
//   );
// }

import { Upload, RotateCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Variable";
import toast from "react-hot-toast";

export default function ProductCustomizer() {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedGlassThickness, setSelectedGlassThickness] = useState("3mm");
  const [selectedThickness, setSelectedThickness] = useState("");
  const [selectedFrameShape, setSelectedFrameShape] = useState("Four Corner Round");
  const [selectedFrameMaterial, setSelectedFrameMaterial] = useState("");
  const [instructions, setInstructions] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [frameRotation, setFrameRotation] = useState(0);
  const [price, setPrice] = useState(1000);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(30);
  const [savings, setSavings] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 17.5, height: 11.5 });
  const fileInputRef = useRef(null);
  const frameRef = useRef(null);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customSizes, setCustomSizes] = useState([]);
  const [isRotating, setIsRotating] = useState(false);
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });

  // State for backend data
  const [sizes, setSizes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [frameMaterials, setFrameMaterials] = useState([]);
  const [thicknesses, setThicknesses] = useState([]);
  const [glassThicknesses, setGlassThicknesses] = useState(["3mm", "4mm", "5mm"]);
  const [sizeMultipliers, setSizeMultipliers] = useState({});
  const [materialMultipliers, setMaterialMultipliers] = useState({});
  const [frameMaterialMultipliers, setFrameMaterialMultipliers] = useState({});
  const [thicknessMultipliers, setThicknessMultipliers] = useState({});
  const [glassThicknessMultipliers, setGlassThicknessMultipliers] = useState({
    "3mm": 1,
    "4mm": 1.05,
    "5mm": 1.1,
  });

  const navigate = useNavigate();

  // Fetch all data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Sizes
        const sizeResponse = await axios.get(`${API_URL}/size/getallsize`);
        console.log("Sizes Response:", sizeResponse.data);
        const fetchedSizes = sizeResponse.data.sizes || [];
        const sizesWithLabels = fetchedSizes.map((s) => ({
          ...s,
          label: s.label || `${s.width} x ${s.height} inch`,
        }));
        console.log("Sizes with Labels:", sizesWithLabels);
        setSizes(sizesWithLabels.map((s) => s.label));
        const sizeMultiplierMap = {};
        sizesWithLabels.forEach((s) => {
          sizeMultiplierMap[s.label] = s.multiplier || 1;
        });
        setSizeMultipliers(sizeMultiplierMap);
        console.log("Size Multipliers:", sizeMultiplierMap);
        if (sizesWithLabels.length > 0) {
          setSelectedSize(sizesWithLabels[0].label);
          setDimensions({
            width: sizesWithLabels[0].width,
            height: sizesWithLabels[0].height,
          });
          console.log("Initial Size:", sizesWithLabels[0].label, "Dimensions:", {
            width: sizesWithLabels[0].width,
            height: sizesWithLabels[0].height,
          });
        } else {
          console.warn("No sizes fetched, using fallback");
          setSizes(["17.5 x 11.5 inch"]);
          setSelectedSize("17.5 x 11.5 inch");
          setDimensions({ width: 17.5, height: 11.5 });
          setSizeMultipliers({ "17.5 x 11.5 inch": 1 });
        }

        // Fetch Materials
        const materialResponse = await axios.get(`${API_URL}/material/getallmaterial`);
        const fetchedMaterials = materialResponse.data || [];
        setMaterials(fetchedMaterials.map((m) => m.materialName));
        const materialMultiplierMap = {};
        fetchedMaterials.forEach((m) => {
          materialMultiplierMap[m.materialName] = m.multiplier || 1;
        });
        setMaterialMultipliers(materialMultiplierMap);
        if (fetchedMaterials.length > 0) {
          setSelectedMaterial(fetchedMaterials[0].materialName);
          console.log("Initial Material:", fetchedMaterials[0].materialName);
        }

        // Fetch Frame Materials
        const frameMaterialResponse = await axios.get(`${API_URL}/framematerial/getallframemat`);
        const fetchedFrameMaterials = frameMaterialResponse.data || [];
        setFrameMaterials(fetchedFrameMaterials.map((fm) => fm.materialName));
        const frameMaterialMultiplierMap = {};
        fetchedFrameMaterials.forEach((fm) => {
          frameMaterialMultiplierMap[fm.materialName] = fm.multiplier || 1;
        });
        setFrameMaterialMultipliers(frameMaterialMultiplierMap);
        if (fetchedFrameMaterials.length > 0) {
          setSelectedFrameMaterial(fetchedFrameMaterials[0].materialName);
          console.log("Initial Frame Material:", fetchedFrameMaterials[0].materialName);
        }

        // Fetch Thicknesses
        const thicknessResponse = await axios.get(`${API_URL}/thickness/getallthickness`);
        const fetchedThicknesses = thicknessResponse.data.thicknesses || [];
        console.log("Thicknesses:", fetchedThicknesses);
        setThicknesses(fetchedThicknesses.map((t) => t.thicknessValue));
        const thicknessMultiplierMap = {};
        fetchedThicknesses.forEach((t) => {
          thicknessMultiplierMap[t.thicknessValue] = t.multiplier || 1;
        });
        setThicknessMultipliers(thicknessMultiplierMap);
        if (fetchedThicknesses.length > 0) {
          setSelectedThickness(fetchedThicknesses[0].thicknessValue);
          console.log("Initial Thickness:", fetchedThicknesses[0].thicknessValue);
        }

        // Fetch Glass Thicknesses
        try {
          const glassThicknessResponse = await axios.get(`${API_URL}/thickness/getallthickness`);
          const fetchedGlassThicknesses = glassThicknessResponse.data.thicknesses || [];
          if (fetchedGlassThicknesses.length > 0) {
            setGlassThicknesses(fetchedGlassThicknesses.map((t) => t.thicknessValue));
            const glassThicknessMultiplierMap = {};
            fetchedGlassThicknesses.forEach((t) => {
              glassThicknessMultiplierMap[t.thicknessValue] = t.multiplier || 1;
            });
            setGlassThicknessMultipliers(glassThicknessMultiplierMap);
            setSelectedGlassThickness(fetchedGlassThicknesses[0].thicknessValue);
            console.log("Initial Glass Thickness:", fetchedGlassThicknesses[0].thicknessValue);
          }
        } catch (glassError) {
          console.warn("No glass thicknesses fetched, using fallback");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to static data
        setSizes([
          "17.5 x 11.5 inch",
          "12 x 12 inch",
          "20 x 20 inch",
          "23.5 x 16 inch",
          "29.5 x 20 inch",
          "18 x 18 inch",
          "24 x 24 inch",
          "30 x 30 inch",
          "23.5 x 11.5 inch",
          "29.5 x 14.5 inch",
          "35.5 x 17.5 inch",
          "41.5 x 20.5 inch",
        ]);
        setMaterials(["Acrylic", "Acrylic White Matte", "Canvas", "Glass", "Other"]);
        setFrameMaterials(["PVC", "SSPVD", "Aluminum", "Aluminum Slim", "Without frame"]);
        setThicknesses(["3mm", "4mm", "5mm"]);
        setGlassThicknesses(["3mm", "4mm", "5mm"]);
        setSizeMultipliers({ "17.5 x 11.5 inch": 1 });
        setMaterialMultipliers({
          Acrylic: 1,
          "Acrylic White Matte": 1.05,
          Canvas: 0.9,
          Glass: 1.15,
          Other: 1,
        });
        setFrameMaterialMultipliers({
          PVC: 1,
          SSPVD: 1.2,
          Aluminum: 1.1,
          "Aluminum Slim": 1.1,
          "Without frame": 0.85,
        });
        setThicknessMultipliers({
          "3mm": 1,
          "4mm": 1.05,
          "5mm": 1.1,
        });
        setGlassThicknessMultipliers({
          "3mm": 1,
          "4mm": 1.05,
          "5mm": 1.1,
        });
        setSelectedSize("17.5 x 11.5 inch");
        setSelectedMaterial("Acrylic");
        setSelectedFrameMaterial("PVC");
        setSelectedThickness("3mm");
        setSelectedFrameShape("Four Corner Round");
        setSelectedGlassThickness("3mm");
        console.log("Fallback Selections:", {
          size: "17.5 x 11.5 inch",
          material: "Acrylic",
          frameMaterial: "PVC",
          thickness: "3mm",
          frameShape: "Four Corner Round",
          glassThickness: "3mm",
        });
      }
    };
    fetchData();
  }, []);

  // Parse size string into dimensions when size changes
  useEffect(() => {
    if (!isCustomSize && !isRotating && selectedSize) {
      const sizeParts = selectedSize.replace("inch", "").trim().replace(/\s/g, "").split(/[x×]/);
      if (sizeParts.length === 2) {
        const width = Number.parseFloat(sizeParts[0].replace(",", "."));
        const height = Number.parseFloat(sizeParts[1].replace(",", "."));
        if (!isNaN(width) && !isNaN(height)) {
          setDimensions({
            width: frameRotation === 90 ? height : width,
            height: frameRotation === 90 ? width : height,
          });
          console.log("Updated Dimensions:", { width, height });
        }
      }
    }
  }, [selectedSize, isCustomSize, frameRotation, isRotating]);

  // Calculate price, original price, discount, and savings
  useEffect(() => {
    if (dimensions.width && dimensions.height && selectedSize) {
      let newPrice = 1000; // Base price set to 1000
      const sizeMultiplier = (dimensions.width * dimensions.height) / (17.5 * 11.5);
      newPrice = Math.round(newPrice * sizeMultiplier);

      const materialMultiplier = materialMultipliers[selectedMaterial] || 1;
      newPrice = Math.round(newPrice * materialMultiplier);

      // Apply glass thickness multiplier only if material is Glass
      const glassThicknessMultiplier = selectedMaterial === "Glass" ? (glassThicknessMultipliers[selectedGlassThickness] || 1) : 1;
      newPrice = Math.round(newPrice * glassThicknessMultiplier);

      const frameMaterialMultiplier = frameMaterialMultipliers[selectedFrameMaterial] || 1;
      newPrice = Math.round(newPrice * frameMaterialMultiplier);

      const thicknessMultiplier = thicknessMultipliers[selectedThickness] || 1;
      newPrice = Math.round(newPrice * thicknessMultiplier);

      // Set current price
      setPrice(newPrice);

      // Calculate original price (40% markup)
      const original = Math.round(newPrice * 1.4);
      setOriginalPrice(original);

      // Random discount between 30% and 50%
      const minDiscount = 30;
      const maxDiscount = 50;
      const discount = Math.round(minDiscount + Math.random() * (maxDiscount - minDiscount));
      setDiscountPercent(discount);

      // Calculate savings
      const savingsAmount = Math.round(original * (discount / 100));
      setSavings(savingsAmount);

      console.log("Price Calculated:", {
        newPrice,
        originalPrice: original,
        discountPercent: discount,
        savings: savingsAmount,
        sizeMultiplier,
        materialMultiplier,
        glassThicknessMultiplier,
        frameMaterialMultiplier,
        thicknessMultiplier,
      });
    }
  }, [
    selectedMaterial,
    selectedFrameMaterial,
    selectedThickness,
    selectedSize,
    selectedGlassThickness,
    dimensions,
    materialMultipliers,
    frameMaterialMultipliers,
    thicknessMultipliers,
    glassThicknessMultipliers,
  ]);

  // Reset frame shape for square and non-square sizes
  useEffect(() => {
    if (selectedSize) {
      const isSquareSize = [...sizes, ...customSizes].some(
        (size) =>
          size === selectedSize &&
          size.replace("inch", "").trim().split(/[x×]/).map(Number).every((dim, _, arr) => dim === arr[0])
      );

      if (isSquareSize && (selectedFrameShape === "Rectangle" || selectedFrameShape === "Oval")) {
        setSelectedFrameShape("Square"); // Set Square for square sizes
        console.log("Reset Frame Shape to: Square");
      } else if (!isSquareSize && (selectedFrameShape === "Square" || selectedFrameShape === "Round")) {
        setSelectedFrameShape("Four Corner Round"); // Default for non-square sizes
        console.log("Reset Frame Shape to: Four Corner Round");
      } else if (isSquareSize && !selectedFrameShape) {
        setSelectedFrameShape("Square"); // Set Square if no shape selected for square size
        console.log("Set Frame Shape to: Square");
      }
    }
  }, [selectedSize, selectedFrameShape, sizes, customSizes]);

  const frameShapes = [
    "Four Corner Round",
    "Square",
    "Rectangle",
    "Oval",
    "Round",
    "Top Round",
    "Bottom Round",
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImageNaturalSize({
            width: img.width,
            height: img.height,
          });

          const isPortrait = img.height > img.width;

          if (isPortrait && dimensions.width > dimensions.height) {
            setFrameRotation(90);
            setDimensions((prev) => ({
              width: prev.height,
              height: prev.width,
            }));
          } else if (!isPortrait && dimensions.width < dimensions.height) {
            setFrameRotation(0);
            setDimensions((prev) => ({
              width: prev.height,
              height: prev.width,
            }));
          }

          setUploadedImage(event.target?.result);
        };
        img.src = event.target?.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const rotateFrameAndContent = () => {
    setIsRotating(true);
    setFrameRotation((prev) => (prev === 0 ? 90 : 0));
    setDimensions((prev) => ({
      width: prev.height,
      height: prev.width,
    }));
    setTimeout(() => setIsRotating(false), 50);
  };

  const handleCustomSizeChange = (dimension, value) => {
    if (value === "" || (!isNaN(value) && value > 0)) {
      if (dimension === "width") {
        setDimensions((prev) => ({
          ...prev,
          width: value === "" ? "" : Number.parseFloat(value),
        }));
      } else {
        setDimensions((prev) => ({
          ...prev,
          height: value === "" ? "" : Number.parseFloat(value),
        }));
      }
    }
  };

  const handleSaveCustomSize = () => {
    if (dimensions.width && dimensions.height) {
      const customSizeString = `${dimensions.width} x ${dimensions.height} inch`;
      if (!customSizes.includes(customSizeString) && !sizes.includes(customSizeString)) {
        setCustomSizes((prev) => [...prev, customSizeString]); // Add only to customSizes
        setSelectedSize(customSizeString);
        setIsCustomSize(false);
        console.log("Custom Size Saved:", customSizeString);
      }
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCheckout = () => {
    const customizedProduct = {
      type: "custom",
      customSize: selectedSize,
      dimensions,
      material: selectedMaterial,
      glassThickness: selectedGlassThickness,
      thickness: selectedThickness,
      frameShape: selectedFrameShape,
      frameMaterial: selectedFrameMaterial,
      instructions,
      price,
      quantity: 1,
    };

    if (!fileInputRef.current.files[0]) {
      toast.error("Please select an image for custom order");
      return;
    }

    // Pass custom order and image file directly to CheckoutPage
    console.log("Custom Order Prepared:", customizedProduct);
    console.log("Image File:", fileInputRef.current.files[0]);

    navigate("/CheckoutPage", {
      state: {
        cartItems: [], // Add cart items if any
        subtotal: 0,
        customOrder: customizedProduct,
        imageFile: fileInputRef.current.files[0], // Pass the File object directly
      },
    });
  };

  return (
    <>
      <div style={{ fontFamily: "Times New Roman" }} className="w-full max-w-7xl mx-auto px-4 py-4 md:py-8">
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        <div className="text-sm mb-6">
          <Link to={"/"}>
            <span style={{ fontFamily: "Times New Roman" }} className="text-gray-800 hover:underline">Home</span>
          </Link>
          <span className="mx-2 text-gray-500"></span>
          <span style={{ fontFamily: "Times New Roman" }} className="text-gray-800">Fruitland</span>
          <span className="mx-2 text-gray-500"></span>
          <span style={{ fontFamily: "Times New Roman" }} className="text-gray-800">Customize</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="p-4 md:p-8 relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: "300px", height: "auto", aspectRatio: "1/1", maxWidth: "100%" }}>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-full z-10">
              <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                <div className="h-0.5 w-6 bg-black"></div>
                <span className="mx-2 text-sm font-bold">{dimensions.width} inch Width</span>
                <div className="h-0.5 w-6 bg-black"></div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1 transform -translate-y-1/2 flex items-center justify-center h-full z-10">
              <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                <div className="w-0.5 h-6 bg-black"></div>
                <span className="mx-2 text-sm font-bold">{dimensions.height} inch Height</span>
                <div className="w-0.5 h-6 bg-black"></div>
              </div>
            </div>
            <div className="transition-transform duration-300 origin-center flex items-center justify-center" style={{ maxWidth: "100%", maxHeight: "100%" }}>
              <div ref={frameRef} className="relative transition-all h-[500px] w-[500px] transform duration-300 overflow-hidden" style={{
                transform: `rotate(${frameRotation}deg)`,
                aspectRatio: frameRotation === 90 ? `${dimensions.height / dimensions.width}` : `${dimensions.width / dimensions.height}`,
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                padding: "0px",
                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                backgroundColor: "#fff",
                border: selectedFrameMaterial === "Without frame" ? "none" :
                  selectedFrameMaterial === "PVC" ? `${selectedThickness.replace("mm", "")}px solid #000000` :
                  selectedFrameMaterial === "SSPVD" ? `${selectedThickness.replace("mm", "")}px solid #C0C0C0` :
                  selectedFrameMaterial === "Aluminum" ? `${selectedThickness.replace("mm", "")}px solid #A9A9A9` :
                  selectedFrameMaterial === "Aluminum Slim" ? `${Math.max(Number.parseInt(selectedThickness.replace("mm", "")) / 2, 3)}px solid #A9A9A9` :
                  `${selectedThickness.replace("mm", "")}px solid #000000`,
                borderRadius: selectedFrameShape === "Four Corner Round" ? "12px" :
                  selectedFrameShape === "Square" ? "0px" :
                  selectedFrameShape === "Rectangle" ? "0px" :
                  selectedFrameShape === "Oval" ? "50% / 50%" :
                  selectedFrameShape === "Round" ? "50%" :
                  selectedFrameShape === "Top Round" ? "50% 50% 0 0" :
                  selectedFrameShape === "Bottom Round" ? "0 0 50% 50%" : "0px",
              }}>
                <div className="w-full h-full flex items-center justify-center cursor-pointer overflow-hidden" onClick={triggerFileInput} style={{
                  borderRadius: selectedFrameShape === "Four Corner Round" ? "12px" :
                    selectedFrameShape === "Square" ? "0px" :
                    selectedFrameShape === "Rectangle" ? "0px" :
                    selectedFrameShape === "Oval" ? "50%" :
                    selectedFrameShape === "Round" ? "50%" :
                    selectedFrameShape === "Top Round" ? "50% 50% 0 0" :
                    selectedFrameShape === "Bottom Round" ? "0 0 50% 50%" : "0px",
                  clipPath: selectedFrameShape === "Oval" ? "ellipse(50% 50% at 50% 50%)" : "none",
                }}>
                  {uploadedImage ? (
                    <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded preview" className="w-[500px] h-[500px] transition-all duration-300" style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      transform: frameRotation === 90 ? "rotate(-90deg)" : "rotate(0deg)",
                      borderRadius: selectedFrameShape === "Four Corner Round" ? "20px" :
                        selectedFrameShape === "Square" ? "0px" :
                        selectedFrameShape === "Rectangle" ? "0px" :
                        selectedFrameShape === "Oval" ? "50% / 50%" :
                        selectedFrameShape === "Round" ? "50%" :
                        selectedFrameShape === "Top Round" ? "50px 50px 0 0" :
                        selectedFrameShape === "Bottom Round" ? "0 0 50px 50px" : "0px",
                      overflow: "hidden",
                    }} />
                  ) : (
                    <div className="text-center p-4 md:p-12">
                      <Upload className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 text-gray-500" />
                      <p className="text-lg md:text-xl font-medium">Upload Image</p>
                      <p className="text-sm text-red-600 mt-2">Click here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              {uploadedImage && (
                <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors" onClick={rotateFrameAndContent} aria-label="Rotate frame and content">
                  <RotateCw className="w-5 h-5 text-gray-700 cursor-pointer" />
                </button>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-medium mb-1">Geometric Harmony Wall Art</h1>
            <div className="text-sm text-gray-500 mb-4">4.0 (24 reviews)</div>
            <div className="flex items-baseline mb-4">
              <span className="text-xl font-bold">₹{formatPrice(price)}.00</span>
              <span className="text-gray-500 line-through text-sm ml-2">₹{formatPrice(originalPrice)}</span>
              <span className="text-green-600 text-sm ml-2">₹{formatPrice(savings)} ({discountPercent}%)</span>
            </div>
            <p className="text-sm mb-4">Designed by The Oasis (Made in India)</p>
            <ul className="text-sm mb-6 space-y-1">
              <li>
                • Made with High Quality {selectedGlassThickness} {selectedMaterial.toLowerCase()}
                {selectedMaterial === "Glass" ? " sheet" : selectedMaterial === "Canvas" ? "" : " sheet"}
              </li>
              <li>
                • Framed with a {selectedThickness} thick premium{" "}
                {selectedFrameMaterial === "Without frame" ? "borderless design" : `${selectedFrameMaterial.toLowerCase()} frame`}
              </li>
            </ul>

            <div className="mb-8">
              <h2 className="text-lg font-medium mb-3">Select Size (inch)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sizes.map((size, index) => (
                  <button
                    key={size}
                    className={`border rounded-sm py-2 px-4 text-sm ${
                      (selectedSize === size && !isCustomSize) || (!selectedSize && index === 0)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedSize(size);
                      setIsCustomSize(false);
                      const sizeParts = size.replace("inch", "").trim().replace(/\s/g, "").split(/[x×]/);
                      if (sizeParts.length === 2) {
                        const width = Number.parseFloat(sizeParts[0].replace(",", "."));
                        const height = Number.parseFloat(sizeParts[1].replace(",", "."));
                        setDimensions({ width, height });
                        console.log("Size Selected:", size, "Dimensions:", { width, height });
                      }
                    }}
                  >
                    {size}
                  </button>
                ))}
                {customSizes.map((size, index) => (
                  <button
                    key={`custom-${size}`}
                    className={`border rounded-sm py-2 px-4 text-sm ${
                      selectedSize === size ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedSize(size);
                      const sizeParts = size.replace("inch", "").trim().replace(/\s/g, "").split(/[x×]/);
                      if (sizeParts.length === 2) {
                        const width = Number.parseFloat(sizeParts[0].replace(",", "."));
                        const height = Number.parseFloat(sizeParts[1].replace(",", "."));
                        setDimensions({ width, height });
                        console.log("Custom Size Selected:", size, "Dimensions:", { width, height });
                      }
                      setIsCustomSize(false);
                    }}
                  >
                    {size}
                  </button>
                ))}
                <button
                  className={`border rounded-sm py-2 px-4 text-sm ${
                    isCustomSize ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                  }`}
                  onClick={() => setIsCustomSize(true)}
                >
                  Custom Size
                </button>
              </div>
              {isCustomSize && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Width (inch)</label>
                      <input
                        type="number"
                        min="1"
                        step="0.1"
                        value={dimensions.width}
                        onChange={(e) => handleCustomSizeChange("width", e.target.value)}
                        className="w-full border rounded-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Height (inch)</label>
                      <input
                        type="number"
                        min="1"
                        step="0.1"
                        value={dimensions.height}
                        onChange={(e) => handleCustomSizeChange("height", e.target.value)}
                        className="w-full border rounded-sm p-2"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveCustomSize}
                    className="mt-2 bg-gray-200 hover:bg-gray-300 text-black py-1 px-4 rounded-sm text-sm cursor-pointer"
                    disabled={!dimensions.width || !dimensions.height}
                  >
                    Save Custom Size
                  </button>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium mb-3">Product Materials</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {materials.map((material, index) => (
                  <button
                    key={material}
                    className={`border rounded-sm py-2 px-4 text-sm ${
                      selectedMaterial === material || (!selectedMaterial && index === 0)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedMaterial(material)}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            {selectedMaterial === "Glass" && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-3">Glass Thickness</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {glassThicknesses.map((thickness, index) => (
                    <button
                      key={thickness}
                      className={`border rounded-sm py-2 px-4 text-sm ${
                        selectedGlassThickness === thickness || (!selectedGlassThickness && index === 0)
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedGlassThickness(thickness)}
                    >
                      {thickness}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-lg font-medium mb-3">Thickness (mm)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {thicknesses.map((thickness, index) => (
                  <button
                    key={thickness}
                    className={`border rounded-sm py-2 px-4 text-sm ${
                      selectedThickness === thickness || (!selectedThickness && index === 0)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedThickness(thickness)}
                  >
                    {thickness}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium mb-3">Frame Shape</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {frameShapes.filter((shape) => {
                  const isSquareSize = [...sizes, ...customSizes].some(
                    (size) =>
                      size === selectedSize &&
                      size.replace("inch", "").trim().split(/[x×]/).map(Number).every((dim, _, arr) => dim === arr[0])
                  );
                  if (isSquareSize && (shape === "Rectangle" || shape === "Oval")) {
                    return false; // Filter out Rectangle and Oval for square sizes
                  }
                  if (!isSquareSize && (shape === "Square" || shape === "Round")) {
                    return false; // Filter out Square and Round for non-square sizes
                  }
                  return true; // Allow other shapes
                }).map((shape) => (
                  <button
                    key={shape}
                    className={`border rounded-sm py-2 px-4 text-sm ${
                      selectedFrameShape === shape
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedFrameShape(shape)}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium mb-3">Frame Materials</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {frameMaterials.filter((material) => {
                  if (selectedFrameShape === "Square" || selectedFrameShape === "Rectangle") {
                    return true;
                  }
                  return material !== "PVC" && material !== "Aluminum Slim";
                }).map((material, index) => (
                  <button
                    key={material}
                    className={`border rounded-sm py-2 px-4 text-sm ${
                      selectedFrameMaterial === material || (!selectedFrameMaterial && index === 0)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedFrameMaterial(material)}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium mb-3">Write Instructions</h2>
              <textarea
                className="w-full border rounded-sm p-3 h-32 resize-none"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Add any special instructions here..."
              />
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-black rounded-sm text-white py-3 font-medium transition-colors cursor-pointer"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}