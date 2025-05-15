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

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ materialName: "", multiplier: "" });
  const userData = userToken();

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/material/getallmaterial`);
      console.log("materials",response.data);
      
      setMaterials(response.data); // Updated to match controller response
    } catch (error) {
      console.error("Error fetching materials:", error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
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

      if (currentMaterial) {
        // Update material
        await axios.put(
          `${API_URL}/material/updatematerial/${currentMaterial.materialId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );
        toast.success("Material updated!");
      } else {
        // Create new material
        await axios.post(`${API_URL}/material/creatematerial`, payload, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        toast.success("Material created!");
      }
      fetchMaterials();
      setIsModalOpen(false);
      setFormData({ materialName: "", multiplier: "" });
      setCurrentMaterial(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error saving material");
    }
  };

  // Delete material
  const handleDelete = async (materialId) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await axios.delete(`${API_URL}/material/deletematerial/${materialId}`, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        toast.success("Material deleted!");
        fetchMaterials();
      } catch (error) {
        console.log(error);
        toast.error("Error deleting material");
      }
    }
  };

  // Filter materials
  const filteredMaterials = materials?.filter(
    (material) =>
      material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.multiplier.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Material Management</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search materials or multiplier..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setCurrentMaterial(null);
              setFormData({ materialName: "", multiplier: "" });
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Material</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredMaterials?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No materials found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material Name
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
              {filteredMaterials?.map((material) => (
                <tr key={material.materialId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {material.materialName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {material.multiplier.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setCurrentMaterial(material);
                        setFormData({
                          materialName: material.materialName,
                          multiplier: material.multiplier.toString(),
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.materialId)}
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

      {/* Material Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentMaterial ? "Edit Material" : "Add New Material"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material Name
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
                  {currentMaterial ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;