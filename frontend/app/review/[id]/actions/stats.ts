"use server";

import { Statistic } from "@/app/types"
import backendRequest from "@/app/utils/requests"

/**
 * Fetches the progress of a review.
 * 
 * @param reviewId - The ID of the review.
 * @returns The progress of the review as a percentage.
 * @throws An error if the request fails.
 */
export async function fetchProgress(
    reviewId: string,
) {
    const url = `http://easyreview-backend:8000/api/reviews/${reviewId}/stats/`
    const response = await backendRequest(url, 'GET', null, "stats")

    if (!response.ok) {
        throw new Error(response.statusText)
    }

    const { field_count, accpected_count }: Statistic = await response.json()

    return Math.round((accpected_count / field_count) * 100)
}