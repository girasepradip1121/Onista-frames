import React from "react";
import leaf  from "../image/leaf.svg"; // Make sure to replace this with your actual path
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="relative bg-white px-4 sm:px-8 md:px-16 lg:px-24 py-16 overflow-hidden">
      {/* Decorative Leaf Image */}
      <img
        src={leaf}
        alt="Decorative Leaf"
        className="hidden md:block absolute top-20 right-0 w-50 md:w-50 lg:w-60 opacity-100"
      />

      {/* Breadcrumb */}
      <div className="mb-6 text-sm max-w-7xl mx-auto">
              <Link to={'/'}><span
                style={{ fontFamily: "Times New Roman" }}
                className="text-gray-800 hover:underline"
              >
                Home
              </span></Link>
              /{" "}
              <span
                style={{ fontFamily: "Times New Roman" }}
                className="text-gray-800"
              >
                About
              </span>
            </div>
      

      {/* Our Story */}
      <section className="text-center mb-16">
        <h2  style={{ fontFamily: "Times New Roman" }} className="text-xl md:text-2xl font-semibold mb-2 tracking-wide">
          Our Story
        </h2>
        <p  style={{ fontFamily: "Times New Roman" }} className="text-sm md:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
        Delivering elegant, story-rich, culturally inspired wall art to modern homes since 2018.
        </p>
      </section>

      {/* Our Mission */}
      <section className="text-center mb-16">
        <h2  style={{ fontFamily: "Times New Roman" }} className="text-xl md:text-2xl font-semibold mb-4 tracking-wide">
          Our Mission
        </h2>
        <p  style={{ fontFamily: "Times New Roman" }} className="text-sm md:text-base text-gray-700 max-w-4xl mx-auto leading-relaxed">
        To promote healthier lifestyles by offering natural, nutritious, and sustainable food alternatives that benefit both people and the planet.
        </p>
        {/* <p className="text-sm md:text-base text-gray-700 max-w-4xl mx-auto leading-relaxed mt-4">
          We are committed to supporting artisan communities, using sustainable materials, and bringing the rich artistic traditions of India to homes around the world.
        </p> */}
      </section>

      {/* Our Vision */}
      <section className="text-center mb-16">
        <h2  style={{ fontFamily: "Times New Roman" }} className="text-xl md:text-2xl font-semibold mb-4 tracking-wide">
          Our Vision
        </h2>
        <p   style={{ fontFamily: "Times New Roman" }} className="text-sm md:text-base text-gray-700 max-w-4xl mx-auto leading-relaxed">
        
        To become a leading global brand in natural and healthy food products, inspiring conscious consumption while championing sustainability.  </p>
        {/* <p className="text-sm md:text-base text-gray-700 max-w-4xl mx-auto leading-relaxed mt-4">
          Our goal is to be the global leader in culturally inspired wall art, known for our commitment to quality, sustainability, and the preservation of artistic traditions.
        </p> */}
      </section>

      {/* Our Commitment to Sustainability */}
      <section className="text-center">
        <h2  style={{ fontFamily: "Times New Roman" }} className="text-xl md:text-2xl font-semibold mb-4 tracking-wide">
        Brand Values
        </h2>
        {/* <p className="text-sm md:text-base text-gray-700 max-w-4xl mx-auto leading-relaxed mb-4">
          At Oriana, we believe that beautiful art shouldn’t come at the expense of our planet. Our commitment to sustainability guides every aspect of our business:
        </p> */}
        <ul  style={{ fontFamily: "Times New Roman" }} className="text-sm md:text-base text-gray-500 max-w-3xl mx-auto  space-y-4 ">
          <li>Health & Wellness – Providing nutritious, clean-label food products.</li>
          <li>Sustainability – Using eco-friendly sourcing, packaging, and waste reduction strategies.</li>
          <li>Innovation – Developing unique, healthy alternatives to traditional snacks and beverages.</li>
          <li>Transparency – Ensuring honesty in our ingredients, sourcing, and production processes.</li>
          <li>Customer-Centric Approach – Prioritizing taste, quality, and satisfaction.</li>
        </ul>
      </section>
    </div>
  );
};

export default About;
