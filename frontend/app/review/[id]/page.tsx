/**
 * @fileoverview Main review page component that displays dataset metadata and review interface
 * @author EasyReview
 * @license MIT
 */

import ErrorModal from "@/app/review/[id]/components/errormodal";
import Metadatablock from "@/app/review/[id]/components/metadatablock";
import Statistics from "@/app/review/[id]/components/statistics";
import { Dataset, Field, OpenFields } from "@/app/types";
import { fetchFieldData } from "@/app/utils/loader";
import backendRequest from "@/app/utils/requests";
import { openFieldsAction } from "./actions/openfieldaction";
import SideBar from "./components/sidebar";
import { Suspense } from "react";

// Config
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Interface
interface ErrorResponse {
  detail: string;
}

/**
 * Main review page component that handles displaying dataset metadata and review interface
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.params - URL parameters
 * @param {string} props.params.id - Dataset ID from the URL
 * @param {Object} props.searchParams - URL search parameters
 * @param {string} [props.searchParams.field_id] - Optional field ID to focus on
 * @returns {Promise<JSX.Element>} Rendered review page component
 *
 * @example
 * ```tsx
 * <Review
 *   params={{ id: "123" }}
 *   searchParams={{ field_id: "456" }}
 * />
 * ```
 */
export default async function Review({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { field_id?: string };
}) {
  // Get the dataset
  const url = `http://easyreview-backend:8000/api/reviews/${params.id}`;
  const res = await backendRequest(url, "GET");
  const dataset: Dataset | ErrorResponse = await res.json();

  if ("detail" in dataset) {
    const message = `The review of id ${params.id} could not be found. Please check the URL.`;
    return (
      <div className="flex flex-row justify-center w-full">
        <ErrorModal error={message} />
      </div>
    );
  }

  let field: Field | null = null;

  // If a field_id is provided, set it in the store
  if ("field_id" in searchParams) {
    const fieldURL = `http://easyreview-backend:8000/api/fields/`;
    field = await fetchFieldData(
      // @ts-ignore
      searchParams.field_id,
      fieldURL
    );
  }

  // Fetch open fields
  const openFields: OpenFields[] = await openFieldsAction(dataset.id);

  // Set the metadatablock to citation
  const metadatablockToOpen = "citation";

  // Extract the metdatablock to open
  const metadatablockToShow = dataset.metadatablocks.find(
    (metadatablock) => metadatablock.name === metadatablockToOpen
  );

  return (
    <div className="grid h-screen grid-cols-12 gap-10 px-[3%]">
      <div className="col-span-2 pt-24">
        <Statistics
          datasetId={dataset.id}
          reviewId={params.id}
          doi={dataset.doi}
          site_url={dataset.site_url}
        />
        <SideBar
          metadatablocks={dataset.metadatablocks}
          metadatablockToOpen={metadatablockToOpen}
          datasetId={dataset.id}
        />
      </div>
      <div className="flex flex-col col-span-8 pt-20 pb-64 mx-10 overflow-auto no-scrollbar gap-y-4">
        {metadatablockToShow === undefined ? null : (
          <Suspense fallback={<div>Loading...</div>}>
            {/* @ts-expect-error Async Server Component */}
            <Metadatablock
              metadatablock={metadatablockToShow}
              datasetId={dataset.id}
              openFields={openFields.find(
                (openField: OpenFields) =>
                  openField.name === metadatablockToOpen
              )}
            />
          </Suspense>
        )}
      </div>
      <div id="sidenotes" className="h-screen col-span-2" />
    </div>
  );
}
