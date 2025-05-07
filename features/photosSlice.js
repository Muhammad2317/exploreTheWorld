"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_CONFIG } from "../config";

const API_KEY =
  process.env.NEXT_PUBLIC_PEXELS_API_KEY || API_CONFIG.pexels.apiKey;
const BASE_URL = API_CONFIG.pexels.baseUrl;
const PER_PAGE = API_CONFIG.defaults.perPage;

const availableCategories = [
  "nature",
  "night",
  "urban",
  "sunny",
  "animals",
  "travel",
  "food",
];

// Fetch photos from Pexels API
export const fetchPhotos = createAsyncThunk(
  "photos/fetchPhotos",
  async (query = "popular", { rejectWithValue }) => {
    try {
      let url;
      if (query === "popular") {
        url = `${BASE_URL}/curated?per_page=${PER_PAGE}`;
      } else {
        url = `${BASE_URL}/search?query=${query}&per_page=${PER_PAGE}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: API_KEY,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg =
          errorData.error || `Failed with status: ${response.status}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      return data.photos;
    } catch (error) {
      console.error("Error fetching photos:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  images: [],
  categories: availableCategories,
  selectedCategory: "popular",
  theme: "light",
  loading: false,
  error: null,
};

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCategory, toggleTheme } = photosSlice.actions;

// Selectors
export const selectAllImages = (state) => state.photos.images;
export const selectCategories = (state) => state.photos.categories;
export const selectSelectedCategory = (state) => state.photos.selectedCategory;
export const selectTheme = (state) => state.photos.theme;
export const selectLoading = (state) => state.photos.loading;
export const selectError = (state) => state.photos.error;

export default photosSlice.reducer;
