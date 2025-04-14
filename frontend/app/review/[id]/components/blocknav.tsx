/**
 * @fileoverview BlockNav component for displaying navigable metadata blocks in the sidebar
 * @author EasyReview
 * @license MIT
 */

import { Compound, Field, Metadatablock } from "@/app/types";
import {
  capitalizeFirstLetter,
  cleanAndCapitalize,
} from "@/app/utils/stringfuns";
import Link from "next/link";
import { VscSymbolField } from "react-icons/vsc";

/**
 * Creates a navigation field element for either a Field or Compound
 *
 * @param field - The Field or Compound object to create a nav element for
 * @param datasetId - The ID of the dataset this field belongs to
 * @returns A list item element containing a link to the field
 */
const createNavField = (field: Field | Compound, datasetId: string) => {
  let accepted = field.accepted;

  if ("primitives" in field) {
    accepted = field.primitives.every((primitive: Field) => primitive.accepted);
  }

  return (
    <li
      className={`flex place-items-start my-1 ${
        accepted === true ? "text-neutral" : "text-base-content"
      }`}
    >
      <Link
        className="flex flex-row w-auto gap-5 px-2 rounded-md hover:bg-base-100 place-items-center"
        href={`${datasetId}#${field.id}`}
      >
        {cleanAndCapitalize(field.name)}
      </Link>
    </li>
  );
};

/**
 * Extracts fields and compounds from a metadatablock and returns them as a list.
 *
 * @param metadatablock - The metadatablock object to extract fields and compounds from
 * @param datasetId - The ID of the dataset these fields belong to
 * @returns A list element containing all fields and compounds from the metadatablock
 */
const extractFieldsToList = (
  metadatablock: Metadatablock,
  datasetId: string
) => {
  // Sort and map primitive fields
  const fields = metadatablock.primitives
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((field) => createNavField(field, datasetId));

  // Map compound fields
  const compounds = metadatablock.compounds.map((field) =>
    createNavField(field, datasetId)
  );

  return (
    <ul className="pl-5 text-sm border-l border-neutral">
      {fields.concat(compounds)}
    </ul>
  );
};

/**
 * BlockNav component that displays a metadata block in the sidebar navigation
 *
 * @component
 * @param props - Component props
 * @param props.metadatablock - The metadata block object to display
 * @param props.toOpen - Whether this block should be expanded to show its fields
 * @param props.datasetId - The ID of the dataset this block belongs to
 * @returns The rendered BlockNav component
 *
 * @example
 * ```tsx
 * <BlockNav
 *   metadatablock={metadatablock}
 *   toOpen={true}
 *   datasetId="123"
 * />
 * ```
 */
export default function BlockNav({
  metadatablock,
  toOpen,
  datasetId,
}: {
  metadatablock: Metadatablock;
  toOpen: boolean;
  datasetId: string;
}) {
  let highlightColor = "text-base-content/70 text-lg";
  let fields = null;

  if (toOpen === true) {
    highlightColor = "text-base-content text-xl";
    fields = extractFieldsToList(metadatablock, datasetId);
  }

  return (
    <div className="flex flex-col">
      <div
        className={
          "flex flex-row align-middle cursor-pointer " + highlightColor
        }
      >
        <div className="flex pt-1 pr-3 align-middle">
          <VscSymbolField />
        </div>
        {capitalizeFirstLetter(metadatablock.name)}
      </div>
      <div className="translate-x-2">{fields}</div>
    </div>
  );
}
