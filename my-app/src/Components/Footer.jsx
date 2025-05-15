import footerlogo from "../image/footerlogo.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Footer() {
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    navigate("/ProfilePage", { state: { trackingSteps: true } });
  };

  return (
    <footer
      style={{ fontFamily: "Times New Roman" }}
      className="bg-black text-white py-10"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Company Info */}
          <div className="mb-8 md:mb-0 md:max-w-xs cursor-pointer">
            <div className="mb-6">
              <Link to={"/"}>
                <img
                  src={footerlogo}
                  alt="Onista Logo"
                  width={180}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            <p className="text-sm mb-2">
              222, Tulsi Arcade, Opp. Atlanta, Near Sudama Chowk, Mota Varachha,
              Surat 394101
            </p>
            <p className="text-sm mb-2">info@onistawallart.com</p>
            <p className="text-sm">+91 98765 43210</p>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16">
            {/* Quick Links */}
            <div>
              <h3 className="text-base font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 cursor-pointer">
                <li>
                  <Link
                    to="/"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/News"}
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    News
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Aboutpage"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ProductListing"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    Product
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Contact"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-base font-medium mb-4">Social Media</h3>
              <ul className="space-y-2 cursor-pointer">
                <li>
                  <Link
                    to="#"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    WhatsApp
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-base font-medium mb-4">Customer Service</h3>
              <ul className="space-y-2 cursor-pointer">
                <li>
                  <Link
                    to="/Contact"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li
                  className="text-sm hover:text-gray-300 transition-colors"
                  onClick={handleTrackOrder}
                >
                  Track Order
                </li>
                <li>
                  <Link
                    to="/PrivacyPolicy"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ShippingReturns"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    to="/TermsConditions"
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          © 2025 Onista Enterprise OPC Pvt Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// import React from "react";
// import footerlogo from "../image/footerlogo.svg";
// import { Link } from "react-router-dom";

// export default function Footer() {
//   return (
//     <footer style={{ fontFamily: "Times New Roman" }} className="bg-black text-white py-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col md:flex-row justify-between">
//           {/* Company Info */}
//           <div className="mb-8 md:mb-0 md:max-w-xs">
//             <div className="mb-6">
//               <img
//                 src={footerlogo}
//                 alt="Onista Logo"
//                 width={180}
//                 height={50}
//                 className="h-12 w-auto"
//               />
//             </div>
//             <p className="text-sm mb-2 text-center md:text-left">
//               222, Tulsi Arcade, Opp. Atlanta, Near Sudama Chowk, Mota Varachha,
//               Surat 394101
//             </p>
//             <p className="text-sm mb-2 text-center md:text-left">info@onistawallart.com</p>
//             <p className="text-sm text-center md:text-left">+91 98765 43210</p>
//           </div>

//           {/* Links Columns */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
//             {/* Quick Links */}
//             <div>
//               <h3 className="text-base font-medium mb-4 text-center md:text-left">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     to="/"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Home
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/News"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     News
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/about"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/product"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Product
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/contact"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Contact
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Social Media */}
//             <div>
//               <h3 className="text-base font-medium mb-4 text-center md:text-left">Social Media</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     to="#"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Twitter
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Instagram
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Facebook
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     LinkedIn
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="#"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     WhatsApp
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Customer Service */}
//             <div>
//               <h3 className="text-base font-medium mb-4 text-center md:text-left">Customer Service</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     to="/contact"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Contact Us
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/track-order"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Track Order
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/privacy-policy"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Privacy Policy
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/shipping-returns"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Shipping & Returns
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/terms-conditions"
//                     className="text-sm hover:text-gray-300 transition-colors"
//                   >
//                     Terms & Conditions
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
//           © 2025 Onista Enterprise OPC Pvt Ltd. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// }
