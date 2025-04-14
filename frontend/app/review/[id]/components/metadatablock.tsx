/**
 * @fileoverview Metadatablock component for displaying dataset metadata fields in a structured format
 * @author EasyReview
 * @license MIT
 */

import { VscSymbolField } from "react-icons/vsc";
import { Metadatablock as MetadatablockType, OpenFields } from "../../../types";
import Compound from "./compound";
import Primitive from "./primitive";
import {
  capitalizeFirstLetter,
  cleanAndCapitalize,
} from "@/app/utils/stringfuns";
import CardHeader from "./cardheader";
import Dropdown from "./dropdown";
import Card from "./card";

/**
 * Metadatablock component that renders a block of metadata fields including primitives and compounds
 *
 * @component
 * @param {Object} props - Component props
 * @param {MetadatablockType} props.metadatablock - The metadata block object containing fields
 * @param {string} props.datasetId - ID of the dataset the metadata belongs to
 * @param {OpenFields} [props.openFields] - Optional object containing lists of open/editable fields
 * @returns {Promise<JSX.Element>} Rendered metadata block component
 *
 * @example
 * ```tsx
 * <Metadatablock
 *   metadatablock={metadataBlockData}
 *   datasetId="123"
 *   openFields={openFieldsData}
 * />
 * ```
 */
export default async function Metadatablock({
  metadatablock,
  datasetId,
  openFields,
}: {
  metadatablock: MetadatablockType;
  datasetId: string;
  openFields: OpenFields | undefined;
}) {
  // Sort primitives alphabetically by name
  const sortedPrimitives = metadatablock.primitives.sort((a, b) => {
    // Put title first and all others alphabetically sorted
    if (a.name === "title") {
      return -1;
    }
    return a.name.localeCompare(b.name);
  });

  // Data
  const openPrimitives = openFields?.primitives ?? [];
  const openCompounds = openFields?.compounds ?? [];

  return (
    <div className="flex flex-col px-5 translate-y-7">
      <CardHeader roundTop>
        <div className="flex flex-row">
          <div className="flex pt-1 pr-3 align-middle">
            <VscSymbolField />
          </div>
          {capitalizeFirstLetter(metadatablock.name)}
        </div>
        <Dropdown name="Suggest">
          <ul className="z-50 gap-1 text-md menu text-neutral-content">
            <li className="px-2 font-light text-neutral">Primitives</li>
            {openPrimitives?.map((field) => (
              <li className="px-2 text-sm rounded-md hover:bg-base-100">
                {cleanAndCapitalize(field)}
              </li>
            ))}
            <li className="px-2 pt-2 font-light text-neutral">Compounds</li>
            {openCompounds?.map((compound) => (
              <li className="px-2 text-sm rounded-md hover:bg-base-100">
                {cleanAndCapitalize(compound.name)}
              </li>
            ))}
          </ul>
        </Dropdown>
      </CardHeader>
      <Card id={metadatablock.name}>
        {sortedPrimitives.map((field, index) => (
          <Primitive field={field} datasetId={datasetId} />
        ))}
      </Card>
      {metadatablock.compounds.map((compound) => (
        <Compound
          compound={compound}
          datasetId={datasetId}
          openCompoundFields={openCompounds.find(
            (openCompound) => openCompound.name === compound.name
          )}
        />
      ))}
    </div>
  );
}
