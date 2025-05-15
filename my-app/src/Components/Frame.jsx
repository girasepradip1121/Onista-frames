// import React from "react";
// import { FaInstagram } from "react-icons/fa";
// // Replace these paths with your actual image paths
// import frame1 from "../image/frame1.svg";
// import frame2 from "../image/frame2.svg";
// import frame3 from "../image/frame3.svg";
// import frame4 from "../image/frame4.svg";

// const Frame = () => {
//   return (
//     <section className="bg-[#EBFFF6] py-10 md:py-16">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
//         {/* Heading */}
//         <h2
//           style={{ fontFamily: "Times New Roman" }}
//           className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4"
//         >
//           #OnistaInspired
//         </h2>
//         <p
//           style={{ fontFamily: "Times New Roman" }}
//           className="text-gray-600 text-sm sm:text-base mb-8"
//         >
//           See how our customers style Onista pieces in their homes
//         </p>

//         {/* Image Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
//           {/* Image 1 */}
//           <div className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer">
//             <img
//               src={frame1}
//               alt="Inspired 1"
//               className="w-full h-auto object-cover"
//             />
//             {/* Hover Effect */}
//             <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
//             <FaInstagram className="text-white text-4xl" />
//             </div>
//           </div>

//           {/* Image 2 */}
//           <div className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer">
//             <img
//               src={frame2}
//               alt="Inspired 2"
//               className="w-full h-auto object-cover"
//             />
//             {/* Hover Effect */}
//             <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
//             <FaInstagram className="text-white text-4xl" />
//             </div>
//           </div>

//           {/* Image 3 */}
//           <div className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer">
//             <img
//               src={frame3}
//               alt="Inspired 3"
//               className="w-full h-auto object-cover"
//             />
//             {/* Hover Effect */}
//             <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
//             <FaInstagram className="text-white text-4xl" />
//             </div>
//           </div>

//           {/* Image 4 */}
//           <div className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer">
//             <img
//               src={frame4}
//               alt="Inspired 4"
//               className="w-full h-auto object-cover"
//             />
//             {/* Hover Effect */}
//             <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
//             <FaInstagram className="text-white text-4xl" />
//             </div>
//           </div>
//         </div>

//         {/* Button */}
//         <div className="flex justify-center">
//           <button
//             style={{ fontFamily: "Times New Roman" }}
//             className="bg-black text-white px-6 py-2 rounded transition-colors duration-300 cursor-pointer"
//             // onClick={() => window.open("https://www.instagram.com", "_blank")}
//           >
//             View Profile
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Frame;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInstagram } from 'react-icons/fa';
import { API_URL } from '../Components/Variable'; // Adjust path to match your project structure

const Frame = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/socialpost/getallpost`);
        setPosts(res.data.slice(0, 4)); // Limit to 4 posts for the grid
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="bg-[#EBFFF6] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2
          style={{ fontFamily: 'Times New Roman' }}
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4"
        >
          #OnistaInspired
        </h2>
        <p
          style={{ fontFamily: 'Times New Roman' }}
          className="text-gray-600 text-sm sm:text-base mb-8"
        >
          See how our customers style Onista pieces in their homes
        </p>

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-600">Loading posts...</p>
        ) : (
          <>
            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              {posts.map((post) => (
                <div
                  key={post.postId}
                  className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer"
                >
                  <img
                    src={`${API_URL}/${post.imageUrl}`}
                    alt="Inspired Post"
                    className="w-full h-auto object-cover"
                  />
                  {/* Hover Effect */}
                  <a
                    href={post.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
                  >
                    <FaInstagram className="text-white text-4xl" />
                  </a>
                </div>
              ))}
            </div>

            {/* Button */}
            <div className="flex justify-center">
              <button
                style={{ fontFamily: 'Times New Roman' }}
                className="bg-black text-white px-6 py-2 rounded transition-colors duration-300 cursor-pointer"
                onClick={() =>
                  window.open('https://www.instagram.com/yourprofile', '_blank')
                }
              >
                View Profile
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Frame;