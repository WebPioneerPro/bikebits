import { ReactNode } from "react";
import { ButtonProps as BaseButtonProps } from "../../../interfaces/button";

interface CircularButtonProps extends Omit<BaseButtonProps, 'startIcon' | 'endIcon' | 'size' | 'variant'> {
    children: ReactNode; // Button content (usually an icon)
    size?: "sm" | "md" | "lg"; // Button size
    variant?: "primary" | "outline"; // Button variant
    type?: "button" | "submit" | "reset"; // Button type
}

const CircularButton: React.FC<CircularButtonProps> = ({
    children,
    size = "md",
    variant = "primary",
    onClick,
    className = "",
    disabled = false,
    type = "button",
}) => {
    // Size Classes - circular buttons need equal width and height
    const sizeClasses = {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-12 h-12 text-lg",
    };

    // Variant Classes
    const variantClasses = {
        primary:
            "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
        outline:
            "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    };

    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center rounded-full transition ${className} ${sizeClasses[size]
                } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""
                }`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default CircularButton;
