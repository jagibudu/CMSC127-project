import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Users, UserCheck } from 'lucide-react';
import axios from 'axios';

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

const Input = ({ label, placeholder, value, onChange, type = 'text', required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      required={required}
    />
  </div>
);

const Select = ({ label, value, onChange, options, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      required={required}
    >
      <option value="">Select...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

const StatusBadge = ({ status }) => {
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

const RoleBadge = ({ role }) => {
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

const MembershipManagement = () => {
  const [memberships, setMemberships] = useState([]);
  const [students, setStudents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [organizationRoles, setOrganizationRoles] = useState([]);
  const [filterRoles, setFilterRoles] = useState([]);
  const [filters, setFilters] = useState({
    organization_id: '',
    status: '',
    role: '',
    gender: '',
    degree_program: ''
  });
  const [formData, setFormData] = useState({
    student_number: '',
    organization_id: '',
    committee_id: '',
    membership_date: '',
    status: 'Active',
    role: 'Member'
  });

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Alumni', label: 'Alumni' },
  { value: 'Expelled', label: 'Expelled' },
  { value: 'Suspended', label: 'Suspended' }
];

  const roleOptions = [
    { value: 'Member', label: 'Member' },
    { value: 'Officer', label: 'Officer' },
    { value: 'President', label: 'President' },
    { value: 'Vice President', label: 'Vice President' },
    { value: 'Secretary', label: 'Secretary' },
    { value: 'Treasurer', label: 'Treasurer' },
    { value: 'Committee Chair', label: 'Committee Chair' }
  ];

  useEffect(() => {
    fetchMemberships();
    fetchStudents();
    fetchOrganizations();
  }, []);

  useEffect(() => {
  if (formData.organization_id) {
    fetchCommittees(formData.organization_id);
    fetchOrganizationRoles(formData.organization_id);
  } else {
    setOrganizationRoles(roleOptions); // Reset to default when no org selected
  }
}, [formData.organization_id]);

useEffect(() => {
  fetchFilterRoles(filters.organization_id);
}, [filters.organization_id]);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/membership`);
      setMemberships(response.data);
    } catch (error) {
      console.error('Error fetching memberships:', error);
      alert('Error fetching memberships');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/organization`);
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchCommittees = async (organizationId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/organization-committee/${organizationId}`);
      setCommittees(response.data);
    } catch (error) {
      console.error('Error fetching committees:', error);
      setCommittees([]);
    }
  };

  const fetchOrganizationRoles = async (organizationId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/membership/roles?organization_id=${organizationId}`);
    const roles = response.data.map(item => ({ value: item.role, label: item.role }));
    setOrganizationRoles(roles);
  } catch (error) {
    console.error('Error fetching organization roles:', error);
    // Fallback to default roles if API fails
    setOrganizationRoles(roleOptions);
  }
};

const fetchFilterRoles = async (organizationId = null) => {
  try {
    const url = organizationId 
      ? `${API_BASE_URL}/membership/roles?organization_id=${organizationId}`
      : `${API_BASE_URL}/membership/roles`;
    const response = await axios.get(url);
    const roles = response.data.map(item => ({ value: item.role, label: item.role }));
    setFilterRoles(roles);
  } catch (error) {
    console.error('Error fetching filter roles:', error);
    // Fallback to default roles if API fails
    setFilterRoles(roleOptions);
  }
};

  const handleCreate = async () => {
    if (!formData.student_number || !formData.organization_id) {
      alert('Student Number and Organization are required');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/membership`, formData);
      await fetchMemberships(); // Refresh to get joined data
      resetForm();
      setShowModal(false);
      alert('Membership created successfully');
    } catch (error) {
      console.error('Error creating membership:', error);
      if (error.response?.status === 409) {
        alert('Membership already exists');
      } else {
        alert('Error creating membership');
      }
    }
  };

  const handleUpdate = async () => {
    if (!formData.student_number || !formData.organization_id) {
      alert('Student Number and Organization are required');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/membership`, formData);
      await fetchMemberships(); // Refresh to get joined data
      resetForm();
      setShowModal(false);
      alert('Membership updated successfully');
    } catch (error) {
      console.error('Error updating membership:', error);
      if (error.response?.status === 404) {
        alert('Membership does not exist');
      } else {
        alert('Error updating membership');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/membership`, {
        data: { 
          student_number: selectedMembership.student_number,
          organization_id: selectedMembership.organization_id
        }
      });
      setMemberships(memberships.filter(membership => 
        !(membership.student_number === selectedMembership.student_number && 
          membership.organization_id === selectedMembership.organization_id)
      ));
      setShowModal(false);
      setSelectedMembership(null);
      alert('Membership deleted successfully');
    } catch (error) {
      console.error('Error deleting membership:', error);
      if (error.response?.status === 404) {
        alert('Membership does not exist');
      } else {
        alert('Error deleting membership');
      }
    }
  };

const resetForm = () => {
  setFormData({
    student_number: '',
    organization_id: '',
    committee_id: '',
    membership_date: '',
    status: 'Active',
    role: 'Member'
  });
  setCommittees([]);
  setOrganizationRoles(roleOptions); // ADD THIS LINE
};

  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (membership) => {
    setFormData({
      student_number: membership.student_number,
      organization_id: membership.organization_id,
      committee_id: membership.committee_id || '',
      membership_date: membership.membership_date ? membership.membership_date.split('T')[0] : '',
      status: membership.status || 'Active',
      role: membership.role || 'Member'
    });
    setSelectedMembership(membership);
    setModalMode('edit');
    setShowModal(true);
  };

  const openDeleteModal = (membership) => {
    setSelectedMembership(membership);
    setModalMode('delete');
    setShowModal(true);
  };

const filteredMemberships = memberships.filter(membership => {
  const matchesSearch = 
    membership.student_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membership.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membership.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membership.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membership.committee_name?.toLowerCase().includes(searchTerm.toLowerCase());

  // FIX: Convert both values to strings for comparison
  const matchesOrg = !filters.organization_id || 
    membership.organization_id?.toString() === filters.organization_id;
  
  const matchesStatus = !filters.status || membership.status === filters.status;
  const matchesRole = !filters.role || membership.role === filters.role;
  
  // FIX: Gender should work fine now with exact matching since DB uses ENUM
  const matchesGender = !filters.gender || membership.gender === filters.gender;
  const matchesDegree = !filters.degree_program || 
    membership.degree_program?.toLowerCase().includes(filters.degree_program.toLowerCase());

  return matchesSearch && matchesOrg && matchesStatus && matchesRole && matchesGender && matchesDegree;
});

  const clearFilters = () => {
    setFilters({
      organization_id: '',
      status: '',
      role: '',
      gender: '',
      degree_program: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
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
              <Button onClick={openCreateModal} className="flex items-center gap-2">
                <Plus size={16} />
                Add Membership
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                  <select
                    value={filters.organization_id}
                    onChange={(e) => setFilters({...filters, organization_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        value={filters.role}
                        onChange={(e) => setFilters({...filters, role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                        <option value="">All Roles</option>
                        {filterRoles.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                        value={filters.gender}
                        onChange={(e) => setFilters({...filters, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                    </select>
                    </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree Program</label>
                  <input
                    type="text"
                    value={filters.degree_program}
                    onChange={(e) => setFilters({...filters, degree_program: e.target.value})}
                    placeholder="Enter program..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

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
              <span>Total: {filteredMemberships.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck size={16} />
              <span>Active: {filteredMemberships.filter(m => m.status === 'Active').length}</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredMemberships.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No memberships found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Student</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Organization</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Committee</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Date Joined</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMemberships.map((membership, index) => (
                    <tr key={`${membership.student_number}-${membership.organization_id}-${index}`} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <div>
                          <div className="font-medium">{membership.student_number}</div>
                          <div className="text-sm text-gray-600">
                            {membership.first_name} {membership.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {membership.gender} • {membership.degree_program}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div>
                          <div className="font-medium">{membership.organization_name}</div>
                          <div className="text-xs text-gray-500">{membership.organization_id}</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {membership.committee_name || '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <RoleBadge role={membership.role} />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <StatusBadge status={membership.status} />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {membership.membership_date ? new Date(membership.membership_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => openEditModal(membership)}
                            className="flex items-center gap-1"
                          >
                            <Edit size={14} />
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => openDeleteModal(membership)}
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
          modalMode === 'create' ? 'Add New Membership' :
          modalMode === 'edit' ? 'Edit Membership' :
          'Delete Membership'
        }
      >
        {modalMode === 'delete' ? (
          <div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the membership for student {selectedMembership?.student_number} 
              in {selectedMembership?.organization_name}?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Student"
                value={formData.student_number}
                onChange={(e) => setFormData({...formData, student_number: e.target.value})}
                options={students.map(student => ({
                  value: student.student_number,
                  label: `${student.student_number} - ${student.first_name} ${student.last_name}`
                }))}
                required
              />
              <Select
                label="Organization"
                value={formData.organization_id}
                onChange={(e) => setFormData({...formData, organization_id: e.target.value, committee_id: ''})}
                options={organizations.map(org => ({
                  value: org.organization_id,
                  label: org.organization_name || org.organization_id
                }))}
                required
              />
              <Select
                label="Committee"
                value={formData.committee_id}
                onChange={(e) => setFormData({...formData, committee_id: e.target.value})}
                options={committees.map(committee => ({
                  value: committee.committee_id,
                  label: committee.committee_name
                }))}
              />
              <Input
                label="Membership Date"
                type="date"
                value={formData.membership_date}
                onChange={(e) => setFormData({...formData, membership_date: e.target.value})}
              />
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                options={statusOptions}
              />
            <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            options={organizationRoles.length > 0 ? organizationRoles : roleOptions}
            />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                variant={modalMode === 'create' ? 'success' : 'warning'}
                onClick={modalMode === 'create' ? handleCreate : handleUpdate}
              >
                {modalMode === 'create' ? 'Create Membership' : 'Update Membership'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MembershipManagement;