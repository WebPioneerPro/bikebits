import React from "react";
import Popup from "./index";
import Button from "../button/Button";
import { PopupProps } from "../../../interfaces/popup";

interface ConfirmationPopupProps extends Omit<PopupProps, 'children'> {
    message: string;
    icon?: React.ReactNode;
    confirmLabel?: string;
    confirmVariant?: "primary" | "danger" | "outline";
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
    isOpen,
    onClose,
    title,
    message,
    icon,
    confirmLabel = "Yes",
    confirmVariant = "primary",
    cancelLabel = "No",
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    const handleCancel = onCancel || onClose;

    return (
        <Popup isOpen={isOpen} onClose={handleCancel} title={title}>
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    {icon && (
                        <div className="flex-shrink-0">
                            {icon}
                        </div>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={confirmVariant}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Popup>
    );
};

export default ConfirmationPopup;
