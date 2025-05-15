// import React, { lazy, Suspense } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Toaster } from 'react-hot-toast';
// import AdminLayout from "./Admin/AdminLayout";
// import Dashboard from './Admin/pages/Dashboard'

// const ProductCustomizer = lazy(() => import("./Components/ProductCustomizer"));
// const Footer = lazy(() => import("./Components/Footer"));
// const Aboutpage = lazy(() => import("./Components/Aboutpage"));
// const Home = lazy(() => import("./Components/Home"));
// const Contact = lazy(() => import("./Components/Contact"));
// const News = lazy(() => import("./Components/News"));
// const Cart = lazy(() => import("./Components/Cart"));
// const Singleproduct = lazy(() => import("./Components/Singleproduct"));
// const Navbar = lazy(() => import("./Components/Navbar"));
// const ProfilePage = lazy(() => import("./Components/ProfilePage"));
// const ShippingReturns = lazy(() => import("./Components/ShippingReturns"));
// const PrivacyPolicy = lazy(() => import("./Components/PrivacyPolicy"));
// const ProductListing = lazy(() => import("./Components/ProductListing"));
// const TermsConditions = lazy(() => import("./Components/TermsConditions"));
// const CheckoutPage = lazy(() => import("./Components/CheckoutPage"));
// const ArticleDetail = lazy(() => import("./Components/ArticleDetail"));

// function App() {
//   return (
//     <Router>
//     <Toaster position="top-right" reverseOrder={false} />
//     {/* <Toaster richColors position="top-center" /> */}
//     <Routes>
//       {/* Admin Routes */}
//       <Route path="/admin" element={<AdminLayout />}>
//         <Route index element={<Dashboard />} />
//         {/* <Route path="products" element={<Products />} />
//         <Route path="users" element={<Users />} />
//         <Route path="orders" element={<Orders />} />
//         <Route path="contact" element={<Contact />} />
//         <Route path="materials" element={<Materials />} />
//         <Route path="manage-sales" element={<SalesManagement />} /> */}

//       </Route>

//       {/* Client Routes */}
//       <Route path="*" element={<AppContent />} />
//     </Routes>
//   </Router>
//   );
// }

// function AppContent(){
//   return(
//     <>
//     <Suspense fallback={<div>Loading...</div>}>
//       <Router>
//       <Toaster position="top-right" reverseOrder={false} theme=""/>
//       <Navbar />
//         <Routes>
//           {/* <Route path='/Login' element={<Login/>} /> */}
//           <Route path="/" element={<Home />} />
//           <Route path="/Aboutpage" element={<Aboutpage />} />
//           <Route path="/Contact" element={<Contact />} />
//           {/* <Route path='/News' element={<News />} /> */}
//           <Route path="/Cart" element={<Cart />} />
//           <Route path="/Singleproduct" element={<Singleproduct />} />
//           <Route path="/ProductListing" element={<ProductListing />} />
//           <Route path="/ProfilePage" element={<ProfilePage />} />
//           <Route path="/ProductCustomizer" element={<ProductCustomizer />} />
//           <Route path="/ShippingReturns" element={<ShippingReturns />} />
//           <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
//           <Route path="/TermsConditions" element={<TermsConditions />} />
//           <Route path="/CheckoutPage" element={<CheckoutPage />} />
//           <Route path="/news" element={<News />} />
//           <Route path="/news/:id" element={<ArticleDetail />} />
//         </Routes>

//         <Footer />
//       </Router>
//     </Suspense>
//   </>
//   )
// }

// export default App;

// import React, { lazy, Suspense } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import AdminLayout from "./Admin/AdminLayout";
// import Dashboard from "./Admin/pages/Dashboard";
// import SalesManagement from "./Admin/pages/SalesManagement";

// const ProductCustomizer = lazy(() => import("./Components/ProductCustomizer"));
// const Footer = lazy(() => import("./Components/Footer"));
// const Aboutpage = lazy(() => import("./Components/Aboutpage"));
// const Home = lazy(() => import("./Components/Home"));
// const Contact = lazy(() => import("./Components/Contact"));
// const News = lazy(() => import("./Components/News"));
// const Cart = lazy(() => import("./Components/Cart"));
// const Singleproduct = lazy(() => import("./Components/Singleproduct"));
// const Navbar = lazy(() => import("./Components/Navbar"));
// const ProfilePage = lazy(() => import("./Components/ProfilePage"));
// const ShippingReturns = lazy(() => import("./Components/ShippingReturns"));
// const PrivacyPolicy = lazy(() => import("./Components/PrivacyPolicy"));
// const ProductListing = lazy(() => import("./Components/ProductListing"));
// const TermsConditions = lazy(() => import("./Components/TermsConditions"));
// const CheckoutPage = lazy(() => import("./Components/CheckoutPage"));
// const ArticleDetail = lazy(() => import("./Components/ArticleDetail"));

// function App() {
//   return (
//     <Router>
//       <Toaster position="top-right" reverseOrder={false} />
//       <Suspense fallback={<div>Loading...</div>}>
//         <Navbar />
//         <Routes>
//           {/* Admin Routes */}
//           <Route path="/admin" element={<AdminLayout />}>
//             <Route index element={<Dashboard />} />
//             <Route path="manage-sales" element={<SalesManagement />} />
//           </Route>

//           {/* Client Routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/Aboutpage" element={<Aboutpage />} />
//           <Route path="/Contact" element={<Contact />} />
//           <Route path="/Cart" element={<Cart />} />
//           <Route path="/Singleproduct" element={<Singleproduct />} />
//           <Route path="/ProductListing" element={<ProductListing />} />
//           <Route path="/ProfilePage" element={<ProfilePage />} />
//           <Route path="/ProductCustomizer" element={<ProductCustomizer />} />
//           <Route path="/ShippingReturns" element={<ShippingReturns />} />
//           <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
//           <Route path="/TermsConditions" element={<TermsConditions />} />
//           <Route path="/CheckoutPage" element={<CheckoutPage />} />
//           <Route path="/news" element={<News />} />
//           <Route path="/news/:id" element={<ArticleDetail />} />
//         </Routes>
//         <Footer />
//       </Suspense>
//     </Router>
//   );
// }

// export default App;

import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import SalesManagement from "./Admin/pages/SalesManagement";
import Materials from "./Admin/pages/Materials";
import FrameMaterials from "./Admin/pages/FrameMaterial";
import FrameSizes from "./Admin/pages/FrameSizes";
import Frame from "./Admin/pages/Frame";
import FrameDetail from "./Admin/pages/FrameDetails";
import AdminNews from "./Admin/pages/News";
import ContactUs from "./Admin/pages/Contact";
import Users from "./Admin/pages/Users";
import Orders from "./Admin/pages/Orders";
import AdminSlider from "./Admin/pages/AdminSlider";
import AddPostForm from "./Admin/pages/AddPostForm";
import SettingsPage from "./Admin/pages/SettingPage";
import Thicknesses from "./Admin/pages/Thickness";
import ScrollToTop from "./Components/ScrollTop";
import FrameAttributesDashboard from "./Admin/pages/FrameAttributesDashboard";
import AdminRoute from "./Admin/components/AuthRoutes";
import Reviews from "./Admin/pages/Reviews";

const ProductCustomizer = lazy(() => import("./Components/ProductCustomizer"));
const Footer = lazy(() => import("./Components/Footer"));
const Aboutpage = lazy(() => import("./Components/Aboutpage"));
const Home = lazy(() => import("./Components/Home"));
const Contact = lazy(() => import("./Components/Contact"));
const News = lazy(() => import("./Components/News"));
const Cart = lazy(() => import("./Components/Cart"));
const Singleproduct = lazy(() => import("./Components/Singleproduct"));
const Navbar = lazy(() => import("./Components/Navbar"));
const ProfilePage = lazy(() => import("./Components/ProfilePage"));
const ShippingReturns = lazy(() => import("./Components/ShippingReturns"));
const PrivacyPolicy = lazy(() => import("./Components/PrivacyPolicy"));
const ProductListing = lazy(() => import("./Components/ProductListing"));
const TermsConditions = lazy(() => import("./Components/TermsConditions"));
const CheckoutPage = lazy(() => import("./Components/CheckoutPage"));
const ArticleDetail = lazy(() => import("./Components/ArticleDetail"));
const OrderSuccess = lazy(() => import("./Components/Order-success"));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="manage-sales" element={<SalesManagement />} />
            <Route path="materials" element={<Materials />} />
            <Route path="frame-materials" element={<FrameMaterials />} />
            <Route path="sizes" element={<FrameSizes />} />
            <Route path="frame" element={<Frame />} />
            <Route path="frame/:frameId" element={<FrameDetail />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="slider" element={<AdminSlider />} />
            <Route path="posts" element={<AddPostForm />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="thickness" element={<Thicknesses />} />
            <Route path="reviews" element={<Reviews />} />

            <Route
              path="frameattributes"
              element={<FrameAttributesDashboard />}
            />
          </Route>
          {/* Client Routes */}
          <Route
            path="*"
            element={
              <>
                {/* Only show Navbar and Footer on Client Routes */}
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/Aboutpage" element={<Aboutpage />} />
                  <Route path="/Contact" element={<Contact />} />
                  <Route path="/Cart" element={<Cart />} />
                  <Route
                    path="/Singleproduct/:frameId"
                    element={<Singleproduct />}
                  />
                  <Route path="/ProductListing" element={<ProductListing />} />
                  <Route path="/ProfilePage" element={<ProfilePage />} />
                  <Route
                    path="/ProductCustomizer"
                    element={<ProductCustomizer />}
                  />
                  <Route
                    path="/ShippingReturns"
                    element={<ShippingReturns />}
                  />
                  <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                  <Route
                    path="/TermsConditions"
                    element={<TermsConditions />}
                  />
                  <Route path="/CheckoutPage" element={<CheckoutPage />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:newsId" element={<ArticleDetail />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
