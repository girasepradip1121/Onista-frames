import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Components/Variable';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const FrameDetail = () => {
  const { frameId } = useParams();
  const [frame, setFrame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchFrame = async () => {
      try {
        const response = await axios.get(`${API_URL}/frame/getbyid/${frameId}`);
        console.log('Frame:', response.data.data);
        setFrame(response.data.data);
      } catch (error) {
        console.error('Error fetching frame:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFrame();
  }, [frameId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!frame) {
    return (
      <div className="text-center py-12 bg-gray-100 min-h-screen">
        <p className="text-gray-600 text-lg font-medium">Frame not found</p>
        <Link
          to="/admin/frame"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mt-4 text-base font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Frames
        </Link>
      </div>
    );
  }

  // Transform images to array of strings
  const images = frame.images ? frame.images.map(img => img.imageUrl) : [];

  // Parse colors, careInstruction, and includes if they are strings
  const parseArrayField = (field) => {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        console.error(`Error parsing ${field}:`, e);
        return [];
      }
    }
    return field || [];
  };

  const colors = parseArrayField(frame.colors);
  const careInstruction = parseArrayField(frame.careInstruction);
  const includes = parseArrayField(frame.includes);

  // Validate CSS color
  const isValidColor = (color) => {
    const s = new Option().style;
    s.backgroundColor = color;
    return s.backgroundColor !== '';
  };

  // Get material names from frame data
  const material = frame.material?.materialName || 'N/A';
  const frameMaterial = frame.frameMaterial?.materialName || 'N/A';

  // Stock status component
  const StockStatus = ({ remained_qty }) => {
    if (remained_qty === 0) {
      return (
        <span className="flex items-center text-red-600 text-xs sm:text-sm">
          <XCircle className="w-4 h-4 mr-1" />
          Out of Stock
        </span>
      );
    }
    if (remained_qty <= 5) {
      return (
        <span className="flex items-center text-yellow-600 text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 mr-1" />
          Low Stock: {remained_qty} left
        </span>
      );
    }
    return (
      <span className="flex items-center text-green-600 text-xs sm:text-sm">
        <CheckCircle className="w-4 h-4 mr-1" />
        In Stock: {remained_qty}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/admin/frame"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm sm:text-base font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back to Frames
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden shadow-md">
                {images.length > 0 ? (
                  <img
                    src={`${API_URL.replace(/\/$/, '')}${images[selectedImage]}`}
                    alt={frame.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-300 ease-in-out transform hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm sm:text-base">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-blue-600 shadow-md'
                        : 'border-gray-200 hover:border-blue-400 hover:shadow-sm'
                    }`}
                  >
                    <img
                      src={`${API_URL.replace(/\/$/, '')}${image}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {frame.name}
              </h1>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {frame.description || 'No description available'}
                  </p>
                </div>

                {/* Sizes & Pricing */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                    Available Sizes & Prices
                  </h3>
                  <div className="grid gap-3">
                    {frame.frameSizes && frame.frameSizes.length > 0 ? (
                      frame.frameSizes.map((frameSize, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                            <span className="font-medium text-gray-700 text-sm sm:text-base">
                              {frameSize.size
                                ? `${frameSize.size.width} x ${frameSize.size.height} inch`
                                : 'N/A'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600 font-bold text-sm sm:text-base">
                                ₹{frameSize.offer_price || frameSize.price}
                              </span>
                              {frameSize.offer_price && (
                                <span className="text-gray-400 line-through text-xs sm:text-sm">
                                  ₹{frameSize.price}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                            <StockStatus remained_qty={frameSize.remained_qty || 0} />
                            <span>Material: {material}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">No sizes available</p>
                    )}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    Colors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.length > 0 ? (
                      colors.map((color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm transition-transform duration-200 hover:scale-105"
                          style={{
                            backgroundColor: isValidColor(color.toLowerCase())
                              ? color.toLowerCase()
                              : '#e5e7eb',
                            color: isValidColor(color.toLowerCase()) ? '#ffffff' : '#374151',
                          }}
                        >
                          {color}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">No colors available</p>
                    )}
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    Specifications
                  </h3>
                  <dl className="space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500 font-medium">Weight</dt>
                      <dd className="text-gray-700">{frame.weight ? `${frame.weight} kg` : 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500 font-medium">Origin</dt>
                      <dd className="text-gray-700">{frame.origin || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500 font-medium">Material</dt>
                      <dd className="text-gray-700">{material}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="text-gray-500 font-medium">Frame Material</dt>
                      <dd className="text-gray-700">{frameMaterial}</dd>
                    </div>
                  </dl>
                </div>

                {/* Care Instructions & Includes */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      Care Instructions
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm sm:text-base">
                      {careInstruction.length > 0 ? (
                        careInstruction.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))
                      ) : (
                        <li>No care instructions available</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      What's Included
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm sm:text-base">
                      {includes.length > 0 ? (
                        includes.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))
                      ) : (
                        <li>No items included</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameDetail;