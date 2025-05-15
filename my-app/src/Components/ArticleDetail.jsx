// // src/pages/ArticleDetail.jsx
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import NewsImg from "../image/News.svg";

// const articles = new Array(6).fill({
//   title: "The Art of Canvas Print Preparation",
//   description:
//     "Canvas prints have become a popular choice for home décor and art displays, known for their ability to turn photographs and artwork into stunning visual pieces...",
//   fullText: `CONSIDER YOUR LIVING ROOM'S STYLE.

// For modern spaces, consider geometric patterns, abstract designs, or black and white photography. Traditional rooms often pair well with landscapes, classical portraits, or ornate framed prints. Eclectic spaces can handle bold, colorful pieces that might incorporate mixed media or unusual subjects.

// SIZE AND SCALE MATTER

// One of the most common mistakes in selecting wall art is choosing pieces that are too small for the space. As a general rule:
// - For large walls, opt for larger pieces or a gallery wall arrangement... - The art should take up approximately 2/3 to 3/4 of the available wall space
// - When hanging art above furniture, choose a piece that is about 2/3 to 3/4 the width of the furniture

// Remember that oversized art can create a dramatic focal point, while smaller pieces can get lost on a large wall unless grouped together.`,
//   image: NewsImg,
//   author: "KRUSHANT VAMJA",
//   role: "Developer",
//   tags: ["Wall Art", "Interior Design", "Decor Tips"]
// });

// const ArticleDetail = () => {
//   const { id } = useParams();
//   const article = articles[id];

//   if (!article) return <div>Article not found</div>;

//   return (
//     <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 bg-white">
//       <div className="mb-6 text-sm">
//         <Link to="/">Home</Link> / <Link to="/news">News</Link> / {article.title}
//       </div>
//       <img src={article.image} alt="Article" className="w-full h-100 object-cover rounded-md mb-8" />
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
//         <div className="flex items-center gap-4 mb-4 sm:mb-0">
//           <img src="https://i.pravatar.cc/100" alt={article.author} className="w-14 h-14 rounded-full object-cover" />
//           <div>
//             <h4 className="text-base sm:text-lg">{article.author}</h4>
//             <p className="text-sm text-gray-500">{article.role}</p>
//           </div>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {article.tags.map((tag, i) => (
//             <span key={i} className="text-xs sm:text-sm px-3 py-1 bg-black text-white rounded-full">
//               {tag}
//             </span>
//           ))}
//         </div>
//       </div>
//       <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
//         {article.fullText}
//       </p>
//     </div>
//   );
// };

// export default ArticleDetail;

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Components/Variable";
import NewsPlaceholder from "../image/News.svg";

const ArticleDetail = () => {
  const { newsId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${API_URL}/news/getbyid/${newsId}`);
        if (response.data.success) {
          setArticle(response.data.data);
          console.log("response", response.data.data);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [newsId]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-12">{error}</div>;
  if (!article)
    return <div className="text-center py-12">Article not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8 text-sm text-gray-600">
        <Link to="/" className="hover:text-gray-800">
          Home
        </Link>{" "}
        /
        <Link to="/news" className="hover:text-gray-800">
          {" "}
          News
        </Link>{" "}
        /<span className="text-gray-800">{article.title}</span>
      </nav>

      <article className="bg-white rounded-lg shadow-md">
        {article.image && (
          <img
            src={`${API_URL}/${article.image}`}
            alt={article.title}
            className="w-full h-150 rounded-t-lg"
            onError={(e) => {
              e.target.src = NewsPlaceholder;
            }}
          />
        )}

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>By {article.author}</span>
                <span>•</span>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {article.shortDesc && (
            <p className="text-lg text-gray-700 mb-8">{article.shortDesc}</p>
          )}

          <div className="prose max-w-none">
            {article.sections?.map((section, index) => (
              <section key={index} className="mb-8">
                {section.sectionTitle && (
                  <h2 className="text-xl font-semibold mb-4">
                    {section.sectionTitle}
                  </h2>
                )}
                {section.content && (
                  <p className="text-gray-700 mb-4 whitespace-pre-line">
                    {section.content}
                  </p>
                )}
                {section.bullets && typeof section.bullets === "string" && (
                  <ul className="list-disc pl-6 space-y-2">
                    {JSON.parse(section.bullets).map((bullet, i) => (
                      <li key={i} className="text-gray-600">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
