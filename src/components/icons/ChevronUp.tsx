import { FC } from "react";
import { IconProps } from "../../interfaces/icon";

const ChevronUp: FC<IconProps> = ({ size = 20, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M15.2083 12.6045L10 7.39616L4.79169 12.6045"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ChevronUp;
