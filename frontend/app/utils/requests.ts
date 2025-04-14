/**
 * @fileoverview Utility functions for making authenticated requests to the backend API
 * @author EasyReview
 * @license MIT
 */

/**
 * Interface defining the shape of the fetch request payload
 * @interface PayloadType
 */
interface PayloadType {
  /** HTTP method for the request */
  method: string;
  /** Request headers */
  headers: Headers;
  /** Optional request body */
  body?: string;
  /** Next.js cache configuration */
  next: {
    /** Cache revalidation time in seconds */
    revalidate?: number;
    /** Cache tags for selective revalidation */
    tags?: string[];
  };
}

/**
 * Makes an authenticated request to the backend API
 *
 * @param {string} path - The API endpoint path
 * @param {string} method - The HTTP method to use
 * @param {string | null} body - Optional request body
 * @param {string} tag - Cache tag for revalidation
 * @param {number} revalidate - Cache revalidation time in seconds
 * @returns {Promise<Response>} The fetch response
 *
 * @example
 * ```ts
 * const response = await backendRequest(
 *   'http://api.example.com/endpoint',
 *   'POST',
 *   JSON.stringify({ data: 'value' }),
 *   'cache-tag',
 *   60
 * )
 * ```
 */
async function backendRequest(
  path: string,
  method: string,
  body: string | null = null,
  tag: string = "default",
  revalidate: number = 0
): Promise<Response> {
  // Retrieve the Django superuser credentials from the environment variables
  const DJANGO_SUPERUSER_USERNAME =
    process.env.NEXT_PUBLIC_DJANGO_SUPERUSER_USERNAME;
  const DJANGO_SUPERUSER_PASSWORD =
    process.env.NEXT_PUBLIC_DJANGO_SUPERUSER_PASSWORD;

  // Authenticate
  const header = new Headers();
  header.append("Accept", "application/json");
  header.append(
    "Authorization",
    "Basic " + btoa(DJANGO_SUPERUSER_USERNAME + ":" + DJANGO_SUPERUSER_PASSWORD)
  );

  // Set up payload
  let payload: PayloadType = {
    method: method,
    headers: header,
    next: {},
  };

  // // Configure caching
  // if (tag) {
  //     payload.next.tags = [tag]
  // } else {
  //     payload.next.revalidate = revalidate
  // }

  // Add body if it exists
  if (body) {
    header.append("Content-Type", "application/json");
    payload.body = body;
  }

  return fetch(path, payload);
}

export default backendRequest;
