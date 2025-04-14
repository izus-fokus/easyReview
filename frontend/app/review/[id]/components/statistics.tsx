/**
 * @fileoverview Statistics component that displays review progress and dataset information
 * @author EasyReview
 * @license MIT
 */

"use client";

// @ts-ignore
import CryptoJS from "crypto-js";
import { useEffect } from "react";
import useReviewStore from "../../../stores/reviewstore";
import { fetchProgress } from "../../../utils/statsloader";
import { usePathname } from "next/navigation";

/**
 * Encrypts data using AES encryption with custom character replacements
 *
 * @param {string} id - The ID to encrypt
 * @returns {string} The encrypted and cleaned token
 */
const encryptData = (id: string, secretPass: string) => {
  let token = CryptoJS.AES.encrypt(id, secretPass).toString();
  return token
    .replace(/\+/g, "xMl3Jk")
    .replace("/", "Por21Ld")
    .replace("=", "Ml32");
};

/**
 * Statistics component that shows review progress and dataset information
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.reviewId - ID of the current review
 * @param {string} props.datasetId - ID of the dataset being reviewed
 * @param {string} props.doi - Digital Object Identifier of the dataset
 * @param {string} props.site_url - Base URL of the dataset repository
 * @returns {JSX.Element} Rendered statistics component
 *
 * @example
 * ```tsx
 * <Statistics
 *   reviewId="123"
 *   datasetId="456"
 *   doi="10.1234/abc"
 *   site_url="https://example.com"
 * />
 * ```
 */
export default function Statistics({
  reviewId,
  datasetId,
  doi,
  site_url,
}: {
  reviewId: string;
  datasetId: string;
  doi: string;
  site_url: string;
}) {
  const pathname = usePathname();

  // States
  const progress = useReviewStore((state) => state.progress);
  const secretPass = useReviewStore((state) => state.secretPass);

  // Functions
  const constructShareLink = () => {
    try {
      // Create base URL using the environment variable
      const baseURL = new URL(process.env.NEXT_PUBLIC_BASE_URL || "");

      // Add the pathname without the /review/[id] part
      baseURL.pathname = pathname.split("/review")[0];

      // Add the token as a query parameter
      baseURL.searchParams.set("token", encryptData(reviewId, secretPass));

      return baseURL.toString();
    } catch (error) {
      console.error("Error constructing share link:", error);
      return ""; // Return empty string if URL construction fails
    }
  };

  // Actions
  const updateProgress = useReviewStore((state) => state.updateProgress);

  // Effects
  useEffect(() => {
    fetchProgress(datasetId).then((progress) => updateProgress(progress));
  }, []);

  // Handlers
  const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.select();
  };

  // Variables
  const isComplete = progress >= 100;

  return (
    <div>
      <div className="stat">
        <div className="flex justify-center mb-5 scale-x-100 scale-y-75 border-transparent">
          <progress
            className={`bg-base-100 progress border-transparent ${
              isComplete ? "progress-success" : "progress-primary"
            }`}
            value={progress}
            max={100}
          />
        </div>
        <div className="stat-desc">
          <a href={site_url} target="_blank">
            {site_url}
          </a>
        </div>
        <div className="text-lg stat-value">
          <a
            href={`${site_url}dataset.xhtml?persistentId=${doi}`}
            target="_blank"
          >
            {doi.replace("doi:", "")}
          </a>
        </div>
        <div className="flex flex-row justify-start my-4">
          <div className="w-full form-control">
            <input
              type="text"
              placeholder="Type here"
              className="w-full input input-bordered input-xs"
              value={constructShareLink()}
              onFocus={(e) => handleFocus(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
