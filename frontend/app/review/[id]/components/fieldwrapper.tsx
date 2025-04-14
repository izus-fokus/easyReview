/**
 * @fileoverview Field wrapper component that provides context menu and interaction functionality
 * @author EasyReview
 * @license MIT
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { VscCheck, VscChromeClose, VscFeedback } from "react-icons/vsc";
import { stripHtml } from "string-strip-html";
import useReviewStore from "../../../stores/reviewstore";
import { Field as FieldType } from "../../../types";
import { fetchProgress } from "../../../utils/statsloader";
import Context from "./contextmenu";
import cardStyle from "../../../utils/styles";
import { updateField } from "../actions/field";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Suggest from "./suggest";

/**
 * FieldWrapper component that wraps field content with context menu and interaction handlers
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The field content to wrap
 * @param {FieldType} props.field - The field object containing data and metadata
 * @param {Function} props.setAccepted - Callback function to update field acceptance status
 * @param {string} props.datasetId - ID of the dataset the field belongs to
 * @returns {JSX.Element} Rendered field wrapper component
 *
 * @example
 * ```tsx
 * <FieldWrapper
 *   field={fieldObject}
 *   setAccepted={(accepted) => handleAcceptance(accepted)}
 *   datasetId="123"
 * >
 *   <FieldContent />
 * </FieldWrapper>
 * ```
 */
export default function FieldWrapper({
  children,
  field,
  setAccepted,
  datasetId,
}: {
  children: React.ReactNode;
  field: FieldType;
  setAccepted: (accepted: boolean) => void;
  datasetId: string;
}) {
  if (typeof field.value === "string") {
    field.value = stripHtml(field.value).result;
  }

  // Rerender when the field is accepted
  useEffect(() => {}, [field.accepted]);

  // States
  const [_, setClicked] = useState<boolean>(false);
  const selectedField = useReviewStore((state) => state.selectedField);
  const path = usePathname();
  const selectedSuggestionField = useReviewStore(
    (state) => state.suggestionField
  );

  // Actions
  const updateProgress = useReviewStore((state) => state.updateProgress);
  const setSelectedField = useReviewStore((state) => state.setSelectedField);
  const setSuggestionField = useReviewStore(
    (state) => state.setSuggestionField
  );
  /**
   * Handles updating the field's acceptance status
   * @param {boolean} decision - Whether to accept or decline the field
   */
  const handleUpdate = (decision: boolean) => {
    setAccepted(decision);
    updateField({ accepted: decision }, field.id);
    setClicked(false);
    fetchProgress(datasetId).then((progress) => updateProgress(progress));
  };

  /**
   * Handles opening the chat interface for the field
   */
  const handleChat = () => {
    setClicked(false);
    setSelectedField(field.id);
  };

  /**
   * Handles suggestion functionality (placeholder)
   */
  const handleSuggest = () => {
    setClicked(false);
    setSuggestionField(field.id);
  };

  /**
   * Handles sharing the field by copying its URL to clipboard
   */
  const handleShare = () => {
    setClicked(false);
    navigator.clipboard.writeText(`localhost:3000${path}?field_id=${field.id}`);
  };

  const menu = (
    <ul
      className={`${cardStyle} shadow-xl text-base-content bg-base-200/40 backdrop-blur-md w-36 menu rounded-xl border-[1px] border-neutral`}
    >
      <li>
        <p
          onClick={() => {
            handleUpdate(true);
          }}
        >
          <VscCheck className="text-success" />
          Accept
        </p>
      </li>
      <li>
        <p
          onClick={() => {
            handleUpdate(false);
          }}
        >
          <VscChromeClose className="text-error" />
          Decline
        </p>
      </li>
      <li>
        <p onClick={handleChat}>
          <VscFeedback className="text-info" />
          Chat
        </p>
      </li>
      <li>
        <p onClick={handleSuggest}>
          <VscFeedback className="text-info" />
          Suggest
        </p>
      </li>
    </ul>
  );

  return (
    <>
      <Context menu={menu}>
        <div
          className={`px-2 pr-2 m-3 my-1 mr-2 transition-all duration-75 ease-out rounded-md outline-none focus:outline-none ${
            selectedField === field.id ? "bg-base-100" : "hover:bg-base-100"
          }`}
          onContextMenu={() => {
            setClicked(true);
          }}
        >
          {children}
        </div>
        {selectedSuggestionField === field.id && (
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Suggest />
            </motion.div>
          </AnimatePresence>
        )}
      </Context>
    </>
  );
}
