import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "../icons";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  error?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string>(defaultValue);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentVal = value !== undefined ? value : internalSelected;
  const selectedOption = options.find((opt) => opt.value === currentVal);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    if (value === undefined) {
      setInternalSelected(option.value);
    }
    onChange(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (focusedIndex >= 0) {
        handleSelect(options[focusedIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isOpen) {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div
        className={`flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs outline-hidden transition focus:ring-3 ${error
          ? "border-error-500 focus:border-error-300 focus:ring-error-500/10 dark:border-error-500"
          : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700"
          } dark:bg-gray-900 ${currentVal
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-400 dark:text-gray-400"
          }`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            } text-gray-500 dark:text-gray-400`}
          size={20}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div role="listbox">
            {options.map((option, index) => {
              const isSelected = option.value === currentVal;
              const isFocused = index === focusedIndex;

              return (
                <div
                  key={option.value}
                  className={`flex cursor-pointer items-center px-4 py-2 text-sm transition-colors ${isSelected
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : isFocused
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={isSelected}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
