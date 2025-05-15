import React, { useState, useEffect } from "react";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { API_URL, userToken } from "../../Components/Variable";
import toast from "react-hot-toast";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10); // Adjustable
  const userData = userToken();

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/review/getallreviews`, {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      });
      console.log("reviews", response.data.reviews);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Delete review
  const handleDelete = async (ratingId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`${API_URL}/review/deletereview/${ratingId}`, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        toast.success("Review deleted!");
        fetchReviews();
        // Reset to first page if current page becomes empty
        setCurrentPage(1);
      } catch (error) {
        toast.error(error.response?.data?.error || "Error deleting review");
      }
    }
  };

  // Filter reviews
  const filteredReviews = reviews?.filter(
    (review) =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.rating.toString().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show 5 page numbers at a time
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Review Management</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by user, rating, or title..."
            className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-base sm:text-lg">No reviews found</p>
        </div>
      ) : (
        <>
          {/* Desktop: Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    Comment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReviews?.map((review) => (
                  <tr key={review.ratingId}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700 text-sm">
                        {review.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700 text-sm">
                        {review.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700 text-sm">
                        {review.rating}/5
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 truncate max-w-full">
                        {review.review}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(review.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(review.ratingId)}
                        className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors"
                        aria-label="Delete review"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Card View */}
          <div className="md:hidden space-y-4">
            {currentReviews?.map((review) => (
              <div
                key={review.ratingId}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {review.name}
                    </div>
                    <div className="text-sm text-gray-600">{review.title}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(review.ratingId)}
                    className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors"
                    aria-label="Delete review"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="text-sm text-gray-900 mb-2">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {review.rating}/5
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">{review.review}</div>
                <div className="text-xs text-gray-500">
                  {formatDate(review.createdAt)}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Previous
              </button>

              {/* Mobile: Show only current page and total */}
              <div className="md:hidden flex items-center text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>

              {/* Desktop: Show page numbers */}
              <div className="hidden md:flex gap-1">
                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === number
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reviews;