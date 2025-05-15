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
import NewsModal from "./NewsModal";

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12);
  const userData = userToken();
  const token = userData?.token;

  // Fetch news
  const fetchNews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/news/getallnews`, {
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm,
        },
      });

      // Normalize news data
      const normalizedNews = (response.data.data || []).map((newsItem) => ({
        newsId: newsItem.newsId || "",
        title: newsItem.title || "",
        author: newsItem.author || "",
        sections: Array.isArray(newsItem.sections)
          ? newsItem.sections.map((section) => ({
              ...section,
              bullets: typeof section.bullets === "string" && section.bullets
                ? JSON.parse(section.bullets)
                : Array.isArray(section.bullets)
                ? section.bullets
                : [],
            }))
          : [],
        image: newsItem.image || "",
        createdAt: newsItem.createdAt || "",
      }));

      console.log("Normalized News:", normalizedNews); // Debug
      setNews(normalizedNews);
      setTotalPages(response.data.pagination.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Search handling
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchNews(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Delete news
  const handleDelete = async (newsId) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        await axios.delete(`${API_URL}/news/deletenews/${newsId}`);
        toast.success("News Deleted");
        fetchNews(currentPage);
      } catch (error) {
        console.error("Error deleting news:", error);
        toast.error("Failed to delete news");
      }
    }
  };

  // Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setLoading(true);
      fetchNews(page);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">News Management</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search news..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            onClick={() => {
              setCurrentNews(null);
              setIsModalOpen(true);
            }}
            className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            <PlusIcon className="w-5 h-5" />
            Add New News
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="w-12 h-12 text-gray-400 animate-spin" />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No news found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {news.map((newsItem) => (
              <div
                key={newsItem.newsId}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-square">
                  {newsItem.image ? (
                    <img
                      src={`${API_URL}/${newsItem.image}`}
                      alt={newsItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-xl font-bold text-gray-800">
                    {newsItem.title}
                  </h4>
                  <p className="text-sm text-gray-600">By {newsItem.author}</p>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {new Date(newsItem.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentNews(newsItem);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(newsItem.newsId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
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
                className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => {
                const pageNumber = i + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 2 &&
                    pageNumber <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === pageNumber
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
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
                className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        news={currentNews}
        refreshNews={fetchNews}
      />
    </div>
  );
};

export default NewsManagement;