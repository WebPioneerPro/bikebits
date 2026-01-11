import React from 'react';
import Input from './InputField';
import SearchIcon from '../../icons/SearchIcon';

interface SearchBoxProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
}) => {
    return (
        <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
                <SearchIcon size={18} />
            </span>
            <Input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`pl-10 ${className}`}
            />
        </div>
    );
};

export default SearchBox;
