/**
 * @fileoverview Message component for displaying chat messages with user avatars and metadata
 * @author EasyReview
 * @license MIT
 */

"use client";

import { ChatMessage } from "@/app/types";

/**
 * Avatar component that displays a user's avatar with initials
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.user - Username to display initials for
 * @returns {JSX.Element} Rendered avatar component
 */
function Avatar({ user }: { user: string }) {
  return (
    <div>
      <div className="avatar placeholder">
        <div className="w-8 rounded-full bg-neutral text-neutral-content">
          <span className="text-sm">ER</span>
        </div>
      </div>
    </div>
  );
}

/**
 * MessageHeader component that displays message metadata like user, timestamp and suggestion badge
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.user - Username of message sender
 * @param {string} props.timestamp - ISO timestamp string of when message was sent
 * @param {boolean} props.isSuggestion - Whether the message is a suggestion
 * @returns {JSX.Element} Rendered message header component
 */
function MessageHeader({
  user,
  timestamp,
  isSuggestion,
}: {
  user: string;
  timestamp: string;
  isSuggestion: boolean;
}) {
  // Conversions
  const time = new Date(timestamp);
  const timeString = time.toLocaleString("en-GB", { timeZone: "UTC" });

  return (
    <div className="flex flex-row gap-3 place-items-center">
      <Avatar user={"JR"} />
      <div className="flex flex-col w-full">
        <div className="flex flex-row gap-2 place-items-center">
          <div className="text-sm font-bold">{user}</div>
          {isSuggestion ? (
            <div className="badge badge-sm badge-outline badge-primary">
              Suggestion
            </div>
          ) : null}
        </div>
        <div className="text-xs font-light text-neutral-400">{timeString}</div>
      </div>
    </div>
  );
}

/**
 * Message component that displays a chat message with header and content
 *
 * @component
 * @param {Object} props - Component props
 * @param {ChatMessage} props.message - Message object containing user, timestamp and content
 * @returns {JSX.Element} Rendered message component
 *
 * @example
 * ```tsx
 * <Message
 *   message={{
 *     user: "John",
 *     timestamp: "2023-01-01T12:00:00Z",
 *     message: "Hello world"
 *   }}
 * />
 * ```
 */
export default function Message({ message }: { message: ChatMessage }) {
  return (
    <div className="flex flex-col gap-2 py-2">
      <MessageHeader
        user={message.user}
        timestamp={message.timestamp}
        isSuggestion={message.message.startsWith("@suggest")}
      />
      <div className="text-sm font-light">
        {message.message.replace("@suggest", "").trim()}
      </div>
    </div>
  );
}
