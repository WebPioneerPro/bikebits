/**
 * Capitalizes the first letter of a string.
 */
export const capitalize = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts a string to Title Case.
 */
export const toTitleCase = (str: string): string => {
    if (!str) return "";
    return str.split(" ").map(capitalize).join(" ");
};

/**
 * Converts a string to UPPERCASE.
 */
export const toUpperCase = (str: string): string => {
    return str ? str.toUpperCase() : "";
};

/**
 * Converts a string to lowercase.
 */
export const toLowerCase = (str: string): string => {
    return str ? str.toLowerCase() : "";
};
