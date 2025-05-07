"use client";

import { useSelector, useDispatch } from "react-redux";
import SearchInput from "./SearchInput";
import {
  selectAllImages,
  selectCategories,
  selectSelectedCategory,
  selectTheme,
  selectLoading,
  selectError,
  setSelectedCategory,
  toggleTheme,
  fetchPhotos,
} from "../../features/photosSlice";
import { useState, useEffect } from "react";

export default function Gallery() {
  const dispatch = useDispatch();
  const images = useSelector(selectAllImages);
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const theme = useSelector(selectTheme);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch images when component mounts
  useEffect(() => {
    dispatch(fetchPhotos("popular"));
  }, [dispatch]);

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
    dispatch(fetchPhotos(category));
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // Handle image click to show details
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Close image details modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Derive theme-based styling
  const isDark = theme === "dark";
  const buttonStyle = isDark
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white";
  const selectedButtonStyle = isDark
    ? "bg-yellow-600 text-white"
    : "bg-yellow-500 text-white";
  const cardStyle = isDark
    ? "bg-gray-800 text-white"
    : "bg-white text-gray-900 shadow-md";

  // Function to get fallback inline styles in case Tailwind fails
  const getFallbackStyles = () => {
    if (isDark) {
      return {
        container: { padding: "20px" },
        button: {
          backgroundColor: "#2563eb",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          margin: "4px",
          cursor: "pointer",
        },
        selectedButton: {
          backgroundColor: "#ca8a04",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          margin: "4px",
          cursor: "pointer",
        },
        card: {
          backgroundColor: "#1f2937",
          color: "white",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "16px",
        },
      };
    } else {
      return {
        container: { padding: "20px" },
        button: {
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          margin: "4px",
          cursor: "pointer",
        },
        selectedButton: {
          backgroundColor: "#eab308",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          margin: "4px",
          cursor: "pointer",
        },
        card: {
          backgroundColor: "white",
          color: "#111827",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          marginBottom: "16px",
        },
      };
    }
  };

  const fallbackStyles = getFallbackStyles();

  return (
    <div>
      {/* Theme Toggling and Category Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <button
            onClick={handleThemeToggle}
            className={`px-4 py-2 rounded-md ${buttonStyle}`}
            style={fallbackStyles.button}
          >
            Switch to {isDark ? "Light" : "Dark"} Mode
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handleCategoryChange("popular")}
            className={`px-3 py-1 rounded-md transition ${
              selectedCategory === "popular" ? selectedButtonStyle : buttonStyle
            }`}
            style={
              selectedCategory === "popular"
                ? fallbackStyles.selectedButton
                : fallbackStyles.button
            }
          >
            Popular
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1 rounded-md transition ${
                selectedCategory === category
                  ? selectedButtonStyle
                  : buttonStyle
              }`}
              style={
                selectedCategory === category
                  ? fallbackStyles.selectedButton
                  : fallbackStyles.button
              }
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error loading images: {error}</p>
        </div>
      )}

      {/* Image Gallery Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group break-inside-avoid overflow-hidden rounded-lg cursor-pointer"
            onClick={() => handleImageClick(image)}
          >
            <img
              src={image.src.large}
              alt={image.alt}
              className="w-full h-auto object-cover rounded-md "
            />

            {/* Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
              <img
                src={`https://i.pravatar.cc/40?u=${image.photographer}`}
                alt={image.photographer}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium">{image.photographer}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Image Details */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg max-w-3xl w-full overflow-hidden`}
          >
            <div className="relative h-96">
              <img
                src={selectedImage.src.large}
                alt={selectedImage.alt}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6">
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {selectedImage.alt}
              </h2>
              <p
                className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Photo by{" "}
                <a
                  href={selectedImage.photographer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {selectedImage.photographer}
                </a>
              </p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-md ${buttonStyle}`}
                  style={fallbackStyles.button}
                >
                  Close
                </button>
                <a
                  href={selectedImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 rounded-md ${buttonStyle}`}
                  style={fallbackStyles.button}
                >
                  View on Pexels
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
