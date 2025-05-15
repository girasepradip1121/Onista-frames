import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, userToken } from '../../Components/Variable';
import { FiTrash2, FiEdit, FiUploadCloud, FiX, FiImage } from 'react-icons/fi';import { toast } from 'react-hot-toast';

const AddWallForm = () =>{
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [wall, setWall] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
    const userData = userToken();
    const token = userData?.token;

  // Fetch existing wall entry
  useEffect(() => {
    const fetchWall = async () => {
      try {
        const res = await axios.get(`${API_URL}/wall/getwall`);
        console.log('wall',res.data);
        
        setWall(res.data);
        setFormData({
          title: res.data.title,
          description: res.data.description || '',
          image: null,
        });
        setPreview(`${API_URL}/${res.data.imageUrl}`);
        setEditMode(true);
      } catch (err) {
        if (err.response?.status === 404) {
          setWall(null); // No wall entry exists
        } else {
          console.error('Error fetching wall:', err);
        }
      }
    };
    fetchWall();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      } else if (!editMode) {
        throw new Error('Image is required');
      }

      const response = await axios.post(`${API_URL}/wall/createwall`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
      });

      setWall(response.data);
      setEditMode(true);
      setPreview(`${API_URL}/${response.data.imageUrl}`);
      toast.success('Wall entry saved');
    } catch (err) {
      setError(err.message || 'Failed to save wall entry');
      toast.error('Failed to save wall entry');
    } finally {
      setLoading(false);
    }
  };

  const deleteWall = async () => {
    try {
      await axios.delete(`${API_URL}/wall/deletewall`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      setWall(null);
      setFormData({ title: '', description: '', image: null });
      setPreview('');
      setEditMode(false);
      toast.success('Wall entry deleted');
    } catch (err) {
      console.error('Error deleting wall:', err);
      toast.error('Failed to delete wall entry');
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FiImage className="w-5 h-5" />
          {editMode ? 'Edit Wall Section' : 'Create Wall Section'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload */}  
            <div className="group relative h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                id="wallFile"
              />
              <label htmlFor="wallFile" className="h-full flex flex-col items-center justify-center p-4">
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
                      <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
                      <br />
                      <span className="text-sm text-gray-400">PNG, JPG up to 5MB</span>
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="Wall Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none resize-none"
                  rows="4"
                  placeholder="Add a detailed description..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Saving...' : (editMode ? 'Update Wall' : 'Publish Wall')}
            </button>
            
            {editMode && (
              <button
                type="button"
                onClick={deleteWall}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
                Delete Wall
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Preview Section */}
      {wall && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">Current Wall Preview</h3>
          <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden">
            <img
              src={`${API_URL}/${wall.imageUrl}`}
              alt="Wall Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-medium">{wall.title}</h4>
            <p className="text-gray-600">{wall.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};


export default AddWallForm;
