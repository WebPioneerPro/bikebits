import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';
import { vehicleService } from '../services/vehicleService';
import { productService } from '../services/productService';
import { useToast } from './ToastContext';

interface Category {
    id: string;
    name: string;
}

interface Brand {
    id: string;
    name: string;
}

interface Vehicle {
    id: string;
    name: string;
}

interface Product {
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

interface DataContextType {
    categories: Category[];
    brands: Brand[];
    vehicles: Vehicle[];
    products: Product[];
    isLoading: boolean;
    refreshCategories: () => Promise<void>;
    refreshBrands: () => Promise<void>;
    refreshVehicles: () => Promise<void>;
    refreshProducts: () => Promise<void>;
    refreshAll: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { addToast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            addToast('error', 'Failed to load categories.');
        }
    };

    const refreshBrands = async () => {
        try {
            const data = await brandService.getBrands();
            setBrands(data);
        } catch (error) {
            console.error('Failed to fetch brands:', error);
            addToast('error', 'Failed to load brands.');
        }
    };

    const refreshVehicles = async () => {
        try {
            const data = await vehicleService.getVehicles();
            setVehicles(data);
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
            addToast('error', 'Failed to load vehicles.');
        }
    };

    const refreshProducts = async () => {
        try {
            const data = await productService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            addToast('error', 'Failed to load products.');
        }
    };

    const refreshAll = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                refreshCategories(),
                refreshBrands(),
                refreshVehicles(),
                refreshProducts(),
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Load all data on mount
    useEffect(() => {
        refreshAll();
    }, []);

    return (
        <DataContext.Provider
            value={{
                categories,
                brands,
                vehicles,
                products,
                isLoading,
                refreshCategories,
                refreshBrands,
                refreshVehicles,
                refreshProducts,
                refreshAll,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
