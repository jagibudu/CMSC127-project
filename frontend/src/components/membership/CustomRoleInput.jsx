import React from 'react';

const CustomRoleInput = ({ 
  showCustomRole, 
  customRole, 
  setCustomRole, 
  setShowCustomRole, 
  setFormData, 
  formData, 
  organizationRoles, 
  roleOptions 
}) => {
  const handleCancel = () => {
    setShowCustomRole(false);
    setFormData({...formData, role: 'Member'});
    setCustomRole('');
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Role
      </label>
      <select
        value={showCustomRole ? 'custom' : formData.role}
        onChange={(e) => {
          if (e.target.value === 'custom') {
            setShowCustomRole(true);
            setFormData({...formData, role: ''});
          } else {
            setShowCustomRole(false);
            setFormData({...formData, role: e.target.value});
            setCustomRole('');
          }
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select...</option>
        {(organizationRoles.length > 0 ? organizationRoles : roleOptions).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        <option value="custom">New Role (Custom)</option>
      </select>
      
      {showCustomRole && (
        <div className="mt-2">
          <input
            type="text"
            value={customRole}
            onChange={(e) => {
              setCustomRole(e.target.value);
              setFormData({...formData, role: e.target.value});
            }}
            placeholder="Enter custom role name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomRoleInput;