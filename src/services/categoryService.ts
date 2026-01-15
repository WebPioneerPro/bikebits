import { API_ENDPOINTS } from '../config/api';

export interface CategoryAPIResponse {
  id: string;
  categoryName: string;
  createdOn: string;
  updatedOn: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface Category {
  id: string;
  name: string;
}

const transformFromAPIResponse = (apiCategory: CategoryAPIResponse): Category => {
  return {
    id: apiCategory.id,
    name: apiCategory.categoryName,
  };
};

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(API_ENDPOINTS.categories);

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const apiCategories: CategoryAPIResponse[] = await response.json();
    return apiCategories.map(transformFromAPIResponse);
  },

  async createCategory(name: string): Promise<Category> {
    const response = await fetch(API_ENDPOINTS.categories, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryName: name }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create category' }));
      throw new Error(error.message || 'Failed to create category');
    }

    const apiCategory: CategoryAPIResponse = await response.json();
    return transformFromAPIResponse(apiCategory);
  },
};
