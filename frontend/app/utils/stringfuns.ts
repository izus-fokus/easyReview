/**
 * @fileoverview Utility functions for string manipulation and formatting
 * @author EasyReview
 * @license MIT
 */

/**
 * Capitalizes the first letter of a string while leaving the rest unchanged
 *
 * @param {string} name - The string to capitalize
 * @returns {string} The string with its first letter capitalized
 *
 * @example
 * ```ts
 * capitalizeFirstLetter("hello") // Returns: "Hello"
 * capitalizeFirstLetter("world") // Returns: "World"
 * ```
 */
export function capitalizeFirstLetter(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Replaces underscores with spaces and capitalizes the first letter
 *
 * @param {string} name - The string to clean and capitalize
 * @returns {string} The cleaned and capitalized string
 *
 * @example
 * ```ts
 * cleanAndCapitalize("hello_world") // Returns: "Hello world"
 * cleanAndCapitalize("user_name") // Returns: "User name"
 * ```
 */
export function cleanAndCapitalize(name: string) {
  return capitalizeFirstLetter(name.replace(/_/g, " "));
}
