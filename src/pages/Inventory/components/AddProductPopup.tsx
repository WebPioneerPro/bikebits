import { FC, useState, useEffect } from "react";
import { Popup } from "../../../components/ui/popup";
import InputField from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import MultiSelect from "../../../components/form/MultiSelect";
import Button from "../../../components/ui/button/Button";
import CircularButton from "../../../components/ui/button/CircularButton";
import { PlusIcon } from "../../../icons";
import { InventoryItem } from "../Inventory";
import { PopupProps } from "../../../interfaces/popup";
import QuickAddPopup from "./QuickAddPopup";

interface AddProductPopupProps extends Omit<PopupProps, 'children' | 'title'> {
    onAdd: (product: Omit<InventoryItem, "id" | "status">) => void;
    onUpdate: (product: InventoryItem) => void;
    initialData?: InventoryItem;
}

const AddProductPopup: FC<AddProductPopupProps> = ({ isOpen, onClose, onAdd, onUpdate, initialData }) => {
    // Options in state to allow dynamic updates
    const [categories, setCategories] = useState([
        { value: "Brakes", label: "Brakes" },
        { value: "Drivetrain", label: "Drivetrain" },
        { value: "Wheels", label: "Wheels" },
        { value: "Cockpit", label: "Cockpit" },
        { value: "Safety", label: "Safety" },
        { value: "Tools", label: "Tools" },
        { value: "Comfort", label: "Comfort" },
        { value: "Accessories", label: "Accessories" },
        { value: "Maintenance", label: "Maintenance" },
    ]);

    const [brands, setBrands] = useState([
        { value: "Shimano", label: "Shimano" },
        { value: "SRAM", label: "SRAM" },
        { value: "Continental", label: "Continental" },
        { value: "Brooks", label: "Brooks" },
        { value: "Ritchey", label: "Ritchey" },
        { value: "Giro", label: "Giro" },
        { value: "CamelBak", label: "CamelBak" },
        { value: "Kryptonite", label: "Kryptonite" },
        { value: "Pearl Izumi", label: "Pearl Izumi" },
        { value: "Topeak", label: "Topeak" },
        { value: "Finish Line", label: "Finish Line" },
        { value: "Cateye", label: "Cateye" },
        { value: "Park Tool", label: "Park Tool" },
    ]);

    const [vehicles, setVehicles] = useState([
        { value: "Mountain Bike Pro", label: "Mountain Bike Pro" },
        { value: "Road Racer X", label: "Road Racer X" },
        { value: "City Cruiser", label: "City Cruiser" },
        { value: "Gravel Explorer", label: "Gravel Explorer" },
        { value: "Touring Deluxe", label: "Touring Deluxe" },
        { value: "BMX Stunt", label: "BMX Stunt" },
    ]);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        brand: "",
        quantity: "" as string | number,
        price: "" as string | number,
        vehicles: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Quick Add States
    const [quickAddType, setQuickAddType] = useState<'category' | 'brand' | 'vehicle' | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                category: initialData.category,
                brand: initialData.brand,
                quantity: initialData.quantity,
                price: initialData.price,
                vehicles: [...initialData.vehicles],
            });
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.brand) newErrors.brand = "Brand is required";
        if (formData.quantity === "" || Number(formData.quantity) < 0) newErrors.quantity = "Quantity cannot be negative";
        if (formData.price === "" || Number(formData.price) <= 0) newErrors.price = "Price must be greater than 0";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            brand: "",
            quantity: "",
            price: "",
            vehicles: [],
        });
        setErrors({});
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (initialData) {
                onUpdate({
                    ...initialData,
                    ...formData,
                    quantity: Number(formData.quantity),
                    price: Number(formData.price),
                });
            } else {
                onAdd({
                    ...formData,
                    quantity: Number(formData.quantity),
                    price: Number(formData.price),
                });
            }
            resetForm();
            onClose();
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleQuickAdd = (newValue: string) => {
        const newOption = { value: newValue, label: newValue };

        if (quickAddType === 'category') {
            setCategories(prev => [...prev, newOption]);
            handleChange('category', newValue);
        } else if (quickAddType === 'brand') {
            setBrands(prev => [...prev, newOption]);
            handleChange('brand', newValue);
        } else if (quickAddType === 'vehicle') {
            setVehicles(prev => [...prev, newOption]);
            handleChange('vehicles', [...formData.vehicles, newValue]);
        }

        setQuickAddType(null);
    };

    return (
        <>
            <Popup isOpen={isOpen} onClose={handleCancel} title={initialData ? "Edit Product" : "Add New Product"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Product Name/ID
                        </label>
                        <InputField
                            placeholder="e.g. Carbon Seatpost"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            error={!!errors.name}
                            hint={errors.name}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <CircularButton
                                    size="sm"
                                    className="!w-8 !h-8"
                                    onClick={() => setQuickAddType('category')}
                                >
                                    <PlusIcon className="w-4 h-4" />
                                </CircularButton>
                            </div>
                            <Select
                                options={categories}
                                placeholder="Select Category"
                                value={formData.category}
                                onChange={(value) => handleChange("category", value)}
                                error={!!errors.category}
                                className={errors.category ? "border-error-500" : ""}
                            />
                            {errors.category && (
                                <p className="mt-1.5 text-xs text-error-500">{errors.category}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Brand/Supplier
                                </label>
                                <CircularButton
                                    size="sm"
                                    className="!w-8 !h-8"
                                    onClick={() => setQuickAddType('brand')}
                                >
                                    <PlusIcon className="w-4 h-4" />
                                </CircularButton>
                            </div>
                            <Select
                                options={brands}
                                placeholder="Select Brand"
                                value={formData.brand}
                                onChange={(value) => handleChange("brand", value)}
                                error={!!errors.brand}
                                className={errors.brand ? "border-error-500" : ""}
                            />
                            {errors.brand && (
                                <p className="mt-1.5 text-xs text-error-500">{errors.brand}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Quantity
                            </label>
                            <InputField
                                type="number"
                                placeholder="0"
                                min="0"
                                value={formData.quantity}
                                onChange={(e) => handleChange("quantity", e.target.value)}
                                error={!!errors.quantity}
                                hint={errors.quantity}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Price (₹)
                            </label>
                            <InputField
                                type="number"
                                step={0.01}
                                min="0"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => handleChange("price", e.target.value)}
                                error={!!errors.price}
                                hint={errors.price}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Assigned Vehicles
                            </label>
                            <CircularButton
                                size="sm"
                                className="!w-8 !h-8"
                                onClick={() => setQuickAddType('vehicle')}
                            >
                                <PlusIcon className="w-4 h-4" />
                            </CircularButton>
                        </div>
                        <MultiSelect
                            options={vehicles}
                            placeholder="Select Vehicles"
                            value={formData.vehicles}
                            onChange={(values) => handleChange("vehicles", values)}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="w-full" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" className="w-full">
                            {initialData ? "Update Product" : "Add Product"}
                        </Button>
                    </div>
                </form>
            </Popup>

            <QuickAddPopup
                isOpen={!!quickAddType}
                onClose={() => setQuickAddType(null)}
                onAdd={handleQuickAdd}
                type={quickAddType}
            />
        </>
    );
};

export default AddProductPopup;
