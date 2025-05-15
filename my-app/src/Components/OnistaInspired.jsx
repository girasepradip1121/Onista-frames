import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Variable";
import { FaInstagram } from "react-icons/fa";

// import Navbar from "./Navbar";

const OnistaInspired = () => {
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
        console.error("Error fetching posts:", err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return (
    <>
      {/* <Navbar bgColor="" textColor="text-black"/> */}
      <div className="bg-[#EEFFF3]">
        <div className="bg-[#EEFFF3] py-12 px-4 mx-auto max-w-7xl sm:px-8 lg:px-16">
          {/* Header Section */}
          <div
            style={{ fontFamily: "Times New Roman" }}
            className="text-center mb-8"
          >
            <h2 className="text-xl sm:text-2xl  mb-2">#OnistaInspired</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              See how our customers style Onista pieces in their homes
            </p>
          </div>

          {/* Image Grid */}
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
                  style={{ fontFamily: "Times New Roman" }}
                  className="bg-black text-white px-6 py-2 rounded transition-colors duration-300 cursor-pointer"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/yourprofile",
                      "_blank"
                    )
                  }
                >
                  View Profile
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mx-auto max-w-7xl mb-5">
          <div className="bg-black text-white py-12 px-4 sm:px-8 lg:px-16 rounded-lg">
            {/* Text Content */}
            <div
              style={{ fontFamily: "Times New Roman" }}
              className="text-center"
            >
              <h2 className="text-xl sm:text-2xl  mb-4">
                Experience the Onista Difference
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mb-6">
                Discover our collection of handcrafted wall art pieces, designed
                to transform your space with elegance and cultural richness.
              </p>
              {/* Button */}
              <Link to={"/ProductListing"}>
                <button className="bg-white cursor-pointer text-black py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-300">
                  Shop Our Collection
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnistaInspired;
