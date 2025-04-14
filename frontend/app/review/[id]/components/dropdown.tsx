/**
 * @fileoverview Dropdown component for creating dropdown menus with customizable content
 * @author EasyReview
 * @license MIT
 */

import React from "react";

/**
 * Dropdown component that creates a dropdown menu with a trigger button and content panel
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - Text to display on the dropdown trigger button
 * @param {React.ReactNode} props.children - Content to render inside the dropdown panel
 * @returns {JSX.Element} Rendered dropdown component
 *
 * @example
 * ```tsx
 * <Dropdown name="Options">
 *   <div>Dropdown content here</div>
 * </Dropdown>
 * ```
 */
export default function Dropdown({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        className="z-40 btn btn-xs btn-ghost rounded-btn no-animation"
      >
        {name}
      </div>
      <div
        tabIndex={0}
        className="z-50 dropdown-content flex flex-col max-h-96 w-60 overflow-x-auto p-1 shadow-md shadow-black/60 backdrop-blur-3xl rounded-box border-[1px] border-neutral"
      >
        {children}
      </div>
    </div>
  );
}
