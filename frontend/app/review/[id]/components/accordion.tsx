/**
 * @fileoverview Accordion component for displaying collapsible content sections
 * @author EasyReview
 * @license MIT
 */

"use client";

import { capitalizeFirstLetter } from "../../../utils/stringfuns";
import { VscSymbolField } from "react-icons/vsc";
import cardStyle from "../../../utils/styles";

/**
 * Accordion component that displays a header with an icon and collapsible content
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - The name/title to display in the accordion header
 * @param {React.ReactNode} props.children - The content to render inside the accordion body
 * @returns {JSX.Element} Rendered accordion component
 *
 * @example
 * ```tsx
 * <Accordion name="Citation">
 *   <div>Accordion content goes here</div>
 * </Accordion>
 * ```
 */
export default function Accordion({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row m-4 text-2xl align-middle">
        <div className="flex pt-1 pr-3 align-middle">
          <VscSymbolField />
        </div>
        {capitalizeFirstLetter(name)}
      </div>
      <div className={cardStyle + " border-[0.97px] border-neutral px-4 mb-4"}>
        {children}
      </div>
    </div>
  );
}
