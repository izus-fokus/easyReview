/**
 * @fileoverview Utility functions for loading review and field data from the backend
 * @author EasyReview
 * @license MIT
 */

import backendRequest from "./requests";

/**
 * Interface representing the response from a review query
 * @interface ReviewQuery
 */
export interface ReviewQuery {
  /** Status message from the backend */
  message: string;
  /** Unique identifier for the review */
  review_id: string;
}

/**
 * Fetches field data for a specific field ID from the backend
 *
 * @param {string} id - The ID of the field to fetch
 * @param {string} BACKEND_URL - Base URL of the backend API
 * @returns {Promise<any>} The field data as JSON
 *
 * @example
 * ```ts
 * const fieldData = await fetchFieldData("123", "http://api.example.com")
 * ```
 */
export async function fetchFieldData(id: string, BACKEND_URL: string) {
  if (!BACKEND_URL.endsWith("/")) {
    BACKEND_URL = BACKEND_URL + "/";
  }

  const url = `${BACKEND_URL}${id}`;
  const res = await backendRequest(url, "GET");
  return await res.json();
}

/**
 * Fetches dataset information and creates a new review
 *
 * @param {Object} params - The parameters for fetching the dataset
 * @param {string} params.site_url - URL of the dataset repository
 * @param {string} params.doi - Digital Object Identifier of the dataset
 * @param {string|null} params.api_token - API token for authentication
 * @param {string} params.BACKEND_URL - Base URL of the backend API
 * @returns {Promise<ReviewQuery>} Review query response
 * @throws {Error} If the backend request fails
 *
 * @example
 * ```ts
 * const review = await getDataset({
 *   site_url: "https://example.com",
 *   doi: "10.1234/abc",
 *   api_token: "token123",
 *   BACKEND_URL: "http://api.example.com"
 * })
 * ```
 */
export default async function getDataset({
  site_url,
  doi,
  api_token,
  BACKEND_URL,
}: {
  site_url: string;
  doi: string;
  api_token: string | null;
  BACKEND_URL: string;
}) {
  if (!BACKEND_URL.endsWith("/")) {
    BACKEND_URL = BACKEND_URL + "/";
  }

  const url = "http://easyreview-backend:8000/api/reviews/fetch/";
  const payload = JSON.stringify({
    site_url: site_url,
    doi: doi,
    api_token: api_token,
  });

  const res = await backendRequest(url, "POST", payload);

  if (res.status !== 200) {
    throw new Error(await res.text());
  }

  const review: ReviewQuery = await res.json();

  return review;
}
