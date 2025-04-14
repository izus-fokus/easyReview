/**
 * @fileoverview Layout component for the review page that provides the header and content structure
 * @author EasyReview
 * @license MIT
 */

import Header from "./components/header";

interface ReviewLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

/**
 * Layout component that wraps review page content with a header
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the layout
 * @param {Object} props.params - URL parameters
 * @param {string} props.params.id - Dataset ID from the URL
 * @returns {JSX.Element} Rendered layout component with header and children
 *
 * @example
 * ```tsx
 * <ReviewLayout params={{ id: "123" }}>
 *   <ReviewContent />
 * </ReviewLayout>
 * ```
 */
export default function ReviewLayout({ children, params }: ReviewLayoutProps) {
  return (
    <div>
      <Header datasetId={params.id} />
      {children}
    </div>
  );
}
