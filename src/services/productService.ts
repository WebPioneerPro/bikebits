import { API_ENDPOINTS } from '../config/api';
import { apiClient } from './apiClient';

export interface CreateProductDTO {
  name: string;
  category: string;
  brand: string;
  quantity: number;
  price: number;
  vehicles: string[];
  hsnCode?: string;
  shelfPosition?: string;
}

export interface CreateProductAPIPayload {
  productName: string;
  categoryId: string;
  brandId: string;
  quantity: number;
  price: number;
  compatibleVehicles: string[];
  hsnCode?: string;
  shelfPosition?: string;
}

export interface ProductAPIResponse {
  id: string;
  productName: string;
  hsnCode: string;
  shelfPosition: string;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  quantity: number;
  price: number;
  compatibleVehicles: string[];
  compatibleVehicleNames: string[];
  createdOn: string;
  updatedOn: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  brand: string;
  brandName: string;
  quantity: number;
  price: number;
  status: string;
  vehicles: string[];
  vehicleNames: string[];
  hsnCode?: string;
  shelfPosition?: string;
}

// Helper function to transform form data to API payload
const transformToAPIPayload = (productData: CreateProductDTO): CreateProductAPIPayload => {
  return {
    productName: productData.name,
    categoryId: productData.category, // Will be UUID from select
    brandId: productData.brand, // Will be UUID from select
    quantity: productData.quantity,
    price: productData.price,
    compatibleVehicles: productData.vehicles, // Will be array of UUIDs
    ...(productData.hsnCode && { hsnCode: productData.hsnCode }),
    ...(productData.shelfPosition && { shelfPosition: productData.shelfPosition }),
  };
};

// Helper function to transform API response to internal Product format
const transformFromAPIResponse = (apiProduct: ProductAPIResponse): Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.productName,
    category: apiProduct.categoryId,
    categoryName: apiProduct.categoryName,
    brand: apiProduct.brandId,
    brandName: apiProduct.brandName,
    quantity: apiProduct.quantity,
    price: apiProduct.price,
    status: apiProduct.quantity === 0 ? "Out of Stock" : apiProduct.quantity <= 5 ? "Low Stock" : "In Stock",
    vehicles: apiProduct.compatibleVehicles,
    vehicleNames: apiProduct.compatibleVehicleNames,
    hsnCode: apiProduct.hsnCode,
    shelfPosition: apiProduct.shelfPosition,
  };
};

export const productService = {
  async createProduct(productData: CreateProductDTO): Promise<Product> {
    const apiPayload = transformToAPIPayload(productData);

    const response = await apiClient.fetch(API_ENDPOINTS.products, {
      method: 'POST',
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create product' }));
      throw new Error(error.message || 'Failed to create product');
    }

    const apiResponse: ProductAPIResponse = await response.json();
    return transformFromAPIResponse(apiResponse);
  },

  async getProducts(): Promise<Product[]> {
    const response = await apiClient.fetch(API_ENDPOINTS.products);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const apiProducts: ProductAPIResponse[] = await response.json();
    return apiProducts.map(transformFromAPIResponse);
  },

  async updateProduct(id: string, productData: Partial<CreateProductDTO>): Promise<Product> {
    const apiPayload = productData.name ? transformToAPIPayload(productData as CreateProductDTO) : productData;

    const response = await apiClient.fetch(`${API_ENDPOINTS.products}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update product' }));
      throw new Error(error.message || 'Failed to update product');
    }

    const apiResponse: ProductAPIResponse = await response.json();
    return transformFromAPIResponse(apiResponse);
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await apiClient.fetch(`${API_ENDPOINTS.products}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  },
};

