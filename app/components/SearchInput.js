// components/SearchInput.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPhotos,
  setSelectedCategory,
  selectTheme,
} from "../../features/photosSlice";

const SUGGESTIONS = [
  "Nature",
  "People",
  "Technology",
  "Travel",
  "Animals",
  "Fashion",
  "Food",
  "Architecture",
  "Business",
  "Sports",
];

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    if (!query) {
      setFilteredSuggestions([]);
    } else {
      const filtered = SUGGESTIONS.filter((term) =>
        term.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  }, [query]);

  const handleSearch = (term) => {
    setQuery(term);
    setFilteredSuggestions([]);
    dispatch(setSelectedCategory(term));
    dispatch(fetchPhotos(term));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      handleSearch(query.trim());
    }
  };

  const inputClasses = `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
    isDark
      ? "bg-gray-900 text-white border-gray-700 focus:ring-yellow-500"
      : "bg-white text-black border-gray-300 focus:ring-blue-500"
  }`;

  const dropdownClasses = `absolute z-10 w-full mt-1 border rounded-md overflow-auto max-h-40 ${
    isDark
      ? "bg-gray-800 border-gray-700 text-white"
      : "bg-white border-gray-300 text-black"
  }`;

  const suggestionClasses = `px-4 py-2 cursor-pointer ${
    isDark ? "hover:bg-yellow-600" : "hover:bg-blue-100"
  }`;

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className={inputClasses}
      />
      {filteredSuggestions.length > 0 && (
        <ul className={dropdownClasses}>
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => handleSearch(suggestion)}
              className={suggestionClasses}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
