import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, userToken } from "../../Components/Variable";
import {
  FiInstagram,
  FiTrash2,
  FiEdit,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const AddPostForm = () => {
  const [formData, setFormData] = useState({
    instagramLink: "",
    image: null,
  });
  const [editData, setEditData] = useState(null); // State for editing post
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [editPreview, setEditPreview] = useState(""); // Preview for edit form
    const userData = userToken();
    const token = userData?.token;

  // Fetch existing posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/socialpost/getallpost`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditPreview(URL.createObjectURL(file));
      setEditData({ ...editData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("instagramLink", formData.instagramLink);
      data.append("image", formData.image);

      const response = await axios.post(
        `${API_URL}/socialpost/createpost`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Post Created");
        setPosts([response.data, ...posts]);
        setFormData({ instagramLink: "", image: null });
        setPreview("");
      }
    } catch (err) {
      toast.error("Failed To Create Post");

      setError(err.response?.data?.error || "Post creation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("instagramLink", editData.instagramLink);
      if (editData.image) {
        data.append("image", editData.image);
      }

      const response = await axios.put(
        `${API_URL}/socialpost/updatepost/${editData.postId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setPosts(
          posts.map((post) =>
            post.postId === editData.postId ? response.data : post
          )
        );
        toast.success("Post Updated");
        setEditData(null); // Close edit form
        setEditPreview("");
      }
    } catch (err) {
      toast.error("Something Went Wrong");

      setError(err.response?.data?.error || "Post update failed");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`${API_URL}/socialpost/deletepost/${postId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      setPosts(posts.filter((post) => post.postId !== postId));
      toast.success("Post Deleted");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Something Went Wrong");
    }
  };

  const startEditing = (post) => {
    setEditData({
      postId: post.postId,
      instagramLink: post.instagramLink,
      image: null,
    });
    setEditPreview(`${API_URL}/${post.imageUrl}`); // Show existing image as preview
  };
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Create Post Form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FiInstagram className="w-5 h-5" />
          Manage Social Posts
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="group relative h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                id="postFile"
              />
              <label
                htmlFor="postFile"
                className="h-full flex flex-col items-center justify-center p-4"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <FiUploadCloud className="w-12 h-12 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" />
                    <p className="text-gray-500 text-center">
                      <span className="text-blue-500 font-medium">
                        Upload Post Image
                      </span>
                      <br />
                      <span className="text-sm text-gray-400">
                        1600x900 recommended
                      </span>
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Link
                </label>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                  <FiInstagram className="text-gray-400" />
                  <input
                    type="url"
                    value={formData.instagramLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instagramLink: e.target.value,
                      })
                    }
                    placeholder="https://instagram.com/p/..."
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? "Uploading..." : "Publish Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* Edit Post Form (Modal-like) */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Edit Post</h2>
              <button
                onClick={() => setEditData(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  onChange={handleEditFileChange}
                  accept="image/*"
                  className="hidden"
                  id="editFileInput"
                />
                <label htmlFor="editFileInput" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <FiUploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                    {editPreview ? (
                      <img
                        src={editPreview}
                        alt="Preview"
                        className="max-h-48 rounded-lg object-cover mb-4"
                      />
                    ) : (
                      <>
                        <p className="text-gray-500 font-medium">
                          Click to upload new image
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          PNG, JPG, JPEG (Max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Instagram Link Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Instagram Post Link
                </label>
                <div className="flex items-center gap-2">
                  <FiInstagram className="text-gray-400" />
                  <input
                    type="url"
                    value={editData.instagramLink}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        instagramLink: e.target.value,
                      })
                    }
                    placeholder="https://instagram.com/p/..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Updating..." : "Update Post"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditData(null)}
                  className="flex-1 py-3 px-6 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.postId}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={`${API_URL}/${post.imageUrl}`}
              alt="Post"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <a
                  href={post.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  <FiInstagram className="inline-block" />
                  View on Instagram
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(post)}
                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => deletePost(post.postId)}
                    className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Posted: {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddPostForm;
