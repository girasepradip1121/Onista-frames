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

const Thicknesses = () => {
  const [thicknesses, setThicknesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentThickness, setCurrentThickness] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ thicknessValue: "", multiplier: "" });
  const userData = userToken();

  // Fetch thicknesses
  const fetchThicknesses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/thickness/getallthickness`);
      setThicknesses(response.data.thicknesses || []);
    } catch (error) {
      console.error("Error fetching thicknesses:", error);
      setThicknesses([]);
      toast.error("Failed to fetch thicknesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThicknesses();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        thicknessValue: formData.thicknessValue.trim(),
        multiplier: parseFloat(formData.multiplier) || 1, // Default to 1 if empty
      };

      // Validate inputs
      if (!payload.thicknessValue) {
        toast.error("Thickness value is required");
        return;
      }
      if (payload.multiplier <= 0) {
        toast.error("Multiplier must be a positive number");
        return;
      }

      if (currentThickness) {
        // Update thickness
        await axios.put(
          `${API_URL}/thickness/updatethickness/${currentThickness.thicknessId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );
        toast.success("Thickness updated!");
      } else {
        // Create new thickness
        await axios.post(`${API_URL}/thickness/addthickness`, payload, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        toast.success("Thickness created!");
      }
      fetchThicknesses();
      setIsModalOpen(false);
      setFormData({ thicknessValue: "", multiplier: "" });
      setCurrentThickness(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error saving thickness");
    }
  };

  // Delete thickness
  const handleDelete = async (thicknessId) => {
    if (window.confirm("Are you sure you want to delete this thickness?")) {
      try {
        await axios.delete(`${API_URL}/thickness/deletethickness/${thicknessId}`, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        toast.success("Thickness deleted!");
        fetchThicknesses();
      } catch (error) {
        toast.error(error.response?.data?.error || "Error deleting thickness");
      }
    }
  };

  // Filter thicknesses
  const filteredThicknesses = thicknesses?.filter(
    (thickness) =>
      thickness.thicknessValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thickness.multiplier.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Thickness Management</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search thicknesses (e.g., 3mm) or multiplier..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setCurrentThickness(null);
              setFormData({ thicknessValue: "", multiplier: "" });
              setIsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Thickness</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredThicknesses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No thicknesses found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thickness
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
              {filteredThicknesses?.map((thickness) => (
                <tr key={thickness.thicknessId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-indigo-600">
                          Thickness:
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                          {thickness.thicknessValue}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {thickness.multiplier.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setCurrentThickness(thickness);
                        setFormData({
                          thicknessValue: thickness.thicknessValue,
                          multiplier: thickness.multiplier.toString(),
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(thickness.thicknessId)}
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

      {/* Thickness Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentThickness ? "Edit Thickness" : "Add New Thickness"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thickness Value (e.g., 3mm)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.thicknessValue}
                  onChange={(e) =>
                    setFormData({ ...formData, thicknessValue: e.target.value })
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
                  {currentThickness ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Thicknesses;