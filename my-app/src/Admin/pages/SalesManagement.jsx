// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Bar, Pie } from "react-chartjs-2";
// import { Chart, registerables } from "chart.js";
// import { DataGrid } from "@mui/x-data-grid";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { toast } from "react-hot-toast";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { API_URL, userToken } from "../../Components/Variable"; // Adjust path as needed

// Chart.register(...registerables);

// // StatCard Component
// const StatCard = ({ title, value, emoji }) => (
//   <div className="bg-white p-4 rounded-lg shadow flex items-center">
//     <span className="text-2xl mr-3">{emoji}</span>
//     <div>
//       <h3 className="text-sm text-gray-500">{title}</h3>
//       <p className="text-xl font-bold">{value}</p>
//     </div>
//   </div>
// );

// // TopProductCard Component
// const TopProductCard = ({ name, image, totalSold, totalRevenue }) => (
//   <div className="bg-white p-4 rounded-lg shadow flex items-center">
//     <img
//       src={image ? `${API_URL}/${image}` : "/default-product.png"}
//       alt={name}
//       className="h-12 w-12 object-cover rounded mr-3"
//     />
//     <div>
//       <p className="font-medium">{name}</p>
//       <p className="text-sm text-gray-500">Sold: {totalSold}</p>
//       <p className="text-sm text-gray-500">Revenue: ₹{totalRevenue}</p>
//     </div>
//   </div>
// );

// const SalesManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [analytics, setAnalytics] = useState({
//     totalSales: 0,
//     totalOrders: 0,
//     monthlyTrend: [],
//     statusDistribution: [],
//     topProducts: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, endDate] = dateRange;
//   const token = userToken()?.token;

//   const statusOptions = [
//     { value: "all", label: "All Statuses" },
//     { value: 1, label: "Pending" },
//     { value: 2, label: "Processing" },
//     { value: 3, label: "Shipped" },
//     { value: 4, label: "Delivered" },
//     { value: 5, label: "Cancelled" },
//   ];

//   const columns = [
//     {
//       field: "orderId",
//       headerName: "Order ID",
//       width: 120,
//       renderCell: ({ value }) => `#${value}`,
//     },
//     {
//       field: "customer",
//       headerName: "Customer",
//       width: 200,
//       renderCell: ({ row }) => (
//         <div>
//           <p className="font-medium">
//             {row.firstName || "N/A"} {row.lastName || ""}
//           </p>
//           <p className="text-xs text-gray-500">{row.email || "N/A"}</p>
//         </div>
//       ),
//     },
//     {
//       field: "grandTotal",
//       headerName: "Amount",
//       width: 120,
//       renderCell: ({ value }) => `₹${value || 0}`,
//     },
//     {
//       field: "orderItems",
//       headerName: "Items",
//       width: 100,
//       renderCell: ({ row }) => row.orderItems?.length || 0,
//     },
//     {
//       field: "status",
//       headerName: "Status",
//       width: 120,
//       renderCell: ({ value }) => {
//         const statusMap = {
//           1: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
//           2: { label: "Processing", color: "bg-blue-100 text-blue-800" },
//           3: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
//           4: { label: "Delivered", color: "bg-green-100 text-green-800" },
//           5: { label: "Cancelled", color: "bg-red-100 text-red-800" },
//         };
//         return (
//           <span
//             className={`px-2 py-1 rounded-full text-sm ${
//               statusMap[value]?.color || "bg-gray-100bury-100 text-gray-800"
//             }`}
//           >
//             {statusMap[value]?.label || "Unknown"}
//           </span>
//         );
//       },
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 150,
//       renderCell: ({ row }) => (
//         <button
//           onClick={() => handleStatusUpdate(row.orderId, row.status + 1)}
//           disabled={row.status >= 4}
//           className="text-blue-600 hover:underline disabled:text-gray-400"
//         >
//           Update Status
//         </button>
//       ),
//     },
//   ];

//   useEffect(() => {
//     fetchData();
//   }, [token]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [ordersRes, analyticsRes] = await Promise.all([
// axios.get(`${API_URL}/order/getallorders`, {
//   headers: { Authorization: `Bearer ${token}` },
// }),
//         axios.get(`${API_URL}/order/salemanage`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);
//       setOrders(ordersRes.data);
//       setAnalytics(analyticsRes.data);
//       toast.success("Data fetched successfully");
//     } catch (error) {
//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please log in again.");
//         // Redirect to login if needed
//       } else {
//         toast.error("Failed to fetch data");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch = `${order.firstName || ""} ${order.lastName || ""}`
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesStatus =
//       selectedStatus === "all" || order.status == selectedStatus;
//     const orderDate = new Date(order.createdAt);
//     const inDateRange =
//       (!startDate || orderDate >= startDate) &&
//       (!endDate || orderDate <= endDate);
//     return matchesSearch && matchesStatus && inDateRange;
//   });

//   const salesChartData = {
//     labels: analytics.monthlyTrend?.map((m) => `${m.month}/${m.year}`) || [],
//     datasets: [
//       {
//         label: "Sales (₹)",
//         data: analytics.monthlyTrend?.map((m) => m.totalSales) || [],
//         backgroundColor: "#6366f1",
//       },
//     ],
//   };

//   const statusChartData = {
//     labels:
//       analytics.statusDistribution?.map(
//         (s) =>
//           statusOptions.find((opt) => opt.value == s.status)?.label ||
//           `Status ${s.status}`
//       ) || [],
//     datasets: [
//       {
//         data: analytics.statusDistribution?.map((s) => s.count) || [],
//         backgroundColor: [
//           "#f59e0b",
//           "#3b82f6",
//           "#8b5cf6",
//           "#10b981",
//           "#ef4444",
//         ],
//       },
//     ],
//   };

//   const exportToCSV = () => {
//     const csvContent = [
//       ["Order ID", "Customer", "Amount", "Status", "Date"],
//       ...filteredOrders.map((order) => [
//         order.orderId,
//         `${order.firstName || "N/A"} ${order.lastName || ""}`,
//         order.grandTotal || 0,
//         statusOptions.find((opt) => opt.value == order.status)?.label ||
//           "Unknown",
//         new Date(order.createdAt).toLocaleDateString(),
//       ]),
//     ]
//       .map((e) => e.join(","))
//       .join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "orders.csv";
//     a.click();
//   };

//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       await axios.put(
//         `${API_URL}/order/updatestatus/${orderId}`,
//         { status: newStatus > 5 ? 5 : newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setOrders(
//         orders.map((o) =>
//           o.orderId === orderId
//             ? { ...o, status: newStatus > 5 ? 5 : newStatus }
//             : o
//         )
//       );
//       toast.success("Status updated successfully");
//     } catch (error) {
//       console.log(error);

//       toast.error("Failed to update status");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Sales Management</h1>
//         <button
//           onClick={fetchData}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
//         >
//           Refresh
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search customers..."
//           className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <select
//           className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={selectedStatus}
//           onChange={(e) => setSelectedStatus(e.target.value)}
//         >
//           {statusOptions.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>
//         <DatePicker
//           selectsRange
//           startDate={startDate}
//           endDate={endDate}
//           onChange={setDateRange}
//           placeholderText="Select date range"
//           className="p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>

//       {loading ? (
//         <Skeleton count={5} height={50} className="mb-4" />
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <StatCard
//               title="Total Sales"
//               value={`₹${analytics.totalSales || 0}`}
//               emoji="💰"
//             />
//             <StatCard
//               title="Total Orders"
//               value={analytics.totalOrders || 0}
//               emoji="📦"
//             />
//             <StatCard
//               title="Top Product"
//               value={analytics.topProducts[0]?.name || "N/A"}
//               emoji="⭐"
//             />
//           </div>

//             {analytics.monthlyTrend?.length ? (
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                 <div className="bg-white p-6 rounded-lg shadow">
//                   <h3 className="text-lg font-semibold mb-4">
//                     Monthly Sales Trend
//                   </h3>
//                   <Bar data={salesChartData} options={{ responsive: true }} />
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow">
//                   <h3 className="text-lg font-semibold mb-4">Order Status</h3>
//                   <Pie data={statusChartData} options={{ responsive: true }} />
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white p-6 rounded-lg shadow mb-6 text-center text-gray-500">
//                 No sales data available
//               </div>
//             )}

//           {analytics.topProducts?.length ? (
//             <div className="bg-white p-6 rounded-lg shadow mb-6">
//               <h3 className="text-lg font-semibold mb-4">
//                 Top Selling Products
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {analytics.topProducts.map((product) => (
//                   <TopProductCard
//                     key={product.productId}
//                     name={product.name}
//                     image={product.image}
//                     totalSold={product.totalSold}
//                     totalRevenue={product.totalRevenue}
//                   />
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white p-6 rounded-lg shadow mb-6 text-center text-gray-500">
//               No top products available
//             </div>
//           )}

//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex justify-between mb-4">
//               <h3 className="text-lg font-semibold">Orders</h3>
//               <button
//                 onClick={exportToCSV}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//               >
//                 Export CSV
//               </button>
//             </div>
//             <div style={{ height: 500, width: "100%" }}>
//               <DataGrid
//                 rows={filteredOrders}
//                 columns={columns}
//                 getRowId={(row) => row.orderId}
//                 pageSize={10}
//                 rowsPerPageOptions={[10, 20, 50]}
//                 loading={loading}
//                 disableSelectionOnClick

//                 components={{
//                   NoRowsOverlay: () => (
//                     <div className="h-full flex items-center justify-center text-gray-500">
//                       No orders found
//                     </div>
//                   ),
//                 }}
//               />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default SalesManagement;

// src/pages/admin/SalesManagement.jsx

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios from "axios";
import { API_URL, userToken } from "../../Components/Variable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SalesManagement = () => {
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [statusFilter, setStatusFilter] = useState("all");
  const token = userToken()?.token;

  // StatCard Component
  const StatCard = ({ title, value, emoji }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <span className="text-3xl">{emoji}</span>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {title.includes("Sales") ? `₹${value}` : value}
          </p>
        </div>
      </div>
    </div>
  );

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/order/salemanage`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/order/getallorders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        console.log("analytics", analyticsRes.data);

        setAnalytics(analyticsRes.data);
        setOrders(ordersRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      (!startDate || orderDate >= startDate) &&
      (!endDate || orderDate <= endDate) &&
      (statusFilter === "all" || order.status == statusFilter)
    );
  });

  // Chart data
  const chartData = {
    labels: analytics?.monthlyTrend?.map((m) => `${m.month}/${m.year}`) || [],
    datasets: [
      {
        label: "Monthly Sales",
        data: analytics?.monthlyTrend?.map((m) => m.totalSales) || [],
        backgroundColor: "#6366f1",
        borderRadius: 8,
      },
    ],
  };

  // Status options
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: 1, label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: 2, label: "Processing", color: "bg-blue-100 text-blue-800" },
    { value: 3, label: "Shipped", color: "bg-purple-100 text-purple-800" },
    { value: 4, label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: 5, label: "Cancelled", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Sales Dashboard</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={setDateRange}
            placeholderText="Select Date Range"
            className="p-2 border rounded-lg w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-lg w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Sales"
              value={analytics?.totalSales || 0}
              emoji="💰"
            />
            <StatCard
              title="Total Orders"
              value={analytics?.totalOrders || 0}
              emoji="📦"
            />
            <StatCard
              title="Avg. Order Value"
              value={
                (analytics?.totalSales / analytics?.totalOrders).toFixed(2) || 0
              }
              emoji="📊"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `₹${value}`,
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">
                Order Status Distribution
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {analytics?.statusDistribution?.map((status) => (
                  <div
                    key={status.status}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm">
                      {
                        statusOptions.find((opt) => opt.value == status.status)
                          ?.label
                      }
                    </span>
                    <span className="font-semibold">{status.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics?.topProducts?.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  {console.log("image", `${API_URL}${product.image}`)}

                  <img
                    src={`${API_URL}${product.image}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded mr-3"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Sold: {product.totalSold}
                    </p>
                    <p className="text-sm text-gray-600">
                      Revenue: ₹{product.totalRevenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-6 py-4 text-sm">#{order.orderId}</td>
                      <td className="px-6 py-4 text-sm">
                        {order.firstName} {order.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm">₹{order.grandTotal}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            statusOptions.find(
                              (opt) => opt.value == order.status
                            )?.color
                          }`}
                        >
                          {
                            statusOptions.find(
                              (opt) => opt.value == order.status
                            )?.label
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.orderId, e.target.value)
                          }
                          className="p-1 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {statusOptions.slice(1).map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesManagement;
