import React, { useState } from 'react';
import { FiSliders, FiInstagram, FiImage, FiArrowRight } from 'react-icons/fi';
import AddPostForm from './AddPostForm';
import AddSliderForm from './AdminSlider';
import AddWallForm from './AddWallForm';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('sliders');

  const tabs = [
    {
      id: 'sliders',
      label: 'Hero Sliders',
      icon: <FiSliders className="w-5 h-5 mr-2" />,
      component: <AddSliderForm />
    },
    {
      id: 'posts',
      label: 'Social Posts',
      icon: <FiInstagram className="w-5 h-5 mr-2" />,
      component: <AddPostForm />
    },
    {
      id: 'wall',
      label: 'Wall Section',
      icon: <FiImage className="w-5 h-5 mr-2" />,
      component: <AddWallForm />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          Home Page Manager
          <FiArrowRight className="mx-3 text-gray-400" />
          <span className="text-blue-600">{tabs.find(t => t.id === activeTab)?.label}</span>
        </h1>
        <p className="text-gray-600 mt-2">Manage your website's homepage content and layout</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-5 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-md border border-blue-50'
                : 'text-gray-600 hover:bg-white hover:text-blue-500'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {tabs.find(t => t.id === activeTab)?.component}
      </div>

      {/* Footer Note */}
      <p className="text-gray-500 text-sm mt-6 text-center">
        Changes may take up to 5 minutes to reflect on the live website
      </p>
    </div>
  );
};

export default SettingsPage;