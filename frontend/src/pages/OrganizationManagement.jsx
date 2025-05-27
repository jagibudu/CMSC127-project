import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

const Button = ({ variant = 'primary', size = 'md', onClick, children, className = '', disabled = false }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, placeholder, value, onChange, type = 'text', required = false, disabled = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      required={required}
    />
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const Alert = ({ type = 'info', message, onClose }) => {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`border rounded-md p-4 mb-4 ${colors[type]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle size={16} className="mr-2" />
          <span className="text-sm font-medium">{message}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    organization_id: '',
    organization_name: ''
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/organization`);
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      const data = await response.json();
      setOrganizations(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      showAlert('error', 'Error fetching organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.organization_id.trim()) {
      showAlert('warning', 'Organization ID is required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 409) {
          showAlert('error', 'Organization already exists');
          return;
        }
        throw new Error('Failed to create organization');
      }

      const newOrganization = await response.json();
      setOrganizations([...organizations, newOrganization]);
      resetForm();
      setShowModal(false);
      showAlert('success', 'Organization created successfully');
    } catch (error) {
      console.error('Error creating organization:', error);
      showAlert('error', 'Error creating organization');
    }
  };

  const handleUpdate = async () => {
    if (!formData.organization_id.trim()) {
      showAlert('warning', 'Organization ID is required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/organization`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          showAlert('error', 'Organization does not exist');
          return;
        }
        throw new Error('Failed to update organization');
      }

      const updatedOrganization = await response.json();
      setOrganizations(organizations.map(org => 
        org.organization_id === formData.organization_id ? updatedOrganization : org
      ));
      resetForm();
      setShowModal(false);
      showAlert('success', 'Organization updated successfully');
    } catch (error) {
      console.error('Error updating organization:', error);
      showAlert('error', 'Error updating organization');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/organization?organization_id=${encodeURIComponent(selectedOrganization.organization_id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          showAlert('error', 'Organization does not exist');
          return;
        }
        throw new Error('Failed to delete organization');
      }

      setOrganizations(organizations.filter(org => 
        org.organization_id !== selectedOrganization.organization_id
      ));
      setShowModal(false);
      setSelectedOrganization(null);
      showAlert('success', 'Organization deleted successfully');
    } catch (error) {
      console.error('Error deleting organization:', error);
      showAlert('error', 'Error deleting organization');
    }
  };

  const resetForm = () => {
    setFormData({
      organization_id: '',
      organization_name: ''
    });
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (organization) => {
    setFormData({ ...organization });
    setSelectedOrganization(organization);
    setModalMode('edit');
    setShowModal(true);
  };

  const openDeleteModal = (organization) => {
    setSelectedOrganization(organization);
    setModalMode('delete');
    setShowModal(true);
  };

  const filteredOrganizations = organizations.filter(org => {
    const orgId = String(org.organization_id || '').toLowerCase();
    const orgName = String(org.organization_name || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return orgId.includes(search) || orgName.includes(search);
  });

  return (
    <div className="space-y-6">
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Organization Management</h2>
            <Button onClick={openCreateModal} className="flex items-center gap-2">
              <Plus size={16} />
              Add Organization
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading organizations...</p>
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {organizations.length === 0 ? 'No organizations found' : 'No organizations match your search'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Organization ID</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Organization Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrganizations.map((organization) => (
                    <tr key={organization.organization_id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-mono text-sm">{organization.organization_id}</td>
                      <td className="border border-gray-300 px-4 py-3">{organization.organization_name || '-'}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => openEditModal(organization)}
                            className="flex items-center gap-1"
                          >
                            <Edit size={14} />
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => openDeleteModal(organization)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'create' ? 'Add New Organization' :
          modalMode === 'edit' ? 'Edit Organization' :
          'Delete Organization'
        }
      >
        {modalMode === 'delete' ? (
          <div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete organization <strong>{selectedOrganization?.organization_id}</strong>?
              {selectedOrganization?.organization_name && (
                <span> ({selectedOrganization.organization_name})</span>
              )}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Organization
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Input
              label="Organization ID"
              placeholder="Ex: ORG001"
              value={formData.organization_id}
              onChange={(e) => setFormData({...formData, organization_id: e.target.value})}
              disabled={modalMode === 'edit'}
              required
            />
            <Input
              label="Organization Name"
              placeholder="Ex: Computer Science Society"
              value={formData.organization_name}
              onChange={(e) => setFormData({...formData, organization_name: e.target.value})}
            />
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                variant={modalMode === 'create' ? 'success' : 'warning'}
                onClick={modalMode === 'create' ? handleCreate : handleUpdate}
              >
                {modalMode === 'create' ? 'Create Organization' : 'Update Organization'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrganizationManagement;