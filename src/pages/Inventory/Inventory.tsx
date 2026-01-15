import { useState, useMemo, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import InventoryTable from "./components/InventoryTable";
import InventoryFilter from "./components/InventoryFilter";
import { productService } from "../../services/productService";
import SpinnerOverlay from "../../components/common/SpinnerOverlay";
import { useToast } from "../../context/ToastContext";

// Define the data structure to share it
export interface InventoryItem {
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

const Inventory = () => {
    const { addToast } = useToast();
    const [data, setData] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: "all",
        brand: "all",
        status: "all",
        search: "",
    });

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const products = await productService.getProducts();
                setData(products);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                addToast('error', 'Failed to load products. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchCategory = filters.category === "all" || item.categoryName.toLowerCase() === filters.category.toLowerCase();
            const matchBrand = filters.brand === "all" || item.brandName.toLowerCase() === filters.brand.toLowerCase();
            const matchStatus = filters.status === "all" || item.status.toLowerCase() === filters.status.toLowerCase();
            const matchSearch = filters.search === "" ||
                item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                item.vehicleNames.some(v => v.toLowerCase().includes(filters.search.toLowerCase()));

            return matchCategory && matchBrand && matchStatus && matchSearch;
        });
    }, [filters, data]);

    const handleFilterChange = (key: string, value: string) => {
        if (key === "reset") {
            setFilters({
                category: "all",
                brand: "all",
                status: "all",
                search: "",
            });
        } else {
            setFilters((prev) => ({ ...prev, [key]: value }));
        }
    };

    const handleDelete = async (ids: string[]) => {
        try {
            await Promise.all(ids.map(id => productService.deleteProduct(id)));
            setData(prev => prev.filter(item => !ids.includes(item.id)));
        } catch (error) {
            console.error('Failed to delete products:', error);
            addToast('error', 'Failed to delete products. Please try again.');
        }
    };

    const handleAddProduct = async (newProduct: Omit<InventoryItem, "id" | "status" | "categoryName" | "brandName" | "vehicleNames">) => {
        try {
            const createdProduct = await productService.createProduct(newProduct);
            setData(prev => [createdProduct, ...prev]);
        } catch (error) {
            console.error('Failed to create product:', error);
            addToast('error', error instanceof Error ? error.message : 'Failed to create product. Please try again.');
        }
    };

    const handleUpdateProduct = async (updatedProduct: InventoryItem) => {
        try {
            const updated = await productService.updateProduct(updatedProduct.id, {
                name: updatedProduct.name,
                category: updatedProduct.category,
                brand: updatedProduct.brand,
                quantity: updatedProduct.quantity,
                price: updatedProduct.price,
                vehicles: updatedProduct.vehicles,
                hsnCode: updatedProduct.hsnCode,
                shelfPosition: updatedProduct.shelfPosition,
            });
            setData(prev => prev.map(item => (item.id === updated.id ? updated : item)));
        } catch (error) {
            console.error('Failed to update product:', error);
            addToast('error', 'Failed to update product. Please try again.');
        }
    };

    return (
        <div className="relative">
            <SpinnerOverlay isVisible={isLoading} message="Loading products..." fullScreen />
            <PageMeta
                title="Inventory Management | BikeBits"
                description="Manage your inventory items and assigned vehicles."
            />
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Inventory
                </h2>
            </div>

            <div className="space-y-6">
                <InventoryFilter filters={filters} onFilterChange={handleFilterChange} />
                <InventoryTable
                    data={filteredData}
                    onDelete={handleDelete}
                    onAdd={handleAddProduct}
                    onUpdate={handleUpdateProduct}
                />
            </div>
        </div>
    );
};

export default Inventory;
