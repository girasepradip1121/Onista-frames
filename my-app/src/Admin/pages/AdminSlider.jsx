import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, userToken } from "../../Components/Variable";
import toast from "react-hot-toast";

const AdminSlider = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const userData = userToken();
  const token = userData?.token;

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/slider/active`);
      setImages(response.data);
    } catch (err) {
      setError("Error fetching images");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("imageUrl", file);

    try {
      const response = await axios.post(
        `${API_URL}/slider/createslider`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Image Added");
      setSuccess("Image uploaded successfully");
      setFile(null);
      fetchImages();
    } catch (err) {
      const message = err.response?.data?.message || "Error uploading image";
      setError(message);
    }
  };

  const handleDelete = async (sliderId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/slider/delete/${sliderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Deleted");
      setSuccess("Image deleted successfully");
      fetchImages();
    } catch (err) {
      const message = err.response?.data?.message || "Error deleting image";
      setError(message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Slider Images</h1>

      {/* Upload Section */}
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload Image
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>

      {/* Image List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images?.map((image) => (
          <div key={image.sliderId} className="border p-2 rounded">
            <img
              src={`${API_URL}/${image.imageUrl}`}
              alt="Slider"
              className="w-full h-40 object-cover mb-2"
            />
            <button
              onClick={() => handleDelete(image.sliderId)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSlider;
