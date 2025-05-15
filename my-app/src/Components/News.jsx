// import React, { useState } from "react";
// import NewsImg from "../image/News.svg";
// import { Link } from "react-router-dom";

// const articles = new Array(6).fill({
//   title: "The Art of Canvas Print Preparation",
//   description:
//     "Canvas prints have become a popular choice for home décor and art displays, known for their ability to turn photographs and artwork into stunning visual pieces...",
//   fullText: `CONSIDER YOUR LIVING ROOM'S STYLE.

// For modern spaces, consider geometric patterns, abstract designs, or black and white photography. Traditional rooms often pair well with landscapes, classical portraits, or ornate framed prints. Eclectic spaces can handle bold, colorful pieces that might incorporate mixed media or unusual subjects.

// SIZE AND SCALE MATTER

// One of the most common mistakes in selecting wall art is choosing pieces that are too small for the space. As a general rule:
// - For large walls, opt for larger pieces or a gallery wall arrangement
// - The art should take up approximately 2/3 to 3/4 of the available wall space
// - When hanging art above furniture, choose a piece that is about 2/3 to 3/4 the width of the furniture

// Remember that oversized art can create a dramatic focal point, while smaller pieces can get lost on a large wall unless grouped together.`,
//   image: NewsImg,
//   author: "KRUSHANT VAMJA",
//   role: "Developer",
//   tags: ["Wall Art", "Interior Design", "Decor Tips"]
// });

// const News = () => {
//   const [selectedArticle, setSelectedArticle] = useState(null);

//   const handleReadMore = (index) => {
//     setSelectedArticle(articles[index]);
//   };

//   const handleBack = () => {
//     setSelectedArticle(null);
//   };

//   return (
//     <>

//     <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 bg-white">
//     <div className="mb-6 text-sm">
//         <Link to={'/'}><span
//           style={{ fontFamily: "Times New Roman" }}
//           className="text-gray-800 hover:underline"
//         >
//           Home
//         </span></Link>
//         /{" "}
//         <span
//           style={{ fontFamily: "Times New Roman" }}
//           className="text-gray-800"
//         >
//           News
//         </span>
//       </div>

//       {!selectedArticle ? (
//         // News Grid
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//           {articles.map((article, idx) => (
//             <div key={idx}>
//               <img
//                 src={article.image}
//                 alt="Canvas Print"
//                 className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-md"
//               />
//               <h3
//                 style={{ fontFamily: "Times New Roman" }}
//                 className="mt-4 text-base sm:text-lg font-medium uppercase"
//               >
//                 {article.title}
//               </h3>
//               <p className="mt-2 text-sm text-gray-600">{article.description}</p>
//               <button
//                 onClick={() => handleReadMore(idx)}
//                 className="mt-2 block text-sm font-semibold text-black underline hover:text-gray-700"
//               >
//                 READ MORE
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         // Detailed View
//         <div className="max-w-7xl mx-auto">
//           <img
//             src={selectedArticle.image}
//             alt="Article"
//             className="w-full h-100 object-cover rounded-md mb-8"
//           />

//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
//             <div className="flex items-center gap-4 mb-4 sm:mb-0">
//               <img
//                 src="https://i.pravatar.cc/100"
//                 alt={selectedArticle.author}
//                 className="w-14 h-14 rounded-full object-cover"
//               />
//               <div>
//                 <h4
//                   style={{ fontFamily: "Times New Roman" }}
//                   className="text-base sm:text-lg"
//                 >
//                   {selectedArticle.author}
//                 </h4>
//                 <p
//                   style={{ fontFamily: "Times New Roman" }}
//                   className="text-sm text-gray-500"
//                 >
//                   {selectedArticle.role}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {selectedArticle.tags.map((tag, i) => (
//                 <span
//                   key={i}
//                   style={{ fontFamily: "Times New Roman" }}
//                   className="text-xs sm:text-sm px-3 py-1 bg-black text-white rounded-full"
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <p
//             style={{ fontFamily: "Times New Roman" }}
//             className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line"
//           >
//             {selectedArticle.fullText}
//           </p>

//         </div>
//       )}
//     </div>
//     </>
//   );
// };

// export default News;

// // import React, { useState } from "react";
// // import NewsImg from "../image/News.svg";
// // import { Link } from "react-router-dom";

// // const articles = new Array(6).fill({
// //   title: "The Art of Canvas Print Preparation",
// //   description:
// //     "Canvas prints have become a popular choice for home décor and art displays, known for their ability to turn photographs and artwork into stunning visual pieces...",
// //   fullText: `CONSIDER YOUR LIVING ROOM'S STYLE.

// // For modern spaces, consider geometric patterns, abstract designs, or black and white photography. Traditional rooms often pair well with landscapes, classical portraits, or ornate framed prints. Eclectic spaces can handle bold, colorful pieces that might incorporate mixed media or unusual subjects.

// // SIZE AND SCALE MATTER

// // One of the most common mistakes in selecting wall art is choosing pieces that are too small for the space. As a general rule:
// // - For large walls, opt for larger pieces or a gallery wall arrangement
// // - The art should take up approximately 2/3 to 3/4 of the available wall space
// // - When hanging art above furniture, choose a piece that is about 2/3 to 3/4 the width of the furniture

// // Remember that oversized art can create a dramatic focal point, while smaller pieces can get lost on a large wall unless grouped together.`,
// //   image: NewsImg,
// //   author: "KRUSHANT VAMJA",
// //   role: "Developer",
// //   tags: ["Wall Art", "Interior Design", "Decor Tips"]
// // });

// // const News = () => {
// //   const [selectedArticle, setSelectedArticle] = useState(null);

// //   const handleReadMore = (index) => {
// //     setSelectedArticle(articles[index]);
// //   };

// //   const handleBack = () => {
// //     setSelectedArticle(null);
// //   };

// //   return (
// //     <>

// //     <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 bg-white">
// //     <div className="mb-6 text-sm">
// //         <Link to={'/'}><span
// //           style={{ fontFamily: "Times New Roman" }}
// //           className="text-gray-800 hover:underline"
// //         >
// //           Home
// //         </span></Link>
// //         /{" "}
// //         <span
// //           style={{ fontFamily: "Times New Roman" }}
// //           className="text-gray-800"
// //         >
// //           News
// //         </span>
// //       </div>

// //       {!selectedArticle ? (
// //         // News Grid
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
// //           {articles.map((article, idx) => (
// //             <div key={idx}>
// //               <img
// //                 src={article.image}
// //                 alt="Canvas Print"
// //                 className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-md"
// //               />
// //               <h3
// //                 style={{ fontFamily: "Times New Roman" }}
// //                 className="mt-4 text-base sm:text-lg font-medium uppercase"
// //               >
// //                 {article.title}
// //               </h3>
// //               <p className="mt-2 text-sm text-gray-600">{article.description}</p>
// //               <button
// //                 onClick={() => handleReadMore(idx)}
// //                 className="mt-2 block text-sm font-semibold text-black underline hover:text-gray-700"
// //               >
// //                 READ MORE
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       ) : (
// //         // Detailed View
// //         <div className="max-w-7xl mx-auto">
// //           <img
// //             src={selectedArticle.image}
// //             alt="Article"
// //             className="w-full h-100 object-cover rounded-md mb-8"
// //           />

// //           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
// //             <div className="flex items-center gap-4 mb-4 sm:mb-0">
// //               <img
// //                 src="https://i.pravatar.cc/100"
// //                 alt={selectedArticle.author}
// //                 className="w-14 h-14 rounded-full object-cover"
// //               />
// //               <div>
// //                 <h4
// //                   style={{ fontFamily: "Times New Roman" }}
// //                   className="text-base sm:text-lg"
// //                 >
// //                   {selectedArticle.author}
// //                 </h4>
// //                 <p
// //                   style={{ fontFamily: "Times New Roman" }}
// //                   className="text-sm text-gray-500"
// //                 >
// //                   {selectedArticle.role}
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="flex flex-wrap gap-2">
// //               {selectedArticle.tags.map((tag, i) => (
// //                 <span
// //                   key={i}
// //                   style={{ fontFamily: "Times New Roman" }}
// //                   className="text-xs sm:text-sm px-3 py-1 bg-black text-white rounded-full"
// //                 >
// //                   {tag}
// //                 </span>
// //               ))}
// //             </div>
// //           </div>

// //           <p
// //             style={{ fontFamily: "Times New Roman" }}
// //             className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line"
// //           >
// //             {selectedArticle.fullText}
// //           </p>

// //         </div>
// //       )}
// //     </div>

// //     </>
// //   );
// // };

// // export default News;

// src/pages/News.jsx
// import React from "react";
// import NewsImg from "../image/News.svg";
// import { Link } from "react-router-dom";

// const articles = new Array(6).fill({
//   title: "The Art of Canvas Print Preparation",
//   description:
//     "Canvas prints have become a popular choice for home décor and art displays, known for their ability to turn photographs and artwork into stunning visual pieces...",
//   // ... बाकी डेटा
//   image: NewsImg,
//   author: "KRUSHANT VAMJA",
//   role: "Developer",
//   tags: ["Wall Art", "Interior Design", "Decor Tips"]
// });

// const News = () => (
//   <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 bg-white">
//     <div className="mb-6 text-sm">
//       <Link to="/" style={{ fontFamily: "Times New Roman" }} className="text-gray-800 hover:underline">Home</Link> / <span style={{ fontFamily: "Times New Roman" }} className="text-gray-800 hover:underline"> News</span>
//     </div>
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//       {articles.map((article, idx) => (
//         <div key={idx}>
//           <img src={article.image} alt="Canvas Print" className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-md" />
//           <h3 className="mt-4 text-base sm:text-lg font-medium uppercase">{article.title}</h3>
//           <p className="mt-2 text-sm text-gray-600">{article.description}</p>
//           <Link
//             to={`/news/${idx}`}
//             className="mt-2 block text-sm font-semibold text-black underline hover:text-gray-700"
//           >
//             READ MORE
//           </Link>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// export default News;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../Components/Variable";
import NewsPlaceholder from "../image/News.svg"; // Placeholder image

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/news/getallnews`);
        setNews(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-12">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 bg-white">
      <div className="mb-6 text-sm">
        <Link
          to="/"
          style={{ fontFamily: "Times New Roman" }}
          className="text-gray-800 hover:underline"
        >
          Home
        </Link>{" "}
        /{" "}
        <span
          style={{ fontFamily: "Times New Roman" }}
          className="text-gray-800 hover:underline"
        >
          News
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {news.map((article) => (
          <div key={article.newsId}>
            <img
              src={
                article.image ? `${API_URL}/${article.image}` : NewsPlaceholder
              }
              alt={article.title}
              className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-md"
            />
            <h3 className="mt-4 text-base sm:text-lg font-medium uppercase">
              {article.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {(article.shortDesc || "No description available")
                .split(" ")
                .slice(0, 20)
                .join(" ") +
                (article.shortDesc?.split(" ").length > 20 ? "..." : "")}
            </p>
            <Link
              to={`/news/${article.newsId}`}
              className="mt-2 block text-sm font-semibold text-black underline hover:text-gray-700"
            >
              READ MORE
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
