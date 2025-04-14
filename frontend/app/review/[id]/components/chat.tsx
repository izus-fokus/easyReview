/**
 * @fileoverview Chat component for displaying messaging interface between reviewers and users
 * @author EasyReview
 * @license MIT
 */

import cardStyle from "../../../utils/styles";

const DESCRIPTION =
  "Stay in contact by using direct messages. Within this feature both reviewers and users are able to communicate.";

/**
 * Chat component that provides a messaging interface with example messages
 *
 * @component
 * @returns {JSX.Element} Rendered chat component with messaging UI
 *
 * @example
 * ```tsx
 * <Chat />
 * ```
 */
export default function Chat() {
  return (
    <div
      className={
        cardStyle +
        "flex flex-col overflow-auto break-words stats stats-horizontal stat rounded-xl"
      }
    >
      <div className="text-lg stat-value">Chat</div>
      <p className="mb-5 text-xs text-gray-400 border-transparent">
        {DESCRIPTION}
      </p>
      <div className="flex flex-col justify-center px-2 py-4 border-transparent rounded-lg pattern-wavy pattern-slate-100 pattern-size-2 pattern-bg-slate-50">
        <div className="text-xs">
          <div className="chat chat-start">
            <div className="chat-bubble">
              It's over Anakin, <br />I have the high ground.
            </div>
          </div>
          <div className="chat chat-end">
            <div className="chat-bubble">You underestimate my power!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
