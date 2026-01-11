import { useState, useMemo } from "react";
import PageMeta from "../../components/common/PageMeta";
import InventoryTable from "./components/InventoryTable";
import InventoryFilter from "./components/InventoryFilter";

// Define the data structure to share it
export interface InventoryItem {
    id: number;
    name: string;
    category: string;
    brand: string;
    quantity: number;
    price: number;
    status: string;
    vehicles: string[];
}

const inventoryData: InventoryItem[] = [
    {
        id: 1,
        name: "Brake Pads",
        category: "Brakes",
        brand: "Shimano",
        quantity: 25,
        price: 45.99,
        status: "In Stock",
        vehicles: ["Mountain Bike Pro", "Road Racer X", "City Cruiser"],
    },
    {
        id: 2,
        name: "Chain",
        category: "Drivetrain",
        brand: "SRAM",
        quantity: 5,
        price: 29.99,
        status: "Low Stock",
        vehicles: ["Mountain Bike Pro"],
    },
    {
        id: 3,
        name: "Tire",
        category: "Wheels",
        brand: "Continental",
        quantity: 0,
        price: 89.99,
        status: "Out of Stock",
        vehicles: ["Road Racer X", "Gravel Explorer"],
    },
    {
        id: 4,
        name: "Handlebar",
        category: "Cockpit",
        brand: "Ritchey",
        quantity: 15,
        price: 65.99,
        status: "In Stock",
        vehicles: ["City Cruiser"],
    },
    {
        id: 5,
        name: "Saddle",
        category: "Comfort",
        brand: "Brooks",
        quantity: 12,
        price: 125.00,
        status: "In Stock",
        vehicles: ["Road Racer X", "City Cruiser", "Touring Deluxe"],
    },
    {
        id: 6,
        name: "Pedals",
        category: "Drivetrain",
        brand: "Shimano",
        quantity: 8,
        price: 79.99,
        status: "In Stock",
        vehicles: ["Mountain Bike Pro", "Gravel Explorer"],
    },
    {
        id: 7,
        name: "Helmet",
        category: "Safety",
        brand: "Giro",
        quantity: 3,
        price: 159.99,
        status: "Low Stock",
        vehicles: ["Mountain Bike Pro", "Road Racer X", "City Cruiser", "BMX Stunt"],
    },
    {
        id: 8,
        name: "Water Bottle",
        category: "Accessories",
        brand: "CamelBak",
        quantity: 30,
        price: 12.99,
        status: "In Stock",
        vehicles: ["All Bikes"],
    },
    {
        id: 9,
        name: "Derailleur",
        category: "Drivetrain",
        brand: "SRAM",
        quantity: 6,
        price: 189.99,
        status: "In Stock",
        vehicles: ["Mountain Bike Pro", "Gravel Explorer", "Road Racer X"],
    },
    {
        id: 10,
        name: "Bike Lock",
        category: "Security",
        brand: "Kryptonite",
        quantity: 0,
        price: 54.99,
        status: "Out of Stock",
        vehicles: ["City Cruiser", "Touring Deluxe"],
    },
    {
        id: 11,
        name: "Cycling Gloves",
        category: "Apparel",
        brand: "Pearl Izumi",
        quantity: 18,
        price: 34.99,
        status: "In Stock",
        vehicles: ["Road Racer X", "Mountain Bike Pro"],
    },
    {
        id: 12,
        name: "Bike Pump",
        category: "Tools",
        brand: "Topeak",
        quantity: 10,
        price: 42.99,
        status: "In Stock",
        vehicles: ["All Bikes"],
    },
    {
        id: 13,
        name: "Chain Lube",
        category: "Maintenance",
        brand: "Finish Line",
        quantity: 25,
        price: 8.99,
        status: "In Stock",
        vehicles: ["Mountain Bike Pro", "Road Racer X", "Gravel Explorer"],
    },
    {
        id: 14,
        name: "Bike Lights",
        category: "Safety",
        brand: "Cateye",
        quantity: 4,
        price: 39.99,
        status: "Low Stock",
        vehicles: ["City Cruiser"],
    },
    {
        id: 15,
        name: "Multi-Tool",
        category: "Tools",
        brand: "Park Tool",
        quantity: 14,
        price: 28.99,
        status: "In Stock",
        vehicles: ["Mountain Bike Pro", "Road Racer X"],
    },
    {
        id: 16,
        name: "Cassette",
        category: "Drivetrain",
        brand: "Shimano",
        quantity: 7,
        price: 95.99,
        status: "In Stock",
        vehicles: ["Road Racer X", "Gravel Explorer", "Touring Deluxe"],
    },
];

const getStockStatus = (quantity: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= 5) return "Low Stock";
    return "In Stock";
};

const Inventory = () => {
    const [data, setData] = useState<InventoryItem[]>(inventoryData);
    const [filters, setFilters] = useState({
        category: "all",
        brand: "all",
        status: "all",
        search: "",
    });

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const computedStatus = getStockStatus(item.quantity);
            const matchCategory = filters.category === "all" || item.category.toLowerCase() === filters.category.toLowerCase();
            const matchBrand = filters.brand === "all" || item.brand.toLowerCase() === filters.brand.toLowerCase();
            const matchStatus = filters.status === "all" || computedStatus.toLowerCase() === filters.status.toLowerCase();
            const matchSearch = filters.search === "" ||
                item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                item.vehicles.some(v => v.toLowerCase().includes(filters.search.toLowerCase()));

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

    const handleDelete = (ids: number[]) => {
        setData(prev => prev.filter(item => !ids.includes(item.id)));
    };

    const handleAddProduct = (newProduct: Omit<InventoryItem, "id" | "status">) => {
        const newItem: InventoryItem = {
            ...newProduct,
            id: Math.max(0, ...data.map(item => item.id)) + 1,
            status: "In Stock" // This status is actually computed in the table
        };
        setData(prev => [newItem, ...prev]);
    };

    const handleUpdateProduct = (updatedProduct: InventoryItem) => {
        setData(prev => prev.map(item => (item.id === updatedProduct.id ? updatedProduct : item)));
    };

    return (
        <div>
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
