/**
 * @fileoverview Status component that displays the acceptance state of a field
 * @author EasyReview
 * @license MIT
 */

interface StatusProps {
  accepted: boolean;
  show?: boolean;
}

/**
 * Status component that renders a badge indicating whether a field is accepted or open
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.accepted - Whether the field is accepted
 * @param {boolean} [props.show=true] - Whether to show the status badge
 * @returns {JSX.Element} Rendered status badge component
 *
 * @example
 * ```tsx
 * <Status
 *   accepted={true}
 *   show={true}
 * />
 * ```
 */
export default function Status({ accepted, show = true }: StatusProps) {
  return (
    <div
      className={`flex flex-col items-start col-span-1 transition-all duration-200 ${
        show === true ? "hover:opacity-100" : "opacity-0"
      }`}
    >
      {accepted ? (
        <div className="scale-75 badge badge-success">Accepted</div>
      ) : (
        <div className="scale-75 badge badge-warning">Open</div>
      )}
    </div>
  );
}
