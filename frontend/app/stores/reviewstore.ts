/**
 * @fileoverview Store for managing review state and actions using Zustand
 * @author EasyReview
 * @license MIT
 */

import { create } from "zustand";

/**
 * Interface defining the shape of the review state and actions
 * @interface ReviewState
 */
interface ReviewState {
  /** Current progress percentage of the review */
  progress: number;
  /** Flag indicating if changes have been made */
  changed: boolean;
  /** Flag to toggle visibility of completed items */
  hideComplete: boolean;
  /** Function to toggle the hideComplete state */
  updateHideComplete: () => void;
  /** Function to update the progress percentage
   * @param progress - New progress value
   */
  updateProgress: (progress: number) => void;
  /** Function to toggle the changed state */
  setChanged: () => void;
  /** Secret password for authentication */
  secretPass: string;
  /** Currently selected field ID */
  selectedField: string;
  /** Currently open field for suggestion */
  suggestionField?: string;
  /** Function to set the selected field
   * @param field - Field ID to select
   */
  setSelectedField: (field: string) => void;
  /** Flag indicating if chat interface is open */
  chatOpen: boolean;
  /** Function to toggle the chat interface */
  setChatOpen: () => void;
  /** Function to set the suggestion field
   * @param field - Field ID to set as suggestion
   */
  setSuggestionField: (field: string) => void;
}

/**
 * Zustand store for managing review state and actions
 * Provides functionality for:
 * - Tracking review progress
 * - Managing UI state like hiding completed items
 * - Handling field selection
 * - Controlling chat interface visibility
 */
const useReviewStore = create<ReviewState>()((set) => ({
  secretPass: "XkhZG4fW2t2W",
  progress: 0,
  hideComplete: false,
  changed: false,
  updateHideComplete: () =>
    set((state) => ({ hideComplete: !state.hideComplete })),
  updateProgress: (progress) => set((state) => ({ progress: progress })),
  setChanged: () => set((state) => ({ changed: !state.changed })),
  selectedField: "",
  setSelectedField: (field) => set((state) => ({ selectedField: field })),
  chatOpen: false,
  setChatOpen: () => set((state) => ({ chatOpen: !state.chatOpen })),
  suggestionField: undefined,
  setSuggestionField: (field) => set((state) => ({ suggestionField: field })),
}));

export default useReviewStore;
