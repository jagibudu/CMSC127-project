import React from 'react';
import Button from '../ui/Button';

const MembershipFilters = ({ 
  showFilters, 
  filters, 
  setFilters, 
  organizations, 
  statusOptions, 
  filterRoles, 
  onClearFilters 
}) => {
  if (!showFilters) return null;

  return (
    <div className="bg-[#ffffff] p-4 rounded-lg mb-6 border border-[#9daecc]">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#01050b] mb-1">Organization</label>
          <select
            value={filters.organization_id}
            onChange={(e) => setFilters({...filters, organization_id: e.target.value})}
            className="w-full px-3 py-2 border border-[#9daecc] rounded-md text-sm bg-[#ffffff] text-[#01050b] focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
          >
            <option value="">All Organizations</option>
            {organizations.map(org => (
              <option key={org.organization_id} value={org.organization_id}>
                {org.organization_name || org.organization_id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#01050b] mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="w-full px-3 py-2 border border-[#9daecc] rounded-md text-sm bg-[#ffffff] text-[#01050b] focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#01050b] mb-1">Role</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters({...filters, role: e.target.value})}
            className="w-full px-3 py-2 border border-[#9daecc] rounded-md text-sm bg-[#ffffff] text-[#01050b] focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
          >
            <option value="">All Roles</option>
            {filterRoles.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#01050b] mb-1">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({...filters, gender: e.target.value})}
            className="w-full px-3 py-2 border border-[#9daecc] rounded-md text-sm bg-[#ffffff] text-[#01050b] focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#01050b] mb-1">Degree Program</label>
          <input
            type="text"
            value={filters.degree_program}
            onChange={(e) => setFilters({...filters, degree_program: e.target.value})}
            placeholder="Enter program..."
            className="w-full px-3 py-2 border border-[#9daecc] rounded-md text-sm bg-[#ffffff] text-[#01050b] focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onClearFilters}
          className="px-3 py-1 text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] rounded"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default MembershipFilters;