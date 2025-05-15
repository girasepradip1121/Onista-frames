import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ArrowPathIcon,
  ShoppingBagIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { API_URL, userToken } from "../../Components/Variable";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import Login from "../../Components/Login";
import Signup from "../../Components/Signup";

const Dashboard = () => {
  const [stats, setStats] = useState({
    frames: 0,
    orders: 0,
    contacts: 0,
    users: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showLogin, setShowLogin] = useState(false); // State for login popup
  const [showSignup, setShowSignup] = useState(false); // State for signup popup

  // Memoize userData and token to prevent new objects on every render
  const userData = useMemo(() => userToken(), []);
  const token = useMemo(() => userData?.token, [userData]);
  const navigate = useNavigate();

  // Constants for stats
  const STATS_CONFIG = [
    {
      name: "Users",
      key: "users",
      icon: UserGroupIcon,
      color: "bg-pink-100 text-pink-600",
      link: "/admin/users",
    },
    {
      name: "Frames",
      key: "frames",
      icon: ShoppingBagIcon,
      color: "bg-indigo-100 text-indigo-600",
      link: "/admin/frame",
    },
    {
      name: "Orders",
      key: "orders",
      icon: ClipboardDocumentListIcon,
      color: "bg-red-100 text-red-600",
      link: "/admin/orders",
    },
    {
      name: "Contacts",
      key: "contacts",
      icon: ChatBubbleLeftRightIcon,
      color: "bg-yellow-100 text-yellow-600",
      link: "/admin/contact",
    },
  ];

  // Toggle signup popup and close login popup
  const toggleSignupPopup = useCallback(() => {
    setShowLogin(false);
    setShowSignup(true);
  }, []);

  // Toggle login popup and close signup popup
  const toggleLoginPopup = useCallback(() => {
    setShowSignup(false);
    setShowLogin(true);
  }, []);

  // Handle successful login
  const handleLoginSuccess = useCallback(async () => {
    setShowLogin(false);
    setShowSignup(false);
    const updatedUserData = userToken(); // Refresh user data after login
    if (updatedUserData?.role !== "admin") {
      toast.error("Access denied: Admins only");
      navigate("/");
      return;
    }
    await fetchDashboardData(); // Fetch dashboard data after login
  }, [navigate]); // Removed fetchDashboardData from dependencies to avoid redefinition

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) return; // Skip fetch if no token
    try {
      setLoading(true);
      setError(null);

      const [frameRes, orderRes, contactRes, userRes] =
        await Promise.allSettled([
          axios.get(`${API_URL}/frame/getallframes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/order/getallorders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/contact/getall`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/user/getall`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const newStats = {
        frames:
          frameRes.status === "fulfilled" &&
          frameRes.value.data?.data?.length >= 0
            ? frameRes.value.data.data.length
            : 0,
        orders:
          orderRes.status === "fulfilled" &&
          orderRes.value.data?.data?.length >= 0
            ? orderRes.value.data.data.length
            : 0,
        contacts:
          contactRes.status === "fulfilled" &&
          contactRes.value.data?.length >= 0
            ? contactRes.value.data.length
            : 0,
        users:
          userRes.status === "fulfilled" && userRes.value.data?.length >= 0
            ? userRes.value.data.length
            : 0,
      };

      setStats(newStats);

      const contactData =
        contactRes.status === "fulfilled" && Array.isArray(contactRes.value.data)
          ? contactRes.value.data
          : [];
      const sortedContacts = [...contactData]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentInquiries(sortedContacts);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Check access and show login popup if not logged in
  useEffect(() => {
    if (!token && !showLogin) {
      setShowLogin(true); // Only set if popup isn't already open
      return;
    }
    if (token && userData?.role !== "admin") {
      toast.error("Access denied: Admins only");
      navigate("/");
    }
  }, [token, userData, navigate, showLogin]); // Added showLogin to prevent repeated setShowLogin

  // Initial fetch and auto-refresh
  useEffect(() => {
    if (token && userData?.role === "admin") {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [fetchDashboardData, token, userData]);

  // Debounced refresh
  const refreshData = useCallback(
    debounce(async () => {
      if (token && userData?.role === "admin") {
        await fetchDashboardData();
      }
    }, 500),
    [fetchDashboardData, token, userData]
  );

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "--";
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  }, []);

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white shadow rounded-lg animate-pulse">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md p-3 bg-gray-200">
            <div className="h-6 w-6 bg-gray-300 rounded" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  );

  // Skeleton loader for inquiries
  const SkeletonInquiry = () => (
    <li className="px-4 py-4 sm:px-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex items-center">
          <div className="h-4 w-4 bg-gray-200 rounded mr-1" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="mt-2 flex items-center">
          <div className="h-4 w-4 bg-gray-200 rounded mr-1" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
      <div className="mt-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mt-1" />
      </div>
    </li>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          {token && userData?.role === "admin" && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Last updated: {formatDate(lastUpdated)}
              </span>
              <button
                onClick={refreshData}
                disabled={loading}
                className={`p-2 rounded-full ${
                  loading
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                } transition-colors`}
                aria-label="Refresh dashboard data"
                title="Refresh data"
              >
                <ArrowPathIcon
                  className={`h-5 w-5 text-gray-600 ${
                    loading ? "animate-spin" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </header>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            <p>{error}</p>
            <button
              onClick={refreshData}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-200 hover:bg-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <section
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Dashboard statistics"
        >
          {loading && !lastUpdated
            ? Array(4)
                .fill()
                .map((_, index) => <SkeletonCard key={index} />)
            : STATS_CONFIG.map((stat) => (
                <Link
                  to={stat.link}
                  key={stat.name}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}
                      >
                        <stat.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {error ? "--" : stats[stat.key]}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </section>

        {/* Charts and Activity Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Inquiries */}
          <section
            className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2"
            aria-label="Recent inquiries"
          >
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Recent Inquiries
              </h2>
              <span className="text-sm text-gray-500">Last 5 inquiries</span>
            </div>
            <div className="bg-white overflow-hidden">
              {loading && !lastUpdated ? (
                <ul className="divide-y divide-gray-200">
                  {Array(5)
                    .fill()
                    .map((_, index) => (
                      <SkeletonInquiry key={index} />
                    ))}
                </ul>
              ) : recentInquiries.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recentInquiries.map((inquiry) => (
                    <li
                      key={inquiry.inquiryId}
                      className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {inquiry.inquiryType || "General"} Inquiry
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              inquiry.status === "new"
                                ? "bg-green-100 text-green-800"
                                : inquiry.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {inquiry.status || "new"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex items-center">
                          <UserIcon
                            className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1"
                            aria-hidden="true"
                          />
                          <p className="text-sm text-gray-500">
                            {inquiry.name || "Anonymous"}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <CalendarIcon
                            className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1"
                            aria-hidden="true"
                          />
                          {formatDate(inquiry.createdAt)}
                        </div>
                      </div>
                      <div className="mt-2 flex items-start">
                        <ChatBubbleLeftIcon
                          className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1 mt-1"
                          aria-hidden="true"
                        />
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {inquiry.message || "No message provided"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center flex-wrap gap-3">
                        <div className="flex items-center">
                          <EnvelopeIcon
                            className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1"
                            aria-hidden="true"
                          />
                          <Link
                            to={`mailto:${inquiry.email}`}
                            className="text-xs text-blue-600 hover:underline"
                            aria-label={`Email ${inquiry.email}`}
                          >
                            {inquiry.email || "N/A"}
                          </Link>
                        </div>
                        {/* <div className="flex items-center">
                          <PhoneIcon
                            className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1"
                            aria-hidden="true"
                          />
                          <Link
                            to={`tel:${inquiry.phone}`}
                            className="text-xs text-gray-600 hover:underline"
                            aria-label={`Call ${inquiry.phone}`}
                          >
                            {inquiry.phone || "N/A"}
                          </Link>
                        </div> */}
                        
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No recent inquiries</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section
            className="bg-white shadow rounded-lg overflow-hidden"
            aria-label="Quick actions"
          >
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {STATS_CONFIG.map((action) => (
                  <Link
                    key={action.name}
                    to={action.link}
                    className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label={`Manage ${action.name.toLowerCase()}`}
                  >
                    <div className="flex items-center">
                      <action.icon
                        className={`h-5 w-5 ${action.color.split(" ")[1]} mr-3`}
                        aria-hidden="true"
                      />
                      <span>Manage {action.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Login Popup */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          toggSigupPopup={toggleSignupPopup}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Signup Popup */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          toggleLoginPopup={toggleLoginPopup}
        />
      )}
    </>
  );
};

export default Dashboard;