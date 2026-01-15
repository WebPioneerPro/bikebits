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
import SpinnerOverlay from "../../../components/common/SpinnerOverlay";
import { useToast } from "../../../context/ToastContext";
import { categoryService } from "../../../services/categoryService";
import { brandService } from "../../../services/brandService";
import { vehicleService } from "../../../services/vehicleService";

interface AddProductPopupProps extends Omit<PopupProps, 'children' | 'title'> {
    onAdd: (product: Omit<InventoryItem, "id" | "status" | "categoryName" | "brandName" | "vehicleNames">) => void;
    onUpdate: (product: InventoryItem) => void;
    initialData?: InventoryItem;
}

interface FormData {
    name: string;
    category: string;
    brand: string;
    quantity: string;
    price: string;
    vehicles: string[];
    hsnCode?: string;
    shelfPosition?: string;
}

const AddProductPopup: FC<AddProductPopupProps> = ({
    isOpen,
    onClose,
    onAdd,
    onUpdate,
    initialData,
}) => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        name: initialData?.name || "",
        category: initialData?.category || "",
        brand: initialData?.brand || "",
        quantity: initialData?.quantity?.toString() || "",
        price: initialData?.price?.toString() || "",
        vehicles: initialData?.vehicles || [],
        hsnCode: (initialData as any)?.hsnCode || "",
        shelfPosition: (initialData as any)?.shelfPosition || "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quickAddType, setQuickAddType] = useState<'category' | 'brand' | 'vehicle' | null>(null);

    // Dynamic Options
    const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
    const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);
    const [vehicles, setVehicles] = useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [catData, brandData, vehicleData] = await Promise.all([
                categoryService.getCategories(),
                brandService.getBrands(),
                vehicleService.getVehicles(),
            ]);

            setCategories(catData.map((c) => ({ value: c.id, label: c.name })));
            setBrands(brandData.map((b) => ({ value: b.id, label: b.name })));
            setVehicles(vehicleData.map((v) => ({ value: v.id, label: v.name })));
        } catch (error) {
            console.error("Failed to load options:", error);
            addToast('error', 'Failed to load form options. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!formData.name) newErrors.name = "Product name is required";
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
            hsnCode: "",
            shelfPosition: "",
        });
        setErrors({});
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                const productData = {
                    name: formData.name,
                    category: formData.category,
                    brand: formData.brand,
                    quantity: parseInt(formData.quantity),
                    price: parseFloat(formData.price),
                    vehicles: formData.vehicles,
                    status: (parseInt(formData.quantity) > 0 ? "active" : "out-of-stock") as "active" | "out-of-stock",
                    ...(formData.hsnCode && { hsnCode: formData.hsnCode }),
                    ...(formData.shelfPosition && { shelfPosition: formData.shelfPosition }),
                };

                if (initialData) {
                    await onUpdate({
                        ...initialData,
                        ...productData,
                    } as InventoryItem);
                    addToast('success', 'Product updated successfully!');
                } else {
                    await onAdd(productData as unknown as InventoryItem);
                    addToast('success', 'Product added successfully!');
                }
                onClose();
            } catch (error) {
                console.error("Failed to save product:", error);
                addToast('error', `Failed to ${initialData ? 'update' : 'add'} product. Please try again.`);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChange = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleQuickAdd = async (newValue: string) => {
        try {
            if (quickAddType === 'category') {
                const newCategory = await categoryService.createCategory(newValue);
                const newOption = { value: newCategory.id, label: newCategory.name };
                setCategories(prev => [...prev, newOption]);
                handleChange('category', newCategory.id);
            } else if (quickAddType === 'brand') {
                const newBrand = await brandService.createBrand(newValue);
                const newOption = { value: newBrand.id, label: newBrand.name };
                setBrands(prev => [...prev, newOption]);
                handleChange('brand', newBrand.id);
            } else if (quickAddType === 'vehicle') {
                const newVehicle = await vehicleService.createVehicle(newValue);
                const newOption = { value: newVehicle.id, label: newVehicle.name };
                setVehicles(prev => [...prev, newOption]);
                handleChange('vehicles', [...formData.vehicles, newVehicle.id]);
            }
        } catch (error) {
            console.error('Failed to create new item:', error);
            addToast('error', error instanceof Error ? error.message : 'Failed to create item. Please try again.');
        } finally {
            setQuickAddType(null);
        }
    };

    return (
        <>
            <Popup isOpen={isOpen} onClose={handleCancel} title={initialData ? "Edit Product" : "Add New Product"}>
                <div className="relative">
                    <SpinnerOverlay isVisible={isLoading} message="Loading form data..." />
                    <SpinnerOverlay isVisible={isSubmitting} message={initialData ? "Updating product..." : "Creating product..."} />
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Product Name/ID <span className="text-red-500">*</span>
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
                                        Category <span className="text-red-500">*</span>
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
                                        Brand/Supplier <span className="text-red-500">*</span>
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
                                    Quantity <span className="text-red-500">*</span>
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
                                    Price (₹) <span className="text-red-500">*</span>
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    HSN Code
                                </label>
                                <InputField
                                    placeholder="e.g. 87149990"
                                    value={formData.hsnCode}
                                    onChange={(e) => handleChange("hsnCode", e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Shelf Position
                                </label>
                                <InputField
                                    placeholder="e.g. A-12-3"
                                    value={formData.shelfPosition}
                                    onChange={(e) => handleChange("shelfPosition", e.target.value)}
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
                </div>
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
