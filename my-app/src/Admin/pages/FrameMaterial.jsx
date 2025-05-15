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

const FrameMaterials = () => {
  const [frameMaterials, setFrameMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFrameMaterial, setCurrentFrameMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ materialName: "", multiplier: "" });
  const userData = userToken();

  // Fetch frame materials
  const fetchFrameMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/framematerial/getallframemat`);
      setFrameMaterials(response.data); // Updated to match controller response
    } catch (error) {
      console.error("Error fetching frame materials:", error);
      setFrameMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrameMaterials();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        materialName: formData.materialName,
        multiplier: parseFloat(formData.multiplier) || 1 // Default to 1 if empty
      };

      // Validate multiplier
      if (payload.multiplier <= 0) {
        toast.error("Multiplier must be a positive number");
        return;
      }

      if (currentFrameMaterial) {
        // Update frame material
        await axios.put(
          `${API_URL}/framematerial/updatematerial/${currentFrameMaterial.frameMaterialId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );
        toast.success("Frame Material updated!");
      } else {
        // Create new frame material
        await axios.post(`${API_URL}/framematerial/createframemat`, payload, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        toast.success("Frame Material created!");
      }
      fetchFrameMaterials();
      setIsModalOpen(false);
      setFormData({ materialName: "", multiplier: "" });
      setCurrentFrameMaterial(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error saving frame material");
    }
  };

  // Delete frame material
  const handleDelete = async (frameMaterialId) => {
    if (window.confirm("Are you sure you want to delete this frame material?")) {
      try {
        await axios.delete(`${API_URL}/framematerial/deletematerial/${frameMaterialId}`, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        toast.success("Frame Material deleted!");
        fetchFrameMaterials();
      } catch (error) {
        console.log(error);
        toast.error("Error deleting frame material");
      }
    }
  };

  // Filter frame materials
  const filteredFrameMaterials = frameMaterials?.filter(
    (material) =>
      material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.multiplier.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Frame Material Management</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search frame materials or multiplier..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setCurrentFrameMaterial(null);
              setFormData({ materialName: "", multiplier: "" });
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Frame Material</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredFrameMaterials?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No frame materials found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frame Material Name
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
              {filteredFrameMaterials.map((frameMaterial) => (
                <tr key={frameMaterial.frameMaterialId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {frameMaterial.materialName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {frameMaterial.multiplier.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setCurrentFrameMaterial(frameMaterial);
                        setFormData({
                          materialName: frameMaterial.materialName,
                          multiplier: frameMaterial.multiplier.toString(),
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(frameMaterial.frameMaterialId)}
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

      {/* Frame Material Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentFrameMaterial ? "Edit Frame Material" : "Add New Frame Material"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frame Material Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.materialName}
                  onChange={(e) =>
                    setFormData({ ...formData, materialName: e.target.value })
                  }
                  required
                />
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
                  {currentFrameMaterial ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameMaterials;