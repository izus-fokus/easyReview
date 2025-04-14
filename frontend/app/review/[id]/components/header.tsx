/**
 * @fileoverview Header component that displays the application navigation bar
 * @author EasyReview
 * @license MIT
 */

"use client";

import { VscEye } from "react-icons/vsc";

interface HeaderProps {
  datasetId: string;
}

/**
 * Header component that renders the main navigation bar
 *
 * @component
 * @returns {JSX.Element} Rendered header component with logo and navigation
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export default function Header({}: HeaderProps) {
  return (
    <header className="top-0 flex flex-row h-16 px-5 border-b-[1px]  backdrop-blur-lg navbar border-neutral fixed z-10">
      <div className="flex flex-row justify-between">
        <div className="flex items-center gap-2">
          <VscEye className="scale-[1.9] rotate-90  text-primary" />
          <a className="text-xl font-semibold normal-case">EasyReview</a>
        </div>
      </div>
    </header>
  );
}
