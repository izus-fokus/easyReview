/**
 * @fileoverview SideNote component for displaying chat messages and suggestions in a floating panel
 * @author EasyReview
 * @license MIT
 */

"use client";

import { ChatMessage, Field } from "@/app/types";
import { FloatingPortal, UseFloatingReturn } from "@floating-ui/react";
import { forwardRef, useEffect, useState } from "react";
import { BsChatLeftTextFill } from "react-icons/bs";
import { VscClose } from "react-icons/vsc";
import Message from "./message";
import useReviewStore from "@/app/stores/reviewstore";
import { getFieldChatMessages, sendFieldChatMessage } from "../actions/chat";
import { cleanAndCapitalize } from "@/app/utils/stringfuns";

/**
 * Props interface for the SideNote component
 * @interface
 */
interface SideNoteProps {
  /** The field object containing data and metadata */
  field: Field;
  /** Floating UI props for positioning */
  floatingProps: UseFloatingReturn;
  /** Ref for the arrow SVG element */
  arrowRef: React.Ref<SVGSVGElement>;
}

/**
 * Sorts chat messages by timestamp in descending order
 * @param {ChatMessage[]} messages - Array of chat messages to sort
 * @returns {ChatMessage[]} Sorted array of messages
 */
const sortMessagesByTimeStamp = (messages: ChatMessage[]) => {
  return messages.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

/**
 * SideNote component that displays a floating panel with chat messages and suggestions
 *
 * @component
 * @param {SideNoteProps} props - Component props
 * @param {React.Ref<SVGSVGElement>} ref - Forwarded ref for the SVG element
 * @returns {JSX.Element | null} Rendered side note component or null if hidden
 *
 * @example
 * ```tsx
 * <SideNote
 *   field={fieldData}
 *   floatingProps={floatingUIProps}
 *   arrowRef={arrowReference}
 * />
 * ```
 */
const SideNote = forwardRef(function SideNoteFun(
  props: SideNoteProps,
  ref: React.Ref<SVGSVGElement>
) {
  // Props
  const { field, floatingProps } = props;
  const { refs, floatingStyles } = floatingProps;

  // Actions
  const setSeletedField = useReviewStore((state) => state.setSelectedField);

  // States
  const selectedField = useReviewStore((state) => state.selectedField);
  const [messages, setMessages] = useState<ChatMessage[]>(field.chat);
  const [textMessage, setTextMessage] = useState<string>("");
  const [sentMessage, setSentMessage] = useState<boolean>(false);

  // Effects
  useEffect(() => {
    const fetchMessages = async () => {
      const response: ChatMessage[] = await getFieldChatMessages(field.id);
      setMessages(sortMessagesByTimeStamp(response));
    };
    fetchMessages();
    setSentMessage(false);
  }, [selectedField, sentMessage]);

  /**
   * Handles clicking the chat symbol to open the side note
   */
  const onSymbolClick = () => {
    setSeletedField(field.id);
  };

  /**
   * Handles clicking the close button to close the side note
   */
  const onCloseClick = () => {
    setSeletedField("");
  };

  /**
   * Handles sending a new chat message
   */
  const sendMessage = () => {
    if (textMessage.length === 0) {
      return;
    }

    sendFieldChatMessage(textMessage, "JR", field.id);
    setTextMessage("");
    setSentMessage(true);
  };

  // Return null if field not selected and has no messages
  if (field.id !== selectedField && messages.length === 0) {
    return null;
  }

  // Show chat icon if field not selected but has messages
  if (field.id !== selectedField && messages.length > 0) {
    return (
      <FloatingPortal id="sidenotes">
        <div ref={refs.setFloating} style={floatingStyles}>
          <div
            className="duration-200 scale-105 text-base-content/90 drop-shadow-2xl hover:text-accent hover:scale-125"
            onClick={onSymbolClick}
          >
            <BsChatLeftTextFill className="drop-shadow-2xl" />
          </div>
        </div>
      </FloatingPortal>
    );
  }

  // Show full side note panel when field is selected
  return (
    <FloatingPortal id="sidenotes">
      <div
        className="flex flex-col p-4 shadow-md shadow-black rounded-2xl w-[22rem] border-[1px]  backdrop-blur-xl border-neutral z-40"
        ref={refs.setFloating}
        style={floatingStyles}
      >
        <div className="flex flex-row place-items-center justify-between border-b-[1px] border-neutral pb-2">
          {cleanAndCapitalize(field.name)}
          <VscClose className="cursor-pointer" onClick={onCloseClick} />
        </div>
        <div className="flex flex-col-reverse py-3 overflow-auto max-h-96">
          {messages.map((message: ChatMessage) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <div className="pb-5">
          <textarea
            className="w-full rounded-xl textarea textarea-primary"
            placeholder="Type your message here or add a suggestion via '@suggest'"
            onChange={(e) => setTextMessage(e.target.value)}
            value={textMessage}
          />
          <div
            className="w-full mt-2 btn btn-sm btn-neutral"
            onClick={sendMessage}
          >
            Send message
          </div>
        </div>
      </div>
    </FloatingPortal>
  );
});

export default SideNote;
