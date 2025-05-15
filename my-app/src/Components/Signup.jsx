import React, { useState } from "react";
import logo from "../image/logo.svg";
import lo1 from "../image/lo1.svg";
import { IoIosCloseCircle } from "react-icons/io";
import axios from "axios";
import { API_URL } from "./Variable";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Signup({ onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/user/signup`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Signup Successful");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Assuming 409 Conflict is used for duplicate email
        toast.error("Email already exists!");
      } else {
        console.log(error);
        toast.error("Signup Failed...");
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          className="rounded-lg shadow-lg w-full max-w-4xl flex overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black focus:outline-none z-10"
          >
            <IoIosCloseCircle className="w-10 h-10 rounded-full cursor-pointer" />
          </button>
          <div className="hidden md:block w-1/2 relative">
            <img src={lo1} alt="Nature scene" className="w-full h-full object-cover" />
          </div>
          <div className="w-full bg-white md:w-1/2 p-8 flex items-center">
            <div className="w-full">
              <img src={logo} alt="Logo" className="h-22 w-auto mx-auto mb-6" />
              <h2 className="text-center text-xl mb-8 font-serif">Welcome Back!</h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="block w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-300 text-sm"
                  />
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="block w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-300 text-sm"
                  />
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="block w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-300 text-sm"
                  />
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="block w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-300 text-sm"
                  />
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="block w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-300 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-4 font-light tracking-wide cursor-pointer"
                >
                  Sign Up
                </button>
              </form>
              <p className="text-center cursor-pointer text-sm mt-6">
                Can't Signup in?{" "}
                <a className="font-medium cursor-pointer" onClick={onClose}>
                  Login
                </a>{" "}
                an account
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}