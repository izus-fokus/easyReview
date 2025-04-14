/**
 * @fileoverview Suggest component that allows users to propose and submit changes to fields
 * @author EasyReview
 * @license MIT
 */

"use client";

import useReviewStore from "@/app/stores/reviewstore";
/**
 * Suggest component that provides an interface for suggesting changes to field values
 */
export default function Suggest() {
  const setSuggestionField = useReviewStore(
    (state) => state.setSuggestionField
  );

  return (
    <div className="flex flex-col justify-center ml-96 pb-4 pt-1 w-full max-w-xs shadow-md shadow-black/30 z-10 rounded-md bg-base-200 border-[1px] border-primary/40 relative">
      <button
        className="absolute top-1 right-2 text-neutral-content hover:text-neutral-content/40"
        onClick={() => {
          setSuggestionField("");
        }}
      >
        ✕
      </button>
      <input
        type="text"
        placeholder="Suggest a change ..."
        className="input input-xs text-xs bg-transparent focus:outline-none"
      />
    </div>
  );
}
