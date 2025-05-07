export const API_CONFIG = {
  pexels: {
    apiKey: process.env.NEXT_PUBLIC_PEXELS_API_KEY,
    baseUrl: "https://api.pexels.com/v1",
  },

  defaults: {
    perPage: 12,
    initialCategory: "popular",
  },
};

export default API_CONFIG;
