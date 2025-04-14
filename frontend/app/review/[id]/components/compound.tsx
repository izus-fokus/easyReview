/**
 * @fileoverview Compound component for displaying compound metadata fields
 * @author EasyReview
 * @license MIT
 */

"use client";

import { VscArchive } from "react-icons/vsc";
import {
  Compound as CompoundType,
  Field as FieldType,
  OpenCompoundField,
} from "../../../types";
import { cleanAndCapitalize } from "../../../utils/stringfuns";
import Card from "./card";
import CardHeader from "./cardheader";
import Primitive from "./primitive";
import Dropdown from "./dropdown";

/**
 * Compound component that displays a compound metadata field and its primitive fields
 *
 * @component
 * @param {Object} props - Component props
 * @param {CompoundType} props.compound - The compound metadata field to display
 * @param {string} props.datasetId - ID of the dataset this compound belongs to
 * @param {OpenCompoundField} [props.openCompoundFields] - Optional suggested fields for the compound
 * @returns {JSX.Element} Rendered compound component
 *
 * @example
 * ```tsx
 * <Compound
 *   compound={compoundField}
 *   datasetId="123"
 *   openCompoundFields={suggestedFields}
 * />
 * ```
 */
export default function Compound({
  compound,
  datasetId,
  openCompoundFields,
}: {
  compound: CompoundType;
  datasetId: string;
  openCompoundFields: OpenCompoundField | undefined;
}) {
  // Check if compound has multiple primitive fields
  const hasMoreThanOnePrimitive = compound.primitives.length > 1;

  // Sort primitive fields alphabetically by name
  const sortedPrimitives = compound.primitives.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="flex flex-col mt-5 flex-start">
      <CardHeader roundTop>
        <div className="flex flex-row">
          <div className="flex pt-1 pr-3 align-middle">
            <VscArchive />
          </div>
          <p className="text-base-content">
            {cleanAndCapitalize(compound.name)}
          </p>
        </div>
        <Dropdown name="Suggest">
          <ul className="gap-1 text-sm menu text-neutral-content">
            {openCompoundFields?.childFields.map((field) => (
              <li className="px-2 text-sm rounded-md hover:bg-base-100">
                {cleanAndCapitalize(field)}
              </li>
            ))}
          </ul>
        </Dropdown>
      </CardHeader>
      <Card>
        <div
          className={`grid ${
            hasMoreThanOnePrimitive ? "grid-cols-1" : ""
          } col-span-9 px-1`}
        >
          {sortedPrimitives.map((field) => (
            <Primitive field={field} datasetId={datasetId} isCompound={true} />
          ))}
        </div>
      </Card>
    </div>
  );
}
