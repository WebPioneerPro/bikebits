import type React from "react";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "../icons";
import SearchBox from '../form/input/SearchBox';
import Checkbox from './input/Checkbox';
import { InboxIcon } from "../../icons";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: Option[];
  defaultSelected?: string[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  maxSelectedLabels?: number;
  showTags?: boolean;
  showSearch?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  value,
  onChange,
  disabled = false,
  placeholder = "Select options",
  error = false,
  maxSelectedLabels,
  showTags = false,
  showSearch = true,
}) => {
  const effectiveMaxSelectedLabels = maxSelectedLabels ?? (showTags ? 2 : 3);
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] =
    useState<string[]>(defaultSelected);
  const selectedOptions = isControlled ? value : internalSelected;
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const updateSelection = (newSelected: string[]) => {
    if (!isControlled) setInternalSelected(newSelected);
    onChange?.(newSelected);
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setFocusedIndex(-1);
    }
  };

  const handleSelect = (optionValue: string) => {
    const newSelected = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((v) => v !== optionValue)
      : [...selectedOptions, optionValue];
    updateSelection(newSelected);
  };

  const handleSelectAll = () => {
    const visibleValues = filteredOptions.map((opt) => opt.value);
    const areAllVisibleSelected = visibleValues.every((val) =>
      selectedOptions.includes(val)
    );

    if (areAllVisibleSelected) {
      updateSelection(
        selectedOptions.filter((v) => !visibleValues.includes(v))
      );
    } else {
      updateSelection([...new Set([...selectedOptions, ...visibleValues])]);
    }
  };

  const removeOption = (optionValue: string) => {
    updateSelection(selectedOptions.filter((v) => v !== optionValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    switch (e.key) {
      case "Enter":
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex === 0) {
          handleSelectAll();
        } else if (focusedIndex > 0) {
          handleSelect(filteredOptions[focusedIndex - 1].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => (prev < filteredOptions.length ? prev + 1 : 0));
        }
        break;
      case "ArrowUp":
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length));
        }
        break;
    }
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
          id={`${label}-label`}
        >
          {label}
        </label>
      )}

      <div className="relative z-20 inline-block w-full">
        <div className="relative flex flex-col items-center">
          <div
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            className="w-full"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-labelledby={label ? `${label}-label` : undefined}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
          >
            <div
              className={`mb-2 flex min-h-11 rounded-lg border py-1.5 pl-3 pr-3 shadow-theme-xs outline-hidden transition focus:ring-3 ${error
                ? "border-error-500 focus:border-error-300 focus:ring-error-500/10 dark:border-error-500"
                : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700"
                } dark:bg-gray-900 ${disabled
                  ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
                  : "cursor-pointer"
                }`}
            >
              <div className="flex flex-wrap flex-auto gap-2">
                {selectedOptions.length > 0 ? (
                  selectedOptions.length <= effectiveMaxSelectedLabels ? (
                    showTags ? (
                      selectedOptions.map((value) => {
                        const labelText =
                          options.find((opt) => opt.value === value)?.label || value;
                        return (
                          <div
                            key={value}
                            className="group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800"
                          >
                            <span className="flex-initial max-w-full">{labelText}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!disabled) removeOption(value);
                              }}
                              disabled={disabled}
                              className="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400 disabled:cursor-not-allowed"
                              aria-label={`Remove ${labelText}`}
                            >
                              <svg
                                className="fill-current"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full p-1 text-sm text-gray-800 dark:text-white/90 truncate">
                        {selectedOptions
                          .map((value) => options.find((opt) => opt.value === value)?.label || value)
                          .join(", ")}
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-brand-50 py-1 px-3 text-sm text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      {selectedOptions.length} items selected
                    </div>
                  )
                ) : (
                  <div className="w-full h-full p-1 pr-2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none">
                    {placeholder}
                  </div>
                )}
              </div>
              <div className="flex items-center self-start py-1 pl-1 pr-1 w-7">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown();
                  }}
                  disabled={disabled}
                  className="w-5 h-5 text-gray-700 outline-hidden cursor-pointer focus:outline-hidden dark:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ChevronDown
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    size={20}
                  />
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <div
              className="absolute left-0 z-40 w-full bg-white rounded-lg shadow-sm top-full dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header Row */}
              <div className={`flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-800 shrink-0 ${focusedIndex === 0 ? "bg-gray-100 dark:bg-gray-800" : ""}`}>
                <Checkbox
                  checked={filteredOptions.length > 0 && filteredOptions.every((opt) => selectedOptions.includes(opt.value))}
                  onChange={handleSelectAll}
                  className="min-w-[20px]"
                />

                {showSearch && (
                  <div
                    className="flex-grow"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SearchBox
                      placeholder="Search options..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setFocusedIndex(0); // Reset focus
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Scrollable Options List */}
              <div
                className="overflow-y-auto max-h-40 custom-scrollbar"
                role="listbox"
                aria-label={label}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const isSelected = selectedOptions.includes(option.value);
                    const isFocused = index + 1 === focusedIndex;

                    return (
                      <div
                        key={option.value}
                        className={`hover:bg-gray-100 dark:hover:bg-gray-800 w-full cursor-pointer border-b border-gray-200 last:border-b-0 dark:border-gray-800 ${isFocused ? "bg-gray-100 dark:bg-gray-800" : ""
                          } ${isSelected ? "bg-brand-50/50 dark:bg-brand-500/5" : ""}`}
                        onClick={() => handleSelect(option.value)}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="relative flex w-full items-center p-2.5 pl-3">
                          <div className="pointer-events-none flex items-center">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => { }}
                              label={option.label}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : options.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                    <img 
                      src="/images/favicon.ico" 
                      alt="Empty" 
                      className="w-12 h-12 mb-3 opacity-30 dark:opacity-20"
                    />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      No options available
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Add items using the + button
                    </p>
                  </div>
                ) : (
                  <div className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">
                    No options found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
