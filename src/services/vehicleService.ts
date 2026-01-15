import { API_ENDPOINTS } from '../config/api';

export interface VehicleAPIResponse {
  id: string;
  vehicleName: string;
  createdOn: string;
  updatedOn: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface Vehicle {
  id: string;
  name: string;
}

const transformFromAPIResponse = (apiVehicle: VehicleAPIResponse): Vehicle => {
  return {
    id: apiVehicle.id,
    name: apiVehicle.vehicleName,
  };
};

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    const response = await fetch(API_ENDPOINTS.vehicles);

    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }

    const apiVehicles: VehicleAPIResponse[] = await response.json();
    return apiVehicles.map(transformFromAPIResponse);
  },

  async createVehicle(name: string): Promise<Vehicle> {
    const response = await fetch(API_ENDPOINTS.vehicles, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vehicleName: name }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create vehicle' }));
      throw new Error(error.message || 'Failed to create vehicle');
    }

    const apiVehicle: VehicleAPIResponse = await response.json();
    return transformFromAPIResponse(apiVehicle);
  },
};
