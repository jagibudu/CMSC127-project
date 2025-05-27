import React from 'react';
import { Plus, Filter, Search, Users, UserCheck } from 'lucide-react';
import Button from '../ui/Button';

const MembershipHeader = ({ 
  showFilters, 
  setShowFilters, 
  onAddMembership,
  searchTerm, 
  setSearchTerm, 
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
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
            variant="primary"
            onClick={onAddMembership} 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus size={16} />
            Add Membership
          </Button>
        </div>
      </div>

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
      <div className="flex items-center gap-6 text-sm">
      </div>
    </div>
  );
};

export default MembershipHeader;