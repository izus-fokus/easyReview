/**
 * @fileoverview Primitive field component that displays individual metadata fields with review functionality
 * @author EasyReview
 * @license MIT
 */

"use client";

import { cleanAndCapitalize } from "../../../utils/stringfuns";
import { Field as FieldType } from "../../../types";
import { stripHtml } from "string-strip-html";
import { useEffect, useRef, useState } from "react";
import FieldWrapper from "./fieldwrapper";
import { FaXmark, FaCheck, FaExclamation } from "react-icons/fa6";
import {
  arrow,
  autoUpdate,
  offset,
  useFloating,
  shift,
  flip,
} from "@floating-ui/react";
import SideNote from "./sidenote";
import useReviewStore from "@/app/stores/reviewstore";
import { motion, AnimatePresence } from "framer-motion";
import Suggest from "./suggest";

interface BoxOffset {
  mainAxis: number;
  crossAxis: number;
}

/**
 * Shortens a string to a maximum length and adds ellipsis
 * @param {string} str - String to shorten
 * @param {number} maxLen - Maximum length before truncating
 * @returns {string} Shortened string with ellipsis if needed
 */
const shortenLongString = (str: string, maxLen: number) => {
  if (typeof str !== "string") return str;
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen) + "...";
};

/**
 * Primitive component that renders individual metadata fields with review functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {FieldType} props.field - The field object containing data and metadata
 * @param {string} props.datasetId - ID of the dataset the field belongs to
 * @param {boolean} [props.isCompound] - Whether this field is part of a compound field
 * @returns {JSX.Element} Rendered primitive field component
 *
 * @example
 * ```tsx
 * <Primitive
 *   field={fieldData}
 *   datasetId="123"
 *   isCompound={false}
 * />
 * ```
 */
export default function Primitive({
  field,
  datasetId,
  isCompound = false,
}: {
  field: FieldType;
  datasetId: string;
  isCompound?: boolean;
}) {
  if (typeof field.value === "string") {
    field.value = stripHtml(field.value).result;
  }

  // States
  const [accepted, setAccepted] = useState<boolean>(field.accepted);
  const [hover, setHover] = useState<boolean>(false);
  const [boxOffset, setBoxOffset] = useState<BoxOffset>({
    mainAxis: 40,
    crossAxis: 0,
  });
  const selectedField = useReviewStore((state) => state.selectedField);
  const selectedSuggestionField = useReviewStore(
    (state) => state.suggestionField
  );

  // Effects
  useEffect(() => {
    if (selectedField === field.id) {
      setBoxOffset({ mainAxis: -30, crossAxis: 0 });
    } else {
      setBoxOffset({ mainAxis: 40, crossAxis: 0 });
    }
  }, [selectedField]);

  // Handler
  const onMouseOver = () => setHover(true);
  const onMouseOut = () => setHover(false);

  // Floating UI
  const arrowRef = useRef<SVGSVGElement>(null);
  const floatingProps = useFloating({
    placement: "right-start",
    strategy: "absolute",
    whileElementsMounted: autoUpdate,
    middleware: [
      shift(),
      arrow({
        element: arrowRef,
      }),
      offset(boxOffset),
    ],
  });

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    strategy: "absolute",
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Review decision
  let symbol = (
    <div className="px-1 text-xs text-warning">
      <FaExclamation />
    </div>
  );

  if (accepted === true) {
    symbol = (
      <div className="px-1 text-xs opacity-100 text-success">
        <FaCheck />
      </div>
    );
  } else if (accepted === false) {
    symbol = (
      <div className="px-1 text-xs text-error">
        <FaXmark />
      </div>
    );
  }

  const hasSuggestions = Object.keys(field.history).length > 1;
  const suggestStyle = "italic tooltip tooltip-bottom";

  if (field.name === "text") {
    isCompound = false;
  }

  return (
    <FieldWrapper field={field} setAccepted={setAccepted} datasetId={datasetId}>
      <div
        id={field.id}
        ref={floatingProps.refs.setReference}
        className={
          "grid grid-cols-9 break-word md:justify-center xs:justify-start pl-2 my-2 "
        }
      >
        <div className="flex flex-row col-span-3 place-items-center text-neutral-content">
          <div className="mx-2">{symbol}</div>
          <h2 className="text-sm font-semibold text-base-content">
            {cleanAndCapitalize(field.name)}
          </h2>
        </div>
        <div
          className={`${
            hasSuggestions ? suggestStyle : ""
          } flex flex-row col-span-6 break-words place-items-start leading-7 text-justify text-ellipsis text-neutral-content text-sm`}
          data-tip={hasSuggestions ? "This is a suggestion" : ""}
          onMouseEnter={onMouseOver}
          onMouseLeave={onMouseOut}
        >
          {hover === false && isCompound === true
            ? shortenLongString(field.value, 400)
            : field.value}
        </div>
      </div>
      <SideNote
        field={field}
        floatingProps={floatingProps}
        arrowRef={arrowRef}
      />
    </FieldWrapper>
  );
}
