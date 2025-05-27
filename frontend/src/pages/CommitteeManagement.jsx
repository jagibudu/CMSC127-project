import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Building2 } from 'lucide-react';

const CommitteeManagement = () => {
  const [committees, setCommittees] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [formData, setFormData] = useState({
    organization_id: '',
    committee_name: ''
  });

  // API Base URL - adjust this to match your backend
  const API_BASE = 'http://localhost:3000'; // Change this to your API URL

  // Fetch committees and organizations on component mount
  useEffect(() => {
    fetchCommittees();
    fetchOrganizations();
  }, []);

  const fetchCommittees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/organization-committee`);
      if (response.ok) {
        const data = await response.json();
        setCommittees(data);
      }
    } catch (error) {
      console.error('Error fetching committees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${API_BASE}/organization`);
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleSubmit = async () => {
    
    if (!formData.organization_id) {
      alert('Please select an organization');
      return;
    }

    try {
      const url = editingCommittee 
        ? `${API_BASE}/organization-committee`
        : `${API_BASE}/organization-committee`;
      
      const method = editingCommittee ? 'PUT' : 'POST';
      const payload = editingCommittee 
        ? { committee_id: editingCommittee.committee_id, ...formData }
        : formData;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchCommittees();
        resetForm();
        setShowForm(false);
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error saving committee:', error);
      alert('Error saving committee');
    }
  };

  const handleEdit = (committee) => {
    setEditingCommittee(committee);
    setFormData({
      organization_id: committee.organization_id,
      committee_name: committee.committee_name || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (committee) => {
    if (window.confirm(`Are you sure you want to delete the committee "${committee.committee_name}"?`)) {
      try {
        const response = await fetch(`${API_BASE}/organization-committee?committee_id=${committee.committee_id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchCommittees();
        } else {
          const error = await response.text();
          alert(`Error: ${error}`);
        }
      } catch (error) {
        console.error('Error deleting committee:', error);
        alert('Error deleting committee');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      organization_id: '',
      committee_name: ''
    });
    setEditingCommittee(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  // Get organization name by ID
  const getOrganizationName = (orgId) => {
    const org = organizations.find(o => o.organization_id === orgId);
    return org ? org.organization_name : `Org ${orgId}`;
  };

  // Filter committees based on search and organization filter
  const filteredCommittees = committees.filter(committee => {
    const matchesSearch = committee.committee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getOrganizationName(committee.organization_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = selectedOrg === '' || committee.organization_id.toString() === selectedOrg;
    return matchesSearch && matchesOrg;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading committees...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Committee Management</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Committee
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-lg font-semibold mb-4">
            {editingCommittee ? 'Edit Committee' : 'Add New Committee'}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization *
                </label>
                <select
                  value={formData.organization_id}
                  onChange={(e) => setFormData({...formData, organization_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Organization</option>
                  {organizations.map((org) => (
                    <option key={org.organization_id} value={org.organization_id}>
                      {org.organization_name || `Organization ${org.organization_id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Committee Name
                </label>
                <input
                  type="text"
                  value={formData.committee_name}
                  onChange={(e) => setFormData({...formData, committee_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter committee name"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingCommittee ? 'Update Committee' : 'Add Committee'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search committees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Organizations</option>
              {organizations.map((org) => (
                <option key={org.organization_id} value={org.organization_id}>
                  {org.organization_name || `Organization ${org.organization_id}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Committees Table */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Committee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Committee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCommittees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No committees found
                  </td>
                </tr>
              ) : (
                filteredCommittees.map((committee) => (
                  <tr key={committee.committee_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {committee.committee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {committee.committee_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getOrganizationName(committee.organization_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(committee)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(committee)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="text-sm text-gray-600">
          Showing {filteredCommittees.length} of {committees.length} committees
        </div>
      </div>
    </div>
  );
};

export default CommitteeManagement;