import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Select from "../../../components/form/Select";
import SearchBox from "../../../components/form/input/SearchBox";
import Button from "../../../components/ui/button/Button";
import { categoryService } from "../../../services/categoryService";
import { brandService } from "../../../services/brandService";

const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "In Stock", label: "In Stock" },
    { value: "Low Stock", label: "Low Stock" },
    { value: "Out of Stock", label: "Out of Stock" },
];

interface InventoryFilterProps {
    filters: {
        category: string;
        brand: string;
        status: string;
        search: string;
    };
    onFilterChange: (key: string, value: string) => void;
}

const InventoryFilter = ({ filters, onFilterChange }: InventoryFilterProps) => {
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([
        { value: "all", label: "All Categories" }
    ]);
    const [brandOptions, setBrandOptions] = useState<{ value: string; label: string }[]>([
        { value: "all", label: "All Brands" }
    ]);

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [categories, brands] = await Promise.all([
                    categoryService.getCategories(),
                    brandService.getBrands(),
                ]);

                setCategoryOptions([
                    { value: "all", label: "All Categories" },
                    ...categories.map(cat => ({ value: cat.name.toLowerCase(), label: cat.name }))
                ]);

                setBrandOptions([
                    { value: "all", label: "All Brands" },
                    ...brands.map(brand => ({ value: brand.name.toLowerCase(), label: brand.name }))
                ]);
            } catch (error) {
                console.error('Failed to fetch filter data:', error);
            }
        };

        fetchFilterData();
    }, []);

    return (
        <ComponentCard title="Filters" desc="Filter inventory items by category, brand, status, or search vehicles" action={<Button variant="outline" onClick={() => onFilterChange("reset", "")}>See All</Button>}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Category Filter */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category
                    </label>
                    <Select
                        options={categoryOptions}
                        placeholder="Select Category"
                        onChange={(value) => onFilterChange("category", value)}
                        value={filters.category}
                        className="dark:bg-gray-800"
                    />
                </div>

                {/* Brand Filter */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Brand
                    </label>
                    <Select
                        options={brandOptions}
                        placeholder="Select Brand"
                        onChange={(value) => onFilterChange("brand", value)}
                        value={filters.brand}
                        className="dark:bg-gray-800"
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                    </label>
                    <Select
                        options={statusOptions}
                        placeholder="Select Status"
                        onChange={(value) => onFilterChange("status", value)}
                        value={filters.status}
                        className="dark:bg-gray-800"
                    />
                </div>

                {/* Search Filter */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Search Vehicle
                    </label>
                    <SearchBox
                        placeholder="Search vehicles..."
                        value={filters.search}
                        onChange={(e) => onFilterChange("search", e.target.value)}
                    />
                </div>
            </div>
        </ComponentCard>
    );
};

export default InventoryFilter;
