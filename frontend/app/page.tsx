/**
 * @fileoverview Home page component that handles dataset fetching and review redirection
 * @author EasyReview
 * @license MIT
 */

// @ts-ignore
import CryptoJS from "crypto-js";
import { redirect } from "next/navigation";
import getDataset, { ReviewQuery } from "./utils/loader";

/** Backend API endpoint for fetching reviews */
const BACKEND_URL = "http://easyreview-backend:8000/api/reviews/fetch/";

/**
 * Interface defining the expected query parameters
 * @interface queryParams
 */
interface queryParams {
  /** URL of the data repository site */
  siteUrl: string;
  /** API token for authentication with the data repository */
  apiToken: string | null;
  /** Persistent identifier for the dataset */
  datasetPid: string;
  /** Optional encrypted review token */
  token?: string;
}

/**
 * Home page component that handles:
 * 1. Decrypting review tokens and redirecting to review pages
 * 2. Fetching dataset metadata and creating new reviews
 * 3. Redirecting to existing reviews
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.slug - URL slug
 * @param {queryParams} props.searchParams - URL query parameters
 * @returns {Promise<JSX.Element>} Rendered component or redirect
 */
export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: queryParams;
}) {
  /**
   * Decrypts an encrypted review token
   * @param {string} token - Encrypted token string
   * @returns {string} Decrypted review ID
   */
  const decryptData = (token: string) => {
    const cleanedToken = token
      .toString()
      .replace(/xMl3Jk/g, "+")
      .replace("Por21Ld", "/")
      .replace("Ml32", "=");
    const bytes = CryptoJS.AES.decrypt(cleanedToken, "XkhZG4fW2t2W");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  // Handle direct review access via encrypted token
  if (searchParams.token) {
    const reviewId = decryptData(searchParams.token);
    redirect(`/review/${reviewId}`);
  }

  // Attempt to fetch or create review for dataset
  const query: ReviewQuery = await getDataset({
    site_url: searchParams.siteUrl,
    doi: searchParams.datasetPid,
    api_token: searchParams.apiToken,
    BACKEND_URL: BACKEND_URL,
  });

  // Redirect to existing review if found
  if (query.review_id) {
    redirect(`/review/${query.review_id}`);
  }

  // Display error if dataset could not be fetched
  return <h1>Could not fetch dataset</h1>;
}
