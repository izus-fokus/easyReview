/**
 * @fileoverview Card component for displaying content in a styled container
 * @author EasyReview
 * @license MIT
 */

/**
 * Card component that wraps content in a styled container with a glass-like effect
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.id] - Optional ID to assign to the card container
 * @param {React.ReactNode} props.children - The content to render inside the card
 * @returns {JSX.Element} Rendered card component
 *
 * @example
 * ```tsx
 * <Card id="my-card">
 *   <div>Card content goes here</div>
 * </Card>
 * ```
 */
export default function Card({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="backdrop-blur-xl bg-gradient-to-b from-base-200 to-base-200/70 text-neutral-content rounded-lg rounded-t-none border-[1px] border-neutral border-t-0 mb-4 p-2 items-center shadow-md shadow-black"
    >
      {children}
    </div>
  );
}
