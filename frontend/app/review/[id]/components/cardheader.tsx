/**
 * @fileoverview CardHeader component for displaying header content in a styled container
 * @author EasyReview
 * @license MIT
 */

/**
 * CardHeader component that provides a styled header container with customizable appearance
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to render inside the header
 * @param {boolean} [props.roundTop] - Whether to round the top corners of the header
 * @param {string} [props.background="bg-base-200"] - The background color/style class to apply
 * @returns {JSX.Element} Rendered card header component
 *
 * @example
 * ```tsx
 * <CardHeader roundTop background="bg-primary">
 *   <div>Header content goes here</div>
 * </CardHeader>
 * ```
 */
export default function CardHeader({
  children,
  roundTop,
  background = "bg-base-200",
}: {
  children: React.ReactNode;
  roundTop?: boolean;
  background?: string;
}) {
  return (
    <div
      className={`flex flex-row h-auto justify-between w-full py-2 px-4 align-middle ${background} ${
        roundTop ? "rounded-t-lg" : ""
      } border-[1px] border-neutral `}
    >
      {children}
    </div>
  );
}
