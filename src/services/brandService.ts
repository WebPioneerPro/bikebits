import { API_ENDPOINTS } from '../config/api';

export interface BrandAPIResponse {
  id: string;
  brandName: string;
  createdOn: string;
  updatedOn: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface Brand {
  id: string;
  name: string;
}

const transformFromAPIResponse = (apiBrand: BrandAPIResponse): Brand => {
  return {
    id: apiBrand.id,
    name: apiBrand.brandName,
  };
};

export const brandService = {
  async getBrands(): Promise<Brand[]> {
    const response = await fetch(API_ENDPOINTS.brands);

    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }

    const apiBrands: BrandAPIResponse[] = await response.json();
    return apiBrands.map(transformFromAPIResponse);
  },

  async createBrand(name: string): Promise<Brand> {
    const response = await fetch(API_ENDPOINTS.brands, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brandName: name }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create brand' }));
      throw new Error(error.message || 'Failed to create brand');
    }

    const apiBrand: BrandAPIResponse = await response.json();
    return transformFromAPIResponse(apiBrand);
  },
};
