import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import FeeTableRow from './FeeTableRow';

const FeeTable = ({ fees, loading, onEdit, onDelete, onUpdateStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [fees]);

  if (loading) {
    return <div className="text-center py-8 text-[#616161] text-xs">Loading...</div>;
  }

  if (fees.length === 0) {
    return <div className="text-center py-8 text-[#616161] text-xs">No fees found</div>;
  }

  const totalPages = Math.ceil(fees.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentFees = fees.slice(startIndex, endIndex);

  //handlers for pagination
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPage = (page) => setCurrentPage(page);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="w-full">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#158fd4] to-[#0e4a80] text-white">
              <tr>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[22%]">
                  Fee Details
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[20%]">
                  Student
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[16%]">
                  Organization
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[12%]">
                  Amount
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[10%]">
                  Status
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[12%]">
                  Due Date
                </th>
                <th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-[8%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentFees.map((fee, index) => (
                <FeeTableRow
                  key={`${fee.fee_id}-${index}`}
                  fee={fee}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onUpdateStatus={onUpdateStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, fees.length)} of {fees.length} results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            aria-label="Go to first page"
          >
            <ChevronsLeft size={16} />
          </button>
          
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            aria-label="Go to previous page"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex space-x-1">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  currentPage === pageNum
                    ? 'bg-[#158fd4] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            aria-label="Go to next page"
          >
            <ChevronRight size={16} />
          </button>
          
          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            aria-label="Go to last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeTable;