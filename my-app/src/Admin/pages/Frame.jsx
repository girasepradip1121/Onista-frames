import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, RefreshCw, Star } from "lucide-react";
import axios from "axios";
import FrameModal from "./FrameModal";
import { API_URL, userToken } from "../../Components/Variable";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Frame = () => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12);
  const userData = userToken();
  const token = userData?.token;

  // Fetch frames
  const fetchFrames = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/frame/getallframes`, {
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('response',response.data.data);
      
      setFrames(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching frames:", error);
      toast.error("Failed to fetch frames");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrames();
  }, []);

  // Search handling with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFrames(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Delete frame
  const handleDelete = async (frameId) => {
    if (window.confirm("Are you sure you want to delete this frame?")) {
      try {
        await axios.delete(`${API_URL}/frame/deleteframe/${frameId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Frame deleted successfully");
        fetchFrames(currentPage);
      } catch (error) {
        console.error("Error deleting frame:", error);
        toast.error("Failed to delete frame");
      }
    }
  };

  // Calculate average rating
  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setLoading(true);
      fetchFrames(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">Frame Collection</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search frames..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setCurrentFrame(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Add New Frame
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-12 h-12 text-gray-400 animate-spin" />
        </div>
      ) : frames.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No frames found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {frames.map((frame) => (
              <div
                key={frame.frameId}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Link to={`${frame.frameId}`}>
                  <div className="relative aspect-square">
                    <img
                      src={`${API_URL}/${frame?.images[0]?.imageUrl}`}
                      alt={frame.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="p-4 space-y-2">
                  <h4 className="text-xl font-bold uppercase text-gray-800 truncate">{frame.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-blue-600">₹{frame?.basePrice}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentFrame(frame);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(frame.frameId)}
                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round((frame.averageRating))
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {(frame.averageRating)} ({frame.totalRatings || 0} reviews)
                    </span>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-all duration-200"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNumber = i + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-all duration-200`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-all duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <FrameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        frame={currentFrame}
        refreshFrames={fetchFrames}
      />
    </div>
  );
};

export default Frame;