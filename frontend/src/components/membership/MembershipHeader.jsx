import React from 'react';
import { Plus, Filter, Search, Users, UserCheck } from 'lucide-react';
import Button from '../ui/Button';

const MembershipHeader = ({ 
  showFilters, 
  setShowFilters, 
  onAddMembership,
  searchTerm, 
  setSearchTerm, 
  totalCount = 0, 
  activeCount = 0,
  isLoading = false
}) => {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 pb-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Membership Management
          </h1>
          <p className="text-gray-600">
            Manage student organization memberships and track participation
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Filter size={16} />
            Filters
          </Button>
          
          <Button 
            onClick={onAddMembership} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            <Plus size={16} />
            Add Membership
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={18} 
          />
          <input
            type="text"
            placeholder="Search members, organizations, committees..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm"
            disabled={isLoading}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              type="button"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-full">
          <Users size={16} />
          <span className="font-medium">Total: {totalCount}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-full">
          <UserCheck size={16} />
          <span className="font-medium">Active: {activeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default MembershipHeader;