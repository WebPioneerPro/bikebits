import { FC, useState, useEffect } from "react";
import { Popup } from "../../../components/ui/popup";
import InputField from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";

interface QuickAddPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (value: string) => void;
    type: 'category' | 'brand' | 'vehicle' | null;
}

const QuickAddPopup: FC<QuickAddPopupProps> = ({ isOpen, onClose, onAdd, type }) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setValue("");
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onAdd(value.trim());
            setValue("");
        }
    };

    const typeLabel = type === 'category' ? 'Category' : type === 'brand' ? 'Brand' : 'Vehicle';

    return (
        <Popup
            isOpen={isOpen}
            onClose={onClose}
            title={`Add New ${typeLabel}`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {typeLabel} Name
                    </label>
                    <InputField
                        placeholder={`Enter ${typeLabel.toLowerCase()} name`}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="w-full" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" className="w-full" disabled={!value.trim()}>
                        Add
                    </Button>
                </div>
            </form>
        </Popup>
    );
};

export default QuickAddPopup;
