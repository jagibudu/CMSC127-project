import React from 'react';
import { Search } from 'lucide-react';

const FeeFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
  return (
    <div className="bg-[#ffffff] rounded-lg shadow p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0e4a80]" size={20} />
            <input
              type="text"
              placeholder="Search fees, students, or organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#9daecc] rounded-lg focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-[#9daecc] rounded-lg focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
        >
          <option value="all">All Status</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Late">Late</option>
        </select>
      </div>
    </div>
  );
};

export default FeeFilters;