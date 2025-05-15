import React, { useEffect, useState } from "react";
import logo from "../image/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import search from "../image/serach.svg";
import cart from "../image/cart.svg";
import users from "../image/users.svg";
import Login from "./Login";
import Signup from "./Signup";
import Cart from "./Cart";
import { userToken } from "./Variable";
import { FiSearch } from "react-icons/fi";
// import '../styles/AddPostForm.css'; // For animations

export default function Navbar() {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSigupPopupOpen, setIsSigupPopupOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const userData = userToken();
  const token = userData?.token;

  useEffect(() => {
    if (token) setIsLoggedIn(true);
  }, [token]);

  const toggleLoginPopup = () => setIsLoginPopupOpen(!isLoginPopupOpen);
  const toggSigupPopup = () => setIsSigupPopupOpen(!isSigupPopupOpen);
  const toggleSlider = () => setIsSliderOpen(!isSliderOpen);
  const toggleSearchPopup = () => setIsSearchPopupOpen(!isSearchPopupOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/ProfilePage");
    } else {
      toggleLoginPopup();
    }
  };

  const handleLinkClick = () => {
    setIsSliderOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/ProductListing?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchPopupOpen(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <header className="bg-white top-0 sticky z-50">
        <nav className="flex justify-between bg-white items-center px-4 py-3 mx-auto max-w-7xl">
          <div className="flex justify-start">
            <Link to={"/"}>
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-auto md:h-12 lg:h-16 cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div
            style={{ fontFamily: "Times New Roman" }}
            className="hidden md:flex space-x-8 text-xl"
          >
            <Link to="/" className="hover:text-gray-500">
              Home
            </Link>
            <Link to="/ProductListing" className="hover:text-gray-500">
              Product
            </Link>
            <Link to="/Aboutpage" className="hover:text-gray-500">
              About
            </Link>
            <Link to="/News" className="hover:text-gray-500">
              News
            </Link>
            <Link to="/Contact" className="hover:text-gray-500">
              Contact
            </Link>
            <Link to="/ProductCustomizer" className="hover:text-gray-500">
              Customize Product
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleSearchPopup}
              className="hover:text-gray-500 focus:outline-none cursor-pointer"
            >
              <img src={search} alt="Search" className="h-5 w-5" />
            </button>
            <button
              onClick={toggleCart}
              className="hover:text-gray-500 focus:outline-none cursor-pointer"
            >
              <img src={cart} alt="Cart" className="h-5 w-5" />
            </button>
            <button
              onClick={handleUserIconClick}
              className="hover:text-gray-500 focus:outline-none cursor-pointer"
            >
              <img src={users} alt="User" className="h-5 w-5" />
            </button>
            <button
              onClick={toggleSlider}
              className="md:hidden hover:text-gray-500 focus:outline-none cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Search Pop-Up */}
      {isSearchPopupOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg p-4 sm:p-6 animate-slide-in">
          <div className="max-w-7xl mx-auto flex items-center space-x-4">
            <Link to={"/"}>
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-auto md:h-12 lg:h-16 cursor-pointer"
              />
            </Link>
            <form onSubmit={handleSearchSubmit} className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-black rounded-full outline-none text-sm"
                placeholder=" "
                id="searchQuery"
              />
              <img
                src={search}
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-10 top-3.5 text-gray-500 hover:text-gray-500"
                >
                  ✕
                </button>
              )}
            </form>
            <button
              onClick={toggleSearchPopup}
              className="text-gray-600 hover:text-gray-500 text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Mobile Slider Menu */}
      <div
        className={`fixed top-10 right-0 h-full w-full bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isSliderOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={toggleSlider}
          className="absolute top-4 right-4 hover:text-gray-500 focus:outline-none"
        >
          <svg
            className="mt-2 w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div
          className="mt-16 space-y-4 px-4"
          style={{ fontFamily: "Times New Roman" }}
        >
          <Link
            to="/"
            onClick={handleLinkClick}
            className="block hover:text-gray-500"
          >
            Home
          </Link>
          <Link
            to="/ProductListing"
            onClick={handleLinkClick}
            className="block hover:text-gray-500"
          >
            Product
          </Link>
          <Link
            to="/Aboutpage"
            onClick={handleLinkClick}
            className="block hover:text-gray-500"
          >
            About
          </Link>
          <Link
            to="/News"
            onClick={handleLinkClick}
            className="block hover:text-gray-500"
          >
            News
          </Link>
          <Link
            to="/Contact"
            onClick={handleLinkClick}
            className="block hover:text-gray-500"
          >
            Contact
          </Link>
          <Link
            to="/ProductCustomizer"
            onClick={handleLinkClick}
            className="block hover:text-gray-500"
          >
            Customize Product
          </Link>
        </div>
      </div>

      {isLoginPopupOpen && (
        <Login onClose={toggleLoginPopup} toggSigupPopup={toggSigupPopup} />
      )}
      {isSigupPopupOpen && <Signup onClose={toggSigupPopup} />}
      {isCartOpen && <Cart toggleCart={toggleCart} />}
    </>
  );
}
