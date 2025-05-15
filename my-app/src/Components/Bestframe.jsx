import React from 'react'


import { Heart, ShoppingBag } from "lucide-react";
import { Link } from 'react-router-dom';


import p1 from "../image/p1.svg";
import p2 from "../image/p3.svg";
import p3 from "../image/p2.svg";
import p4 from "../image/p4.svg";


const artworks = [
    {
      id: 1,
      image: p1,
      title: "PORTLAND",
      description: "Discover our featured art collection.",
      price: "₹1200.00",
    },
    {
      id: 2,
      image: p2,
      title: "STORMY LANDSCAPE",
      description: "Dramatic cloudscape over rural setting.",
      price: "₹1500.00",
    },
    {
      id: 3,
      image: p3,
      title: "PORTRAIT",
      description: "Elegant framed portrait in soft tones.",
      price: "₹1800.00",
    },
    {
      id: 4,
      image: p4,
      title: "SUNSET PALMS",
      description: "Tropical sunset with palm trees.",
      price: "₹2000.00",
    },
  ];


export default function Bestframe() {
  return (
  <>
  <div
        style={{ fontFamily: "Times New Roman" }}
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xlr">
          BEST SELLING PRODUCT
          </h2>
          <p className="text-xs sm:text-sm mt-2">
          Explore our best selling product.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="relative rounded-lg overflow-hidden group"
            >
              <div className="aspect-square relative">
                <img
                  src={artwork.image || "/placeholder.svg"}
                  alt={artwork.title || "Artwork"}
                  fill
                  className="object-cover"
                />

                {/* Icons that appear on hover */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link to="/"><button className="bg-black text-white p-2 rounded-full hover:bg-gray-800 cursor-pointer">
                    <ShoppingBag size={18} />
                  </button>
                  </Link>
                  <Link to="/">
                  <button className="bg-black text-white p-2 rounded-full hover:bg-gray-800 cursor-pointer">
                    <Heart size={18} />
                  </button>
                  </Link>
                </div>

                {/* Description overlay that appears on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                  <h3 className="font-medium text-lg">{artwork.title}</h3>
                  <p className="text-xs">{artwork.description}</p>
                  <p className="mt-2 font-semibold">{artwork.price}</p>
                 
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  </>
  )
}
