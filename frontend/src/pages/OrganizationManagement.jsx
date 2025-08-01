import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Users, X, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

const Button = ({ variant = 'primary', size = 'md', onClick, children, className = '', disabled = false }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#158fd4] hover:bg-[#0e4a80] text-white focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    secondary: 'bg-[#9daecc] hover:bg-[#0e4a80] text-white focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500'
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
    <label className="block text-sm font-medium text-[#01050b] mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4] transition-all duration-200"
      required={required}
    />
  </div>
);

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className={`bg-[#ffffff] border-[#9daecc] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}>
        <div className="flex items-center justify-between p-6 border-b border-[#9daecc]">
          <h3 className="text-xl font-semibold text-[#01050b]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#01050b] hover:text-[#0e4a80] focus:outline-none transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 text-[#01050b]">
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
            <X size={16} />
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganizations = filteredOrganizations.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const totalCount = filteredOrganizations.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#158fd4] to-[#01050b] text-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Organization Management</h1>
          <p className="text-blue-100">Manage organization information and records</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Organizations</p>
                  <p className="text-2xl font-bold">{totalCount}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <Button onClick={openCreateModal} className="flex items-center gap-2">
              <Plus size={16} />
              Add Organization
            </Button>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4] transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-4 p-8">
          {alert && (
            <Alert 
              type={alert.type} 
              message={alert.message} 
              onClose={() => setAlert(null)} 
            />
          )}

          {loading ? (
            <div className="text-center py-8 text-[#616161] text-xs">
              Loading...
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="text-center py-8 text-[#616161] text-xs">
              No organizations found
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="w-full">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#158fd4] to-[#0e4a80] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Organization ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Organization Name
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {currentOrganizations.map((organization, index) => (
                        <tr
                          key={`${organization.organization_id}-${index}`}
                          className="odd:bg-[#ffffff] even:bg-[#f9f9f9] hover:bg-[#f5f5f5] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap border-r border-[#b0bec5]">
                            <div className="text-sm font-semibold text-[#212121]">
                              {organization.organization_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border-r border-[#b0bec5]">
                            <div className="text-sm text-[#212121]">
                              {organization.organization_name || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(organization)}
                                className="text-[#1976d2] hover:text-[#1565c0]"
                                aria-label={`Edit organization ${organization.organization_id}`}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => openDeleteModal(organization)}
                                className="text-[#c62828] hover:text-[#b71c1c]"
                                aria-label={`Delete organization ${organization.organization_id}`}
                              >
                                <Trash2 size={16} />
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
                    Showing {startIndex + 1} to {Math.min(endIndex, totalCount)} of {totalCount} results
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
            </>
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
        className="bg-[#ffffff] border-[#9daecc] text-[#01050b]"
      >
        {modalMode === 'delete' ? (
          <div>
            <p className="text-[#01050b] mb-6">
              Are you sure you want to delete organization <strong>{selectedOrganization?.organization_id}</strong>?
              {selectedOrganization?.organization_name && (
                <span> ({selectedOrganization.organization_name})</span>
              )}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] rounded"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-[#158fd4] hover:bg-[#0e4a80] text-[#ffffff] rounded"
              >
                Delete
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
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] rounded"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={modalMode === 'create' ? handleCreate : handleUpdate}
                className="px-3 py-1 text-sm bg-[#158fd4] hover:bg-[#0e4a80] text-[#ffffff] rounded"
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