import React, { useEffect, useState } from 'react';
import logo from '../image/logo.svg';
import { Link, useNavigate } from "react-router-dom";
import search from "../image/serach.svg";
import cart from "../image/cart.svg";
import users from "../image/users.svg";
import Login from './Login';
import Signup from './Signup';
import Cart from './Cart';
import { userToken } from './Variable';

export default function Navbar() {

  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSigupPopupOpen, setIsSigupPopupOpen] = useState(false);

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login status

  const navigate = useNavigate(); // For navigation


  const toggleLoginPopup = () => setIsLoginPopupOpen(!isLoginPopupOpen);
  const toggSigupPopup = () => setIsSigupPopupOpen(!isSigupPopupOpen);

  const toggleSlider = () => setIsSliderOpen(!isSliderOpen);
  const toggleSearchPopup = () => setIsSearchPopupOpen(!isSearchPopupOpen); // Toggle search pop-up
  const toggleCart = () => setIsCartOpen(!isCartOpen)
  const userData=userToken()
  const token=userData?.token

  useEffect(() => {
    if (token) setIsLoggedIn(true);
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate('/ProfilePage');
    } else {
      toggleLoginPopup();
    }
  };

  // Function to close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsSliderOpen(false);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear the input field after submission
      setIsSearchPopupOpen(false); // Close the search popup
    }
  };

  return (
    <>
      {/* Navbar */}
      <header className='bg-white top-0 sticky z-50'>
        <nav className="flex justify-between bg-white items-center px-0 py-3 mx-auto max-w-7xl">
          <div className="flex justify-start">
            <Link to={'/'}>
              <img src={logo} alt="Logo" className="h-10 w-auto md:h-12 sm:h-25 lg:h-20 cursor-pointer" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div style={{ fontFamily: "Times New Roman" }} className="hidden md:flex space-x-8 text-xl">
            <a href="/" className="hover:text-gray-500">Home</a>
            <Link to={'/ProductListing'}><span className="hover:text-gray-500">Product</span></Link>
            <Link to="/Aboutpage" className="hover:text-gray-500">About</Link>
            <Link to="/News" className="hover:text-gray-500">News</Link>
            <Link to="/Contact" className="hover:text-gray-500">Contact</Link>
            <Link to="/ProductCustomizer" className="hover:text-gray-500">Customize Product</Link>
          </div>


          {/* Icons */}
          <div className="flex items-center space-x-6">
            {/* Search Button */}
            <button onClick={toggleSearchPopup} className="hover:text-gray-500 focus:outline-none cursor-pointer">
              <img src={search} alt="Search" className="h-5 w-5" />
            </button>

            {/* <Link to={'/Cart'}>  */}
            <button onClick={toggleCart} className="hover:text-gray-500 focus:outline-none cursor-pointer" >
              <img src={cart} alt="Cart" className="h-5 w-5 " />
            </button>
            {/* </Link> */}
            
            {/* <Link to={"/login"}> */}
            <button onClick={handleUserIconClick} className="hover:text-gray-500 focus:outline-none cursor-pointer ">
              <img src={users} alt="User" className="h-5 w-5" />
            </button>
            {/* </Link> */}
            <button onClick={toggleSlider} className="md:hidden hover:text-gray-500 focus:outline-none cursor-pointer">
              {/* Hamburger Icon SVG */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

      </header>

      {/* Search Pop-Up */}
      {isSearchPopupOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4 h-33">
          <div className="max-w-7xl mx-auto flex items-center space-x-4 mt-6">
            {/* Logo */}
            <img src={logo} alt="Logo" className="h-10 w-auto md:h-10 lg:h-20 cursor-pointer" />

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products"
                className="w-full pl-10 pr-10 py-2 border border-black rounded-full outline-none text-sm"
              />

              {/* Search icon inside input */}
              <img
                src={search}
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
              />

              {/* Clear (X) icon inside input */}
              {/* {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
          >
            ✕
          </button>
        )} */}
            </form>

            {/* Close Search Popup */}
            <button onClick={toggleSearchPopup} className="text-gray-600 hover:text-black text-xl cursor-pointer">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Mobile Slider Menu */}
      <div
        className={`fixed top-10 right-0 h-full w-full bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${isSliderOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <button
          onClick={toggleSlider}
          className="absolute top-4 right-4 hover:text-gray-500 focus:outline-none"
        >
          {/* Close Icon SVG */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mt-16 space-y-4 px-4">
          <Link to="/" onClick={handleLinkClick} className="block hover:text-gray-500">Home</Link>
          <Link to="/ProductListing" onClick={handleLinkClick} className="block hover:text-gray-500">Product</Link>
          <Link to="/Aboutpage" onClick={handleLinkClick} className="block hover:text-gray-500">About</Link>
          <Link to="/News" onClick={handleLinkClick} className="block hover:text-gray-500">News</Link>
          <Link to="/Contact" onClick={handleLinkClick} className="block hover:text-gray-500">Contact</Link>
          <Link to="/ProductCustomizer" onClick={handleLinkClick} className="block hover:text-gray-500">Customize Product</Link>
        </div>
      </div>



      {isLoginPopupOpen && (
        <Login onClose={toggleLoginPopup} toggSigupPopup={toggSigupPopup}  />
      )}
      {isSigupPopupOpen && (
        <Signup onClose={toggSigupPopup} />
      )}
      {isCartOpen && (
        <Cart toggleCart={toggleCart} />
      )}
    </>
  );
}