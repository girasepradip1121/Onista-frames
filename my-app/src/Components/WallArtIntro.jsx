// import React from "react";
// import frame from "../image/frame.svg"; // Replace with actual image path
// import f1 from "../image/f1.svg";
// import f2 from "../image/f2.svg";

// const WallArtIntro = () => {
//     return (

//         <section className="bg-[#EBFFF6] relative overflow-hidden">

//             <div className=" max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 px-6 py-16">
//                 {/* Left Text Content */}
//                 <img
//                     src={f1}
//                     alt="Flower"
//                     className="absolute top-0 left-0 w-20 md:w-36 lg:w-44 z-0"
//                 />
//                 <div className="w-full lg:w-1/2 relative ">
//                     {/* Optional corner flower SVGs */}


//                     <div className="absolute top-0 left-0">

//                         {/* Optional: Add SVG flower graphic here if needed */}
//                     </div>

//                     <h2 style={{ fontFamily: "Times New Roman" }} className="text-2xl md:text-3xl lg:text-4xl  mb-6 text-gray-600">
//                         ART THAT SPEAKS, WALLS THAT INSPIRE
//                     </h2>

//                     <p style={{ fontFamily: "Times New Roman" }} className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
//                         Elevate your space with handcrafted wall decor that transforms ordinary walls into captivating statements. Each piece is thoughtfully designed and skillfully made, bringing depth, texture, and character to your interiors. These artful creations not only enhance visual appeal but also reflect a story of tradition and craftsmanship. Whether you're decorating a modern loft or a cozy living room, our decor adds warmth, style, and a touch of timeless elegance to every corner.
//                     </p>

//                     <p style={{ fontFamily: "Times New Roman" }} className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
//                         Our handcrafted wall art goes beyond decoration—it becomes an expression of who you are. Inspired by culture, nature, and design, every piece invites admiration and conversation. With intricate details and premium materials, our decor blends seamlessly into any setting while standing out as a signature element. Let your walls speak with soul and sophistication, creating an ambiance that uplifts, comforts, and inspires everyone who walks into your thoughtfully curated space.
//                     </p>

//                     <button style={{ fontFamily: "Times New Roman" }} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
//                         Explore New Arrival
//                     </button>

//                     {/* Optional corner flower SVG */}

//                     {/* Optional: Add another SVG flower here if needed */}
//                     <img
//                         src={f2}
//                         alt="Flower"
//                         className="absolute  lg:left-120 md:left-150  left-20  top-120 md:top-80 lg:top-110 w-28 md:w-36 lg:w-44  z-0"
//                     />

//                 </div>

//                 {/* Right Image */}
//                 <div className="w-500 lg:w-1/2">
//                     <img
//                         src={frame}
//                         alt="Wall Frame Art"
//                         className=" w-full mx-auto"
//                     />
//                 </div>
//             </div>

//         </section>
//     );
// };

// export default WallArtIntro;



//-----------------------------------------

// import React from "react";
// import frame from "../image/frame.svg";
// import f1 from "../image/f1.svg";
// import f2 from "../image/f2.svg";

// const WallArtIntro = () => {
//   return (
//     <section className="bg-[#EBFFF6] relative w-full">
//       <div className="flex flex-col-reverse lg:flex-row w-full min-h-screen">
//         {/* Left Side - Text Content */}
//         <div className="relative w-full lg:w-1/2 px-4 md:px-6 py-10 md:py-16 flex flex-col justify-center">
//           {/* Top Flower - hidden on mobile */}
//           <img
//             src={f1}
//             alt="Flower"
//             className="absolute top-1 left-1 w-16 md:w-28  hidden md:block"
//           />

//           {/* Bottom Flower - hidden on mobile */}
//           <img
//             src={f2}
//             alt="Flower"
//             // className="absolute bottom-4 xl:left-210 lg:left-100 md:left-160 w-16 md:w-28 hidden md:block"
//             className="absolute 2xl:left-213 bottom-1 xl:left-135 lg:left-103  md:left-167  w-16 md:w-28 hidden md:block "

//           />

//           {/* Text Content */}
//           <div className="max-w-2xl mx-auto relative">
//             <h2
//               style={{ fontFamily: "Times New Roman" }}
//               className="text-2xl md:text-3xl lg:text-4xl mb-6 text-gray-800 text-center lg:text-left "
//             >
//               ART THAT SPEAKS, WALLS THAT INSPIRE
//             </h2>

//             <p
//               style={{ fontFamily: "Times New Roman" }}
//               className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base text-justify"
//             >
//               Elevate your space with handcrafted wall decor that transforms ordinary walls into captivating statements. Each piece is thoughtfully designed and skillfully made, bringing depth, texture, and character to your interiors. These artful creations not only enhance visual appeal but also reflect a story of tradition and craftsmanship. Whether you're decorating a modern loft or a cozy living room, our decor adds warmth, style, and a touch of timeless elegance to every corner.
//             </p>

//             <p
//               style={{ fontFamily: "Times New Roman" }}
//               className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base text-justify"
//             >
//               Our handcrafted wall art goes beyond decoration—it becomes an expression of who you are. Inspired by culture, nature, and design, every piece invites admiration and conversation. With intricate details and premium materials, our decor blends seamlessly into any setting while standing out as a signature element. Let your walls speak with soul and sophistication, creating an ambiance that uplifts, comforts, and inspires everyone who walks into your thoughtfully curated space.
//             </p>

//             <div className="flex justify-center lg:justify-start">
//               <button
//                 style={{ fontFamily: "Times New Roman" }}
//                 className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
//               >
//                 Explore New Arrival
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Full Height Image */}
//         <div className="w-full lg:w-1/2 lg:h-auto">
//           <img
//             src={frame}
//             alt="Wall Frame Art"
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WallArtIntro;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './Variable';
import f1 from '../image/f1.svg';
import f2 from '../image/f2.svg';
import frame from '../image/frame.svg';
import { Link } from 'react-router-dom';

const WallArtIntro = () => {
  const [wall, setWall] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch wall entry
  useEffect(() => {
    const fetchWall = async () => {
      try {
        const res = await axios.get(`${API_URL}/wall/getwall`);
        setWall(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching wall:', err);
        setLoading(false);
      }
    };
    fetchWall();
  }, []);

  return (
    <section className="bg-[#EBFFF6] relative w-full">
      <div className="flex flex-col-reverse lg:flex-row w-full min-h-screen">
        {/* Left Side - Text Content */}
        <div className="relative w-full lg:w-1/2 px-4 md:px-6 py-10 md:py-16 flex flex-col justify-center">
          {/* Top Flower - hidden on mobile */}
          <img
            src={f1}
            alt="Flower"
            className="absolute top-1 left-1 w-16 md:w-28 hidden md:block"
          />

          {/* Bottom Flower - hidden on mobile */}
          <img
            src={f2}
            alt="Flower"
            className="absolute 2xl:left-213 bottom-1 xl:left-135 lg:left-103 md:left-167 w-16 md:w-28 hidden md:block"
          />

          {/* Text Content */}
          <div className="max-w-2xl mx-auto relative">
            <h2
              style={{ fontFamily: 'Times New Roman' }}
              className="text-2xl md:text-3xl lg:text-4xl mb-6 text-gray-800 text-center lg:text-left"
            >
              {wall && !loading ? wall.title : 'ART THAT SPEAKS, WALLS THAT INSPIRE'}
            </h2>

            <p
              style={{ fontFamily: 'Times New Roman' }}
              className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base text-justify"
            >
              {wall && !loading && wall.description
                ? wall.description
                : 'Elevate your space with handcrafted wall decor that transforms ordinary walls into captivating statements. Each piece is thoughtfully designed and skillfully made, bringing depth, texture, and character to your interiors. These artful creations not only enhance visual appeal but also reflect a story of tradition and craftsmanship. Whether you’re decorating a modern loft or a cozy living room, our decor adds warmth, style, and a touch of timeless elegance to every corner.'}
            </p>

            <p
              style={{ fontFamily: 'Times New Roman' }}
              className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base text-justify"
            >
              Our handcrafted wall art goes beyond decoration—it becomes an expression of who you are. Inspired by culture, nature, and design, every piece invites admiration and conversation. With intricate details and premium materials, our decor blends seamlessly into any setting while standing out as a signature element. Let your walls speak with soul and sophistication, creating an ambiance that uplifts, comforts, and inspires everyone who walks into your thoughtfully curated space.
            </p>

            <div className="flex justify-center lg:justify-start">
              <Link to='/ProductListing'>
              <button
                style={{ fontFamily: 'Times New Roman' }}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
              >
                Explore New Arrival
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Full Height Image */}
        <div className="w-full lg:w-1/2 lg:h-auto">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-600">Loading image...</p>
            </div>
          ) : (
            <img
              src={wall ? `${API_URL}/${wall.imageUrl}` : frame}
              alt="Wall Frame Art"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default WallArtIntro;