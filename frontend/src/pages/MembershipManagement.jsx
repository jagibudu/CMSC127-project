import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText } from 'lucide-react';
import MembershipHeader from '../components/membership/MembershipHeader';
import MembershipFilters from '../components/membership/MembershipFilters';
import MembershipTable from '../components/membership/MembershipTable';
import MembershipModal from '../components/membership/MembershipModal';
import MembershipReports from '../components/membership/MembershipReports';

const API_BASE_URL = 'http://localhost:3000';

const MembershipPage = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('members');

  // State management
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
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [customRole, setCustomRole] = useState('');
  
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

  // Options constants
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

  // Tab configuration
  const tabs = [
    { id: 'members', label: 'Members', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  // Effects
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
      setOrganizationRoles(roleOptions);
    }
  }, [formData.organization_id]);

  useEffect(() => {
    fetchFilterRoles(filters.organization_id);
  }, [filters.organization_id]);

  // API Functions
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
      setFilterRoles(roleOptions);
    }
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!formData.student_number || !formData.organization_id) {
      alert('Student Number and Organization are required');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/membership`, formData);
      await fetchMemberships();
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
      await axios.put(`${API_BASE_URL}/membership`, formData);
      await fetchMemberships();
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

  // Helper Functions
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
    setOrganizationRoles(roleOptions);
    setShowCustomRole(false);
    setCustomRole('');
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

  const handleModalSubmit = (mode) => {
    if (mode === 'create') {
      handleCreate();
    } else if (mode === 'edit') {
      handleUpdate();
    }
  };

  const clearFilters = () => {
    setFilters({
      organization_id: '',
      status: '',
      role: '',
      gender: '',
      degree_program: ''
    });
  };

  // Filtering Logic
  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = 
      membership.student_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.committee_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrg = !filters.organization_id || 
      membership.organization_id?.toString() === filters.organization_id;
    
    const matchesStatus = !filters.status || membership.status === filters.status;
    const matchesRole = !filters.role || membership.role === filters.role;
    const matchesGender = !filters.gender || membership.gender === filters.gender;
    const matchesDegree = !filters.degree_program || 
      membership.degree_program?.toLowerCase().includes(filters.degree_program.toLowerCase());

    return matchesSearch && matchesOrg && matchesStatus && matchesRole && matchesGender && matchesDegree;
  });

  // Calculate stats
  const totalCount = filteredMemberships.length;
  const activeCount = filteredMemberships.filter(m => m.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'members' && (
            <>
              <MembershipHeader
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                onAddMembership={openCreateModal}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                totalCount={totalCount}
                activeCount={activeCount}
              />

              <MembershipFilters
                showFilters={showFilters}
                filters={filters}
                setFilters={setFilters}
                organizations={organizations}
                statusOptions={statusOptions}
                filterRoles={filterRoles}
                onClearFilters={clearFilters}
              />

              <MembershipTable
                memberships={filteredMemberships}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                loading={loading}
              />
            </>
          )}

          {activeTab === 'reports' && (
            <MembershipReports />
          )}
        </div>
      </div>

      <MembershipModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalMode={modalMode}
        selectedMembership={selectedMembership}
        formData={formData}
        setFormData={setFormData}
        students={students}
        organizations={organizations}
        committees={committees}
        statusOptions={statusOptions}
        roleOptions={roleOptions}
        organizationRoles={organizationRoles}
        showCustomRole={showCustomRole}
        customRole={customRole}
        setCustomRole={setCustomRole}
        setShowCustomRole={setShowCustomRole}
        onSubmit={handleModalSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MembershipPage;