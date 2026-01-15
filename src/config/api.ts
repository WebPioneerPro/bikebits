export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bikebits-api.onrender.com';

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
  categories: `${API_BASE_URL}/categories`,
  brands: `${API_BASE_URL}/brands`,
  vehicles: `${API_BASE_URL}/vehicles`,
  // Add more endpoints here as needed
};
