import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { API_URL, userToken } from "../../Components/Variable";
import toast from "react-hot-toast";

const FrameSizes = () => {
  const [frameSizes, setFrameSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFrameSize, setCurrentFrameSize] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ width: "", height: "", multiplier: "" });
  const userData = userToken();

  // Fetch frame sizes
  const fetchFrameSizes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/size/getallsize`);
      console.log(response.data);
      setFrameSizes(response.data.sizes);
    } catch (error) {
      console.error("Error fetching frame sizes:", error);
      setFrameSizes([]);
    } finally {
      setLoading(false);
    }
  };
  console.log("framesizes", frameSizes);

  useEffect(() => {
    fetchFrameSizes();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        multiplier: parseFloat(formData.multiplier) || 1, // Default to 1 if empty
      };

      // Validate multiplier
      if (payload.multiplier <= 0) {
        toast.error("Multiplier must be a positive number");
        return;
      }

      if (currentFrameSize) {
        // Update frame size
        await axios.put(
          `${API_URL}/size/updatesize/${currentFrameSize.sizeId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );
        toast.success("Frame Size updated!");
      } else {
        // Create new frame size
        await axios.post(`${API_URL}/size/createsize`, payload, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        toast.success("Frame Size created!");
      }
      fetchFrameSizes();
      setIsModalOpen(false);
      setFormData({ width: "", height: "", multiplier: "" });
      setCurrentFrameSize(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error saving frame size");
    }
  };

  // Delete frame size
  const handleDelete = async (sizeId) => {
    if (window.confirm("Are you sure you want to delete this frame size?")) {
      try {
        await axios.delete(`${API_URL}/size/deletesize/${sizeId}`, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        toast.success("Frame Size deleted!");
        fetchFrameSizes();
      } catch (error) {
        console.log(error);
        toast.error("Error deleting frame size");
      }
    }
  };

  // Filter frame sizes
  const filteredFrameSizes = frameSizes?.filter(size =>
    `${size.width}x${size.height}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    size.multiplier.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Frame Size Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search sizes (e.g., 17.5x11.5) or multiplier..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setCurrentFrameSize(null);
              setFormData({ width: "", height: "", multiplier: "" });
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Size</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredFrameSizes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No frame sizes found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Multiplier
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFrameSizes?.map((size) => (
                <tr key={size.sizeId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-indigo-600">
                          Size:
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                          {size.width} × {size.height}
                          <span className="text-gray-500 ml-1 text-xs">
                            inches
                          </span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {size.multiplier.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setCurrentFrameSize(size);
                        setFormData({
                          width: size.width.toString(),
                          height: size.height.toString(),
                          multiplier: size.multiplier.toString(),
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(size.sizeId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Size Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentFrameSize ? "Edit Frame Size" : "Add New Frame Size"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (inches)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.width}
                    onChange={(e) =>
                      setFormData({ ...formData, width: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (inches)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Multiplier
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.multiplier}
                  onChange={(e) =>
                    setFormData({ ...formData, multiplier: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {currentFrameSize ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameSizes;