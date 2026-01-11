import { ReactNode } from "react";

export interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
    showCloseButton?: boolean;
}
