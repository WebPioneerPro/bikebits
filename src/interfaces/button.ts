import { ReactNode } from "react";

export interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "outline" | "danger" | "success" | "warning";
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}
