/**
 * @fileoverview Details component for displaying field history and metadata
 * @author EasyReview
 * @license MIT
 */

"use client";

import { Field } from "../../../types";
import { stripHtml } from "string-strip-html";
import { cleanAndCapitalize } from "../../../utils/stringfuns";
import cardStyle from "../../../utils/styles";

/**
 * FieldHistory component that displays a modal with historical field values
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.fieldName - Name of the field
 * @param {string} props.timestamp - Timestamp of the historical value
 * @param {any} props.value - The historical value to display
 * @returns {JSX.Element} Rendered field history component with modal
 *
 * @example
 * ```tsx
 * <FieldHistory
 *   fieldName="title"
 *   timestamp="2023-01-01"
 *   value="Old title value"
 * />
 * ```
 */
function FieldHistory({
  fieldName,
  timestamp,
  value,
}: {
  fieldName: string;
  timestamp: string;
  value: any;
}) {
  // Variables
  const modalName = fieldName + timestamp;

  return (
    <div>
      <label htmlFor={modalName} className="btn btn-xs">
        {timestamp}
      </label>
      <input type="checkbox" id={modalName} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">From {timestamp}</h3>
          <p className="py-4 break-words">{value}</p>
          <div className="modal-action">
            <label className="btn btn-warning">Revert</label>
            <label htmlFor={modalName} className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Details component that displays field metadata and history
 *
 * @component
 * @param {Object} props - Component props
 * @param {Field} props.field - The field object containing metadata and history
 * @returns {JSX.Element} Rendered details component
 *
 * @example
 * ```tsx
 * <Details field={fieldObject} />
 * ```
 */
export default function Details({ field }: { field: Field }) {
  if (typeof field.value === "string") {
    field.value = stripHtml(field.value).result;
  }

  return (
    <div className={cardStyle + "p-2 stats stats-vertical overflow-auto"}>
      <div className="h-auto overflow-auto break-words stat">
        <div className="flex items-center">
          <div className="text-lg stat-value">
            {cleanAndCapitalize(field.name)}
          </div>
        </div>
        <p className="text-xs text-gray-400">{field.description}</p>
        <hr className="my-2" />
        <div className="grid">
          {Object.entries(field.history).map(([timestamp, value]) => (
            <FieldHistory
              timestamp={timestamp}
              value={value}
              fieldName={field.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
