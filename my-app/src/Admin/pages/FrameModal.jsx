import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, userToken } from "../../Components/Variable";
import toast from "react-hot-toast";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

const frameShapes = [
  { id: 1, name: "Four Corner Round" },
  { id: 2, name: "Square" },
  { id: 3, name: "Rectangle" },
  { id: 4, name: "Oval" },
  { id: 5, name: "Round" },
  { id: 6, name: "Top Round" },
  { id: 7, name: "Bottom Round" },
];

const FrameModal = ({ isOpen, onClose, frame, refreshFrames }) => {
  // Parse array fields from JSON strings
  const parseArrayField = (field) => {
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch (e) {
        console.error(`Error parsing ${field}:`, e);
        return [];
      }
    }
    return field || [];
  };

  const [formData, setFormData] = useState({
    name: frame?.name || "",
    basePrice: frame?.basePrice || "",
    description: frame?.description || "",
    colors: parseArrayField(frame?.colors),
    materialId: frame?.materialId || "",
    frameMaterialId: frame?.frameMaterialId || "",
    frameShape: frame?.frameShape || "",

    weight: frame?.weight || "",
    origin: frame?.origin || "",
    careInstruction: parseArrayField(frame?.careInstruction),
    includes: parseArrayField(frame?.includes),
    isNewArrival: frame?.isNewArrival || false,
    isOffer: frame?.isOffer || false,
    sizes: frame?.frameSizes
      ? frame.frameSizes.map((size) => ({
          sizeId: size.size?.sizeId || size.sizeId,
          price: size.price || "",
          offer_price: size.offer_price || "",
          total_qty: size.total_qty || "",
          remained_qty: size.remained_qty || size.total_qty || "",
          purchased_qty: size.purchased_qty || "0",
        }))
      : [
          {
            sizeId: "",
            price: "",
            offer_price: "",
            total_qty: "",
            remained_qty: "",
            purchased_qty: "0",
          },
        ],
    images: [], // New images to upload
    existingImages: frame?.images || [], // Existing images from the frame
  });

  const [materials, setMaterials] = useState([]);
  const [frameMaterial, setFrameMaterial] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("Basic");
  const userData = userToken();
  const token = userData?.token;

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
        toast.error("Failed to load dropdown options");
      }
    };

    fetchDropdownData();
  }, []);

  const handleArrayInput = (field, value, index) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const addNewSize = () => {
    setFormData({
      ...formData,
      sizes: [
        ...formData.sizes,
        {
          sizeId: "",
          price: "",
          offer_price: "",
          total_qty: "",
          remained_qty: "",
          purchased_qty: "0",
        },
      ],
    });
  };

  const removeSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  const removeExistingImage = (index) => {
    const newExistingImages = formData.existingImages.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, existingImages: newExistingImages });
  };

  useEffect(() => {
    if (isOpen) {
      if (frame) {
        setFormData({
          name: frame?.name || "",
          basePrice: frame?.basePrice || "",
          description: frame?.description || "",
          colors: parseArrayField(frame?.colors),
          materialId: frame?.materialId || "",
          frameMaterialId: frame?.frameMaterialId || "",
          frameShape: frame?.frameShape || "",
          weight: frame?.weight || "",
          origin: frame?.origin || "",
          careInstruction: parseArrayField(frame?.careInstruction),
          includes: parseArrayField(frame?.includes),
          isNewArrival: frame?.isNewArrival || false,
          isOffer: frame?.isOffer || false,
          sizes: frame?.frameSizes
            ? frame.frameSizes.map((size) => ({
                sizeId: size.size?.sizeId || size.sizeId,
                price: size.price || "",
                offer_price: size.offer_price || "",
                total_qty: size.total_qty || "",
                remained_qty: size.remained_qty || size.total_qty || "",
                purchased_qty: size.purchased_qty || "0",
              }))
            : [
                {
                  sizeId: "",
                  price: "",
                  offer_price: "",
                  total_qty: "",
                  remained_qty: "",
                  purchased_qty: "0",
                },
              ],
          images: [], // New images to upload
          existingImages: frame?.images || [],
        });
      } else {
        // Jab add new frame ho tab blank form
        setFormData({
          name: "",
          basePrice: "",
          description: "",
          colors: [],
          materialId: "",
          frameMaterialId: "",
          frameShape: "",
          weight: "",
          origin: "",
          careInstruction: [],
          includes: [],
          isNewArrival: false,
          isOffer: false,
          sizes: [
            {
              sizeId: "",
              price: "",
              offer_price: "",
              total_qty: "",
              remained_qty: "",
              purchased_qty: "0",
            },
          ],
          images: [],
          existingImages: [],
        });
      }
    }
  }, [isOpen, frame]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formPayload = new FormData();

    // Append basic fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "sizes" || key === "images" || key === "existingImages")
        return;
      if (Array.isArray(value)) {
        formPayload.append(key, JSON.stringify(value));
      } else {
        formPayload.append(key, value);
      }
    });

    // Append sizes
    formPayload.append("sizes", JSON.stringify(formData.sizes));

    // Append new images
    formData.images.forEach((image) => {
      formPayload.append("images", image);
    });

    // Append existing images (send their IDs or URLs)
    formPayload.append(
      "existingImages",
      JSON.stringify(formData.existingImages.map((img) => img.imageId))
    );

    // Debug: Log FormData contents
    for (let [key, value] of formPayload.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const endpoint = frame
        ? `${API_URL}/frame/updateframe/${frame.frameId}`
        : `${API_URL}/frame/createframe`;

      const response = await axios({
        method: frame ? "put" : "post",
        url: endpoint,
        data: formPayload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`Frame ${frame ? "updated" : "added"} successfully!`);
      refreshFrames();
      onClose();
    } catch (error) {
      console.error(
        "Error saving frame:",
        error.response?.data || error.message
      );
      toast.error(
        `Failed to ${frame ? "update" : "add"} frame: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {frame ? "Edit Frame" : "Add New Frame"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {["Basic", "Sizes", "Images", "Details"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded capitalize ${
                activeSection === section
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information Section */}
          {activeSection === "Basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Frame Name*
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              
                <div className="md:col-span-1">
                  {" "}
                  {/* Full width on all screens */}
                  <label className="block text-sm font-medium mb-1">
                    Base Price* (₹)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basePrice: parseFloat(e.target.value),
                      })
                    }
                    placeholder="Enter base price"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    * Base Price For All The Sizes
                  </p>
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">
                  Colors*
                </label>
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={color}
                      onChange={(e) =>
                        handleArrayInput("colors", e.target.value, index)
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField("colors", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("colors")}
                  className="text-indigo-600 flex items-center gap-1 mt-2"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Add Color
                </button>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description*
                </label>
                <textarea
                  rows="3"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter frame description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Material*
                </label>
                <select
                  className="border rounded-md p-1"
                  value={formData.materialId}
                  onChange={(e) =>
                    setFormData({ ...formData, materialId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Product Material</option>
                  {materials.map((material) => (
                    <option
                      key={material.materialId}
                      value={material.materialId}
                    >
                      {material.materialName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Frame Material*
                </label>
                <select
                  className="border rounded-md p-1"
                  value={formData.frameMaterialId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frameMaterialId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Frame Material</option>
                  {frameMaterial.map((shape) => (
                    <option
                      key={shape.frameMaterialId}
                      value={shape.frameMaterialId}
                    >
                      {shape.materialName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Frame Shape*
                </label>
                <select
                  className="border rounded-md p-1"
                  value={formData.frameShape}
                  onChange={(e) =>
                    setFormData({ ...formData, frameShape: e.target.value })
                  }
                  required
                >
                  <option value="">Select Frame Shape</option>
                  {frameShapes.map((shape) => (
                    <option key={shape.id} value={shape.name}>
                      {shape.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Sizes & Pricing Section */}
          {activeSection === "Sizes" && (
            <div className="space-y-4">
              {formData.sizes.map((size, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Size*
                      </label>
                      <select
                        value={size.sizeId}
                        onChange={(e) =>
                          handleSizeChange(index, "sizeId", e.target.value)
                        }
                        required
                      >
                        <option value="">Select Size</option>
                        {sizes.map((size) => (
                          <option key={size.sizeId} value={size.sizeId}>
                            {size.width} x {size.height} inch
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Price*
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={size.price}
                        onChange={(e) =>
                          handleSizeChange(index, "price", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Offer Price
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={size.offer_price}
                        onChange={(e) =>
                          handleSizeChange(index, "offer_price", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Stock Quantity*
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={size.total_qty}
                        onChange={(e) =>
                          handleSizeChange(index, "total_qty", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    Remove Size
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addNewSize}
                className="text-indigo-600 flex items-center gap-1"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Add New Size Variant
              </button>
            </div>
          )}

          {/* Images Section */}
          {activeSection === "Images" && (
            <div>
              <label className="block text-sm font-medium mb-2">Images</label>
              <div className="grid grid-cols-3 gap-4">
                {/* Existing Images */}
                {formData.existingImages.map((image, index) => (
                  <div key={index} className="relative border p-2 rounded">
                    <img
                      src={`${API_URL.replace(/\/$/, "")}${image.imageUrl}`}
                      alt={`Existing ${index}`}
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {/* New Images */}
                {formData.images.map((image, index) => (
                  <div key={index} className="relative border p-2 rounded">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...formData.images];
                        newImages.splice(index, 1);
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFormData({
                        ...formData,
                        images: [...formData.images, ...files],
                      });
                    }}
                  />
                  <PlusCircleIcon className="h-8 w-8 text-gray-400" />
                </label>
              </div>
            </div>
          )}

          {/* Additional Details Section */}
          {activeSection === "Details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Origin</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.origin}
                  onChange={(e) =>
                    setFormData({ ...formData, origin: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Care Instructions
                </label>
                {formData.careInstruction.map((instruction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={instruction}
                      onChange={(e) =>
                        handleArrayInput(
                          "careInstruction",
                          e.target.value,
                          index
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField("careInstruction", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("careInstruction")}
                  className="text-indigo-600 flex items-center gap-1"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Add Instruction
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Includes
                </label>
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={item}
                      onChange={(e) =>
                        handleArrayInput("includes", e.target.value, index)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField("includes", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("includes")}
                  className="text-indigo-600 flex items-center gap-1"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Add Included Item
                </button>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isNewArrival: e.target.checked,
                      })
                    }
                  />
                  New Arrival
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isOffer}
                    onChange={(e) =>
                      setFormData({ ...formData, isOffer: e.target.checked })
                    }
                  />
                  Special Offer
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Frame"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FrameModal;
