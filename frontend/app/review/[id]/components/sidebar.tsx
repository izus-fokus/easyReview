/**
 * @fileoverview Sidebar component that provides navigation and structure for the review interface
 * @author EasyReview
 * @license MIT
 */

import { Metadatablock } from "@/app/types";
import BlockNav from "./blocknav";
import NavElement from "./navelement";

/**
 * Sidebar component that renders navigation elements for metadata blocks and files
 *
 * @component
 * @param {Object} props - Component props
 * @param {Metadatablock[]} props.metadatablocks - Array of metadata blocks to display in navigation
 * @param {string} props.metadatablockToOpen - Name of the metadata block that should be initially opened
 * @param {string} props.datasetId - ID of the dataset being reviewed
 * @returns {JSX.Element} Rendered sidebar component with navigation elements
 *
 * @example
 * ```tsx
 * <SideBar
 *   metadatablocks={metadataBlocks}
 *   metadatablockToOpen="citation"
 *   datasetId="123"
 * />
 * ```
 */
export default function SideBar({
  metadatablocks,
  metadatablockToOpen,
  datasetId,
}: {
  metadatablocks: Metadatablock[];
  metadatablockToOpen: string;
  datasetId: string;
}) {
  return (
    <div className="flex flex-col translate-x-5">
      <NavElement title="Metadata" first>
        {metadatablocks.map((metadatablock: Metadatablock) => {
          const toOpen = metadatablock.name === metadatablockToOpen;
          return (
            <BlockNav
              metadatablock={metadatablock}
              toOpen={toOpen}
              datasetId={datasetId}
            />
          );
        })}
      </NavElement>
      <div className="flex flex-row justify-start pb-4 text-3xl font-bold text-transparent collapse-title bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text">
        Files
        <div className="badge badge-primary badge-xs">WIP</div>
      </div>
    </div>
  );
}
