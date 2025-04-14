/**
 * @fileoverview Error modal component for displaying error messages
 * @author EasyReview
 * @license MIT
 */

import cardStyle from "../../../utils/styles";

/**
 * ErrorModal component that displays an error message in a modal
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.error - The error message to display
 * @returns {JSX.Element} Rendered error modal component
 *
 * @example
 * ```tsx
 * <ErrorModal error="Failed to load data" />
 * ```
 */
export default function ErrorModal({ error }: { error: string }) {
  return (
    <div className={`modal-box p-9 ${cardStyle}`}>
      <h3 className="text-xl font-bold">Something went wrong 😵</h3>
      <p className="py-4 font-light">{error}</p>
    </div>
  );
}
