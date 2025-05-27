import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from '../ui/Button';
import { StatusBadge, RoleBadge } from '../ui/Badges';

const MembershipTable = ({ memberships, onEdit, onDelete, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [memberships]);

  if (loading) {
    return <div className="text-center py-8 text-[#616161] text-xs">Loading...</div>;
  }

  if (memberships.length === 0) {
    return <div className="text-center py-8 text-[#616161] text-xs">No memberships found</div>;
  }

  const totalPages = Math.ceil(memberships.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentMemberships = memberships.slice(startIndex, endIndex);

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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="w-full">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#158fd4] to-[#0e4a80] text-white">
              <tr>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[22%]">
                  Student
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[20%]">
                  Organization
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[16%]">
                  Committee
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[12%]">
                  Role
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[10%]">
                  Status
                </th>
                <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[12%]">
                  Joined
                </th>
                <th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-[8%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentMemberships.map((membership, index) => (
                <tr
                  key={`${membership.student_number}-${membership.organization_id}-${index}`}
                  className="hover:bg-blue-50/50 transition-all duration-150"
                >
                  <td className="px-3 py-4 border-r border-gray-100">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {membership.student_number}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {membership.first_name} {membership.last_name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {membership.gender} • {membership.degree_program}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 border-r border-gray-100">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{membership.organization_name}</div>
                      <div className="text-xs text-gray-500 truncate">ID: {membership.organization_id}</div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-700 border-r border-gray-100">
                    <div className="truncate">
                      {membership.committee_name || '-'}
                    </div>
                  </td>
                  <td className="px-3 py-4 border-r border-gray-100">
                    <div className="flex justify-start">
                      <RoleBadge role={membership.role} />
                    </div>
                  </td>
                  <td className="px-3 py-4 border-r border-gray-100">
                    <div className="flex justify-start">
                      <StatusBadge status={membership.status} />
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-700 border-r border-gray-100">
                    <div className="flex items-center min-w-0">
                      <Calendar size={12} className="mr-1 text-gray-400 flex-shrink-0" />
                      <span className="truncate text-xs">
                        {membership.membership_date 
                          ? new Date(membership.membership_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: '2-digit'
                            })
                          : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(membership)}
                        className="text-[#158fd4] hover:text-[#0e4a80] hover:bg-blue-50 p-1 rounded transition-all duration-150"
                        aria-label={`Edit membership for ${membership.student_number}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(membership)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-all duration-150"
                        aria-label={`Delete membership for ${membership.student_number}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, memberships.length)} of {memberships.length} results
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

export default MembershipTable;