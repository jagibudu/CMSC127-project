import React from 'react';

export const StatusBadge = ({ status }) => {
  const colors = {
    'Active': 'bg-green-100 text-green-800',
    'Alumni': 'bg-blue-100 text-blue-800',
    'Inactive': 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

export const RoleBadge = ({ role }) => {
  const colors = {
    'President': 'bg-purple-100 text-purple-800',
    'Vice President': 'bg-indigo-100 text-indigo-800',
    'Secretary': 'bg-yellow-100 text-yellow-800',
    'Treasurer': 'bg-green-100 text-green-800',
    'Officer': 'bg-orange-100 text-orange-800',
    'Committee Chair': 'bg-red-100 text-red-800',
    'Member': 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
      {role}
    </span>
  );
};