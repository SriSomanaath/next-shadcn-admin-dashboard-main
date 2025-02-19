import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"; // Import your UI components

interface PaginationProps {
  table: {
    previousPage: () => void;
    nextPage: () => void;
    getCanPreviousPage: () => boolean;
    getCanNextPage: () => boolean;
    getPageCount: () => number;
    getPageIndex: () => number;
  };
  setPageIndex: (index: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({ table, setPageIndex }) => {
  const pageIndex = table.getPageIndex();
  const pageCount = table.getPageCount();

  // Handle Previous Page
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (table.getCanPreviousPage()) {
      table.previousPage();
    }
  };

  // Handle Next Page
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (table.getCanNextPage()) {
      table.nextPage();
    }
  };

  console.log(`Page Index: ${pageIndex}, Page Count: ${pageCount}`); // Add debug log

  return (
    <Pagination className="flex justify-end"> {/* Added class to align to the right */}
      <PaginationContent>
        {/* Previous Page Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={`px-3 py-2 text-gray-700 border rounded ${!table.getCanPreviousPage() ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </PaginationItem>
  
        {/* Page Number Buttons */}
        {Array.from({ length: pageCount }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              onClick={(e) => {
                if (i !== pageIndex) {
                  setPageIndex(i);
                }
                e.preventDefault(); // Prevent default link behavior
              }}
              isActive={i === pageIndex}
              className="px-3 py-2 text-gray-700 border rounded"
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
  
        {/* Ellipsis for large page count */}
        {pageCount > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
  
        {/* Next Page Button */}
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={`px-3 py-2 text-gray-700 border rounded ${!table.getCanNextPage() ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
  
};

export default PaginationComponent;
