/**
 * @fileoverview Utility functions for loading and calculating review statistics
 * @author EasyReview
 * @license MIT
 */

import { Statistic } from "../types";
import backendRequest from "./requests";

/**
 * Fetches and calculates the progress percentage for a review
 *
 * @param {string} id - The ID of the review to fetch stats for
 * @returns {Promise<number>} The progress percentage from 0-100
 *
 * @example
 * ```ts
 * const progress = await fetchProgress("123")
 * // Returns: 75 (meaning 75% complete)
 * ```
 */
export const fetchProgress = async (id: string) => {
  // Get Backend URL
  const DJANGO_HOST = process.env.NEXT_PUBLIC_DJANGO_HOST;
  const DJANGO_PORT = process.env.NEXT_PUBLIC_DJANGO_PORT;

  const url = `http://${DJANGO_HOST}:${DJANGO_PORT}/api/reviews/${id}/stats/`;
  const response = await backendRequest(url, "GET");
  const { field_count, accpected_count }: Statistic = await response.json();
  return Math.round((accpected_count / field_count) * 100);
};
