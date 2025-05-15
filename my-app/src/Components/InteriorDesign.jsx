// import React, { useEffect, useState } from 'react';
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { API_URL } from './Variable';
// import axios from 'axios';

// const settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 1,
//   slidesToScroll: 1,
//   autoplay: true,
//   autoplaySpeed: 2000,
//   arrows: false, // Hide arrows for smaller screens
// };

// const InteriorDesign = () => {
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     axios.get(`${API_URL}/slider/active`)
//       .then((response) => {
//         setImages(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching images:', error);
//       });
//   }, []);
//   return (
//     <div className="relative w-full">
//       {/* Slider */}
//       <Slider {...settings}>
//         {images.map((slide) => (
//           <div key={slide.sliderId} className="w-full">
//             {/* {console.log("image",`${API_URL}/${slide.imageUrl}`)} */}
            
//             <div
//               className="bg-cover bg-center h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-screen"
//               style={{
//                 backgroundImage: `url(${API_URL}/${slide.imageUrl})`,
//               }}
//             >
//               {/* Optional content inside slides */}
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default InteriorDesign;

import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import './styles/slick-custom.css'; 
import { API_URL } from './Variable';
import axios from 'axios';

const InteriorDesign = () => {
  const [images, setImages] = useState([]);

  // Slider settings
  const settings = {
    dots: images.length > 1, // Show dots only for multiple slides
    infinite: images.length > 1, // Disable infinite scroll for single slide
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: images.length > 1, // Disable autoplay for single slide
    autoplaySpeed: 2000,
    arrows: false,
    adaptiveHeight: true, // Adjust height to content
  };

  useEffect(() => {
    axios.get(`${API_URL}/slider/active`)
      .then((response) => {
        console.log('API response:', response.data);
        setImages(response.data || []);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
        setImages([]);
      });
  }, []);

  return (
    <div className="relative w-full max-h-screen overflow-hidden">
      {images.length > 0 ? (
        <Slider {...settings} className="w-full">
          {images.map((slide) => (
            <div key={slide.sliderId} className="w-full">
              <div
                className="relative bg-cover bg-center h-[50vh] sm:h-[60vh] md:h-[80vh] max-h-[100vh] w-full"
                style={{
                  backgroundImage: `url(${API_URL.replace(/\/$/, '')}/${slide.imageUrl})`,
                }}
              >
                {/* Optional overlay for better text visibility */}
                <div className="absolute inset-0 transition-opacity duration-300" />
                {/* Optional content */}
                {/* <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                  <div className="px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold drop-shadow-lg">
                      {slide.title || 'Elegant Interiors'}
                    </h2>
                    <p className="mt-2 text-sm sm:text-lg md:text-xl drop-shadow-md hidden sm:block">
                      {slide.description || 'Transform your space with our designs'}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="w-full h-[50vh] sm:h-[60vh] md:h-[80vh] max-h-[100vh] flex items-center justify-center bg-gray-200">
          <p className="text-gray-600 text-lg font-serif">No slides available</p>
        </div>
      )}
    </div>
  );
};

export default InteriorDesign;