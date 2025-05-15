import React, { useState } from "react";
// import React, { useState, useEffect } from 'react';
import logo from "../image/logo.svg";
import lo1 from "../image/lo1.svg";
import { Link, useNavigate } from "react-router-dom";
// import { Link, useNavigate } from 'react-router-dom';
import { IoIosCloseCircle } from "react-icons/io";
import axios from "axios";
import { API_URL } from "./Variable";
import toast from "react-hot-toast";

export default function Login({ onClose, toggSigupPopup }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    try {
      const response = await axios.post(`${API_URL}/user/login`, formData);
      localStorage.setItem("token", JSON.stringify(response.data.user));
      toast.success("Login Successful ");
      setTimeout(() => {
        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
        onClose();
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error(
        "Login Failed: " + error.response?.data?.message || "An error occurred"
      );
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        className="rounded-lg shadow-lg w-full max-w-4xl flex overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 focus:outline-none z-10 cursor-pointer"
        >
          <IoIosCloseCircle className="w-10 h-10  rounded-full" />
        </button>

        {/* Left Side - Image Section */}
        <div className="hidden md:block w-1/2 relative">
          {/* Full Image */}
          <img
            src={lo1}
            alt="Nature scene"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className=" bg-white w-full md:w-1/2 p-8 flex items-center">
          <div className="w-full">
            {/* Logo */}
            <img src={logo} alt="Logo" className="h-22 w-auto mx-auto mb-6" />

            {/* Welcome Text */}
            <h2 className="text-center text-xl mb-8 font-serif">
              Welcome Back!
            </h2>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Email Address"
                  className="block w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-300 text-sm"
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  id="password"
                  placeholder="Passwords"
                  className="block w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-300 text-sm"
                />
              </div>

              {/* Login Button */}
              {/* <Link to={'/ProfilePage'}>  */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 font-light tracking-wide cursor-pointer"
                // onClick={onClose}
              >
                Log In
              </button>
              {/* </Link> */}
            </form>

            {/* Signup Link */}
            <p className="text-center text-sm mt-6 cursor-pointer">
              Can't Log in?{" "}
              <a className="font-medium" onClick={toggSigupPopup}>
                Sign up
              </a>{" "}
              an account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
