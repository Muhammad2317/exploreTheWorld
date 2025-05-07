"use client";

import { configureStore } from "@reduxjs/toolkit";
import photosReducer from "./features/photosSlice";

// Create the store
const store = configureStore({
  reducer: {
    photos: photosReducer,
  },
});

export default store;
