import React, { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Footer from './Components/Footer';
// import Aboutpage from './Components/Aboutpage';
// import Home from './Components/Home';
// import Contact from './Components/Contact';
// import News from './Components/News';

// import Cart from './Components/Cart';
// import Singleproduct from './Components/Singleproduct';
// import ProductListing from './Components/ProductListing';
// // import Login from './Components/Login';
// // import Signup from './Components/Signup';
// import Navbar from './Components/Navbar';
// import ProfilePage from "./Components/ProfilePage";
// import ShippingReturns from "./Components/ShippingReturns";
// import PrivacyPolicy from "./Components/PrivacyPolicy";
// import TermsConditions from "./Components/TermsConditions";


// import ProductCustomizer from "./Components/ProductCustomizer";
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

function App() {

  

  return (
    <>


<Suspense fallback={<div>Loading...</div>}>
      <Router>

        <Navbar />
        <Routes>
          {/* <Route path='/Login' element={<Login/>} /> */}
          <Route path='/' element={<Home />} />
          <Route path='/Aboutpage' element={<Aboutpage />} />
          <Route path='/Contact' element={<Contact />} />
          <Route path='/News' element={<News />} />
          <Route path='/Cart' element={<Cart />} />
          <Route path='/Singleproduct' element={<Singleproduct />} />
          <Route path='/ProductListing' element={<ProductListing />} />
          <Route path='/ProfilePage' element={<ProfilePage/>} />
          <Route path='/ProductCustomizer' element={<ProductCustomizer/>} />
          <Route path='/ShippingReturns' element={<ShippingReturns/>} />
          <Route path='/PrivacyPolicy' element={<PrivacyPolicy/>} />
          <Route path='/TermsConditions' element={<TermsConditions/>} />
        </Routes>


        <Footer />

      </Router>
      </Suspense>
    </>
  )
}

export default App;
