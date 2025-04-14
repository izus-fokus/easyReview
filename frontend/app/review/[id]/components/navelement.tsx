/**
 * @fileoverview Navigation element component that provides collapsible sections with gradient titles
 * @author EasyReview
 * @license MIT
 */

import React from "react";

/**
 * NavElement component that renders a collapsible navigation section with gradient styling
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to be displayed inside the navigation element
 * @param {string} props.title - The title text to display in the gradient header
 * @param {boolean} [props.first] - Whether this is the first/default open element
 * @returns {JSX.Element} Rendered navigation element component
 *
 * @example
 * ```tsx
 * <NavElement title="Section 1" first={true}>
 *   <NavigationContent />
 * </NavElement>
 * ```
 */
export default function NavElement({
  children,
  title,
  first,
}: {
  children: React.ReactNode;
  title: string;
  first?: boolean;
}) {
  return (
    <div className="collapse">
      {first === true ? (
        <input type="radio" name="acccordion" checked={first} />
      ) : (
        <input type="radio" name="acccordion" />
      )}
      <div className="inline-block pb-4 text-3xl font-bold text-transparent collapse-title bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text">
        {title}
      </div>
      <div className="flex flex-col collapse-content gap-y-2">{children}</div>
    </div>
  );
}
