// import React, { useState } from "react";
// import contact1 from "../image/contact1.svg";
// import contact2 from "../image/contact2.svg";
// import contact3 from "../image/contact3.svg";
// import { Link } from "react-router-dom";
// import { API_URL } from "./Variable";
// import { toast } from "react-hot-toast";
// import axios from "axios";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const createRequest = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_URL}/contact/create`, formData);
//       setFormData({ name: "", email: "", message: "" });
//       toast.success("Request Send Successfully");
//     } catch (error) {
//       toast.error("Error To Send Request");
//       console.log(error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };
//   return (
//     <>
//       <div className="max-w-7xl mx-auto bg-white px-4 md:px-12 py-12">
//         <div className="mb-6 text-sm">
//           <Link to={"/"}>
//             <span
//               style={{ fontFamily: "Times New Roman" }}
//               className="text-gray-800 hover:underline"
//             >
//               Home
//             </span>
//           </Link>
//           /{" "}
//           <span
//             style={{ fontFamily: "Times New Roman" }}
//             className="text-gray-800"
//           >
//             Contact
//           </span>
//         </div>

//         <h2
//           style={{ fontFamily: "Times New Roman" }}
//           className="text-center text-xl md:text-2xl tracking-widest mb-8"
//         >
//           Contact Us!
//         </h2>

//         {/* Icons */}
//         <div className="flex justify-center gap-6 mb-10">
//           <div className="bg-black text-white p-4 rounded-full">
//             <img src={contact1} className="w-5 h-5" />
//           </div>
//           <div className="bg-black text-white p-4 rounded-full">
//             <img src={contact2} className="w-5 h-5" />
//           </div>
//           <div className="bg-black text-white p-4 rounded-full">
//             <img src={contact3} className="w-5 h-5" />
//           </div>
//         </div>

//         {/* Form */}
//         <form className="max-w-3xl mx-auto space-y-6" onSubmit={createRequest}>
//           <div
//             style={{ fontFamily: "Times New Roman" }}
//             className="flex flex-col md:flex-row gap-4 rounded-lg"
//           >
//             <input
//               type="text"
//               placeholder="Name"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 px-4 py-2"
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 px-4 py-2"
//             />
//           </div>

//           <textarea
//             placeholder="Message"
//             rows="6"
//             name="message"
//             value={formData.message}
//             onChange={handleInputChange}
//             style={{ fontFamily: "Times New Roman" }}
//             className="w-full border border-gray-300 px-4 py-2"
//           ></textarea>

//           <button
//             type="submit"
//             style={{ fontFamily: "Times New Roman" }}
//             className="w-full bg-black text-white py-2 uppercase tracking-wider"
//           >
//             Send Message
//           </button>
//         </form>

//         {/* Map */}
//         <div className="mt-10 rounded-lg overflow-hidden shadow-md">
//           <iframe
//             title="Map"
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.365019974011!2d72.86830851493589!3d21.256082685891077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be053206eea9b2b%3A0xa43afda804407bbc!2sHans%20Society!5e0!3m2!1sen!2sin!4v1683109925092!5m2!1sen!2sin"
//             width="100%"
//             height="350"
//             allowFullScreen=""
//             loading="lazy"
//             className="w-full"
//           ></iframe>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Contact;


import React, { useState } from "react";
import contact1 from "../image/contact1.svg";
import contact2 from "../image/contact2.svg";
import contact3 from "../image/contact3.svg";
import { Link } from "react-router-dom";
import { API_URL } from "./Variable";
import { toast } from "react-hot-toast";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  // Validation function
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          error = "Name cannot exceed 50 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = "Name can only contain letters and spaces";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        } else if (value.trim().length > 100) {
          error = "Email cannot exceed 100 characters";
        }
        break;

      case "message":
        if (!value.trim()) {
          error = "Message is required";
        } else if (value.trim().length < 10) {
          error = "Message must be at least 10 characters";
        } else if (value.trim().length > 500) {
          error = "Message cannot exceed 500 characters";
        } else if (/<[^>]+>/.test(value)) {
          error = "Message cannot contain HTML or script tags";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate field if it has been touched
    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value),
      });
    }
  };

  // Handle blur (when user leaves the field)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  // Form submission
  const createRequest = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      message: true,
    });

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      };
      await axios.post(`${API_URL}/contact/create`, payload);
      setFormData({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "", message: "" });
      setTouched({ name: false, email: false, message: false });
      toast.success("Message Sent Successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Sending Message");
      console.error("Submission Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto bg-white px-4 md:px-12 py-12">
        <div className="mb-6 text-sm">
          <Link to="/">
            <span
              style={{ fontFamily: "Times New Roman" }}
              className="text-gray-800 hover:underline"
            >
              Home
            </span>
          </Link>
          /{" "}
          <span
            style={{ fontFamily: "Times New Roman" }}
            className="text-gray-800"
          >
            Contact
          </span>
        </div>

        <h2
          style={{ fontFamily: "Times New Roman" }}
          className="text-center text-xl md:text-2xl tracking-widest mb-8"
        >
          Contact Us!
        </h2>

        {/* Icons */}
        <div className="flex justify    justify-center gap-6 mb-10">
          <div className="bg-black text-white p-4 rounded-full">
            <img src={contact1} className="w-5 h-5" alt="Phone Icon" />
          </div>
          <div className="bg-black text-white p-4 rounded-full">
            <img src={contact2} className="w-5 h-5" alt="Email Icon" />
          </div>
          <div className="bg-black text-white p-4 rounded-full">
            <img src={contact3} className="w-5 h-5" alt="Location Icon" />
          </div>
        </div>

        {/* Form */}
        <form
          className="max-w-3xl mx-auto space-y-6"
          onSubmit={createRequest}
          noValidate
          aria-label="Contact Form"
        >
          <div
            style={{ fontFamily: "Times New Roman" }}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="w-full">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
                style={{ fontFamily: "Times New Roman" }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full border ${
                  errors.name && touched.name
                    ? "border-red-500 animate-shake"
                    : "border-gray-300"
                } px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors`}
                aria-invalid={errors.name && touched.name ? "true" : "false"}
                aria-describedby={errors.name && touched.name ? "name-error" : undefined}
              />
              {errors.name && touched.name && (
                <p
                  id="name-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
                style={{ fontFamily: "Times New Roman" }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full border ${
                  errors.email && touched.email
                    ? "border-red-500 animate-shake"
                    : "border-gray-300"
                } px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors`}
                aria-invalid={errors.email && touched.email ? "true" : "false"}
                aria-describedby={errors.email && touched.email ? "email-error" : undefined}
              />
              {errors.email && touched.email && (
                <p
                  id="email-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
              style={{ fontFamily: "Times New Roman" }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              rows="6"
              value={formData.message}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{ fontFamily: "Times New Roman" }}
              className={`w-full border ${
                errors.message && touched.message
                  ? "border-red-500 animate-shake"
                  : "border-gray-300"
              } px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors resize-y`}
              aria-invalid={errors.message && touched.message ? "true" : "false"}
              aria-describedby={
                errors.message && touched.message
                  ? "message-error"
                  : "message-count"
              }
            ></textarea>
            <div className="flex justify-between items-center mt-1">
              {errors.message && touched.message ? (
                <p
                  id="message-error"
                  className="text-red-500 text-sm"
                  role="alert"
                >
                  {errors.message}
                </p>
              ) : (
                <span className="text-sm text-gray-500">&nbsp;</span>
              )}
              <span
                id="message-count"
                className={`text-sm ${
                  formData.message.length > 500
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {formData.message.length}/500
              </span>
            </div>
          </div>

          <button
            type="submit"
            style={{ fontFamily: "Times New Roman" }}
            className={`w-full py-2 uppercase tracking-wider rounded-lg text-white ${
              isLoading ||
              Object.values(errors).some((error) => error) ||
              !formData.name.trim() ||
              !formData.email.trim() ||
              !formData.message.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            } transition-colors`}
            disabled={
              isLoading ||
              Object.values(errors).some((error) => error) ||
              !formData.name.trim() ||
              !formData.email.trim() ||
              !formData.message.trim()
            }
            aria-busy={isLoading ? "true" : "false"}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Map */}
        <div className="mt-10 rounded-lg overflow-hidden shadow-md">
          <iframe
            title="Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.365019974011!2d72.86830851493589!3d21.256082685891077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be053206eea9b2b%3A0xa43afda804407bbc!2sHans%20Society!5e0!3m2!1sen!2sin!4v1683109925092!5m2!1sen!2sin"
            width="100%"
            height="350"
            allowFullScreen=""
            loading="lazy"
            className="w-full"
            aria-label="Map showing Hans Society location"
          ></iframe>
        </div>
      </div>

      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </>
  );
};

export default Contact;