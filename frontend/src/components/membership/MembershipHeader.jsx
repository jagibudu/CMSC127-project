import React from 'react';
import { Plus, Filter, Search, Users, UserCheck } from 'lucide-react';
import Button from '../ui/Button';

const MembershipHeader = ({ 
  showFilters, 
  setShowFilters, 
  onAddMembership, 
  searchTerm, 
  setSearchTerm, 
  totalCount, 
  activeCount 
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Membership Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage student organization memberships</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Filters
          </Button>
          <Button onClick={onAddMembership} className="flex items-center gap-2">
            <Plus size={16} />
            Add Membership
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by student number, name, organization, or committee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>Total: {totalCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck size={16} />
          <span>Active: {activeCount}</span>
        </div>
      </div>
    </>
  );
};

export default MembershipHeader;