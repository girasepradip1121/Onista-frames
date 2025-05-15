import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, userToken } from "../../Components/Variable";
import toast from "react-hot-toast";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

const NewsModal = ({ isOpen, onClose, news, refreshNews }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    shortDesc:"",
    image: null,
    sections: [],
    existingImage: ""
  });

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("Basic");
  const userData = userToken();
  const token = userData?.token;

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (news) {
        setFormData({
          title: news.title,
          author: news.author,
          shortDesc:news.shortDesc ||"",
          sections: news.sections || [],
          existingImage: news.image
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, news]);

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      shortDesc:"",
      image: null,
      sections: [],
      existingImage: ""
    });
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { 
        sectionTitle: "", 
        content: "", 
        bullets: [] 
      }]
    });
  };

  const removeSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const addBullet = (sectionIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].bullets.push("");
    setFormData({ ...formData, sections: newSections });
  };

  const handleBulletChange = (sectionIndex, bulletIndex, value) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].bullets[bulletIndex] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const removeBullet = (sectionIndex, bulletIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].bullets = newSections[sectionIndex].bullets.filter(
      (_, i) => i !== bulletIndex
    );
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("author", formData.author);
    formPayload.append("shortDesc", formData.shortDesc);

    // Append sections as JSON
    formPayload.append("sections", JSON.stringify(formData.sections));

    // Handle image upload
    if (formData.image) {
      formPayload.append("image", formData.image);
    }

    try {
      const endpoint = news 
        ? `${API_URL}/news/updatenews/${news.newsId}`
        : `${API_URL}/news/createnews`;

      const response = await axios({
        method: news ? "put" : "post",
        url: endpoint,
        data: formPayload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`News ${news ? "updated" : "created"} successfully!`);
      refreshNews();
      onClose();
    } catch (error) {
      console.error("Error saving news:", error.response?.data || error.message);
      toast.error(`Failed to ${news ? "update" : "create"} news`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {news ? "Edit News" : "Create News"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {["Basic", "Content", "Image"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded capitalize ${
                activeSection === section
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information Section */}
          {activeSection === "Basic" && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Author*
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Short Description*
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.shortDesc}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDesc: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Content Section */}
          {activeSection === "Content" && (
            <div className="space-y-4">
              {formData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border p-4 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={section.sectionTitle}
                      onChange={(e) =>
                        handleSectionChange(
                          sectionIndex,
                          "sectionTitle",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Content
                    </label>
                    <textarea
                      rows="3"
                      className="w-full p-2 border rounded"
                      value={section.content}
                      onChange={(e) =>
                        handleSectionChange(
                          sectionIndex,
                          "content",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Bullets
                    </label>
                    {section.bullets?.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={bullet}
                          onChange={(e) =>
                            handleBulletChange(
                              sectionIndex,
                              bulletIndex,
                              e.target.value
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(sectionIndex, bulletIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addBullet(sectionIndex)}
                      className="text-indigo-600 flex items-center gap-1"
                    >
                      <PlusCircleIcon className="h-5 w-5" />
                      Add Bullet
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Section
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSection}
                className="text-indigo-600 flex items-center gap-1"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Add New Section
              </button>
            </div>
          )}

          {/* Image Section */}
          {activeSection === "Image" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                News Image
              </label>
              <div className="grid grid-cols-1 gap-4">
                {formData.existingImage && (
                  <div className="relative border p-2 rounded">
                    <img
                      src={`${API_URL}/${formData.existingImage}`}
                      alt="Existing"
                      className="h-48 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, existingImage: "" })}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <label className="border-2 border-dashed rounded-lg h-48 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormData({ 
                        ...formData, 
                        image: file,
                        existingImage: URL.createObjectURL(file)
                      });
                    }}
                  />
                  <PlusCircleIcon className="h-8 w-8 text-gray-400" />
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsModal;