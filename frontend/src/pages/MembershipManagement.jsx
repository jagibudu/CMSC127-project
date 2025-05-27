import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, BarChart3, TrendingUp } from 'lucide-react';
import MembershipHeader from '../components/membership/MembershipHeader';
import MembershipFilters from '../components/membership/MembershipFilters';
import MembershipTable from '../components/membership/MembershipTable';
import MembershipModal from '../components/membership/MembershipModal';
import MembershipReports from '../components/membership/MembershipReports';

const API_BASE_URL = 'http://localhost:3000';

const MembershipPage = () => {
  const [activeTab, setActiveTab] = useState('members');
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

  const tabs = [
    { id: 'members', label: 'Members', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
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
      setOrganizationRoles(roleOptions);
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

  const totalCount = filteredMemberships.length;
  const activeCount = filteredMemberships.filter(m => m.status === 'Active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#158fd4] to-[#01050b] text-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Membership Management</h1>
          <p className="text-blue-100">Manage student organization memberships and generate reports</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Members</p>
                  <p className="text-2xl font-bold">{totalCount}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active Members</p>
                  <p className="text-2xl font-bold">{activeCount}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-300" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Organizations</p>
                  <p className="text-2xl font-bold">{organizations.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-[#9daecc]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
          <nav className="flex space-x-1 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-white text-[#158fd4] shadow-sm border-t-2 border-[#158fd4]'
                      : 'text-gray-600 hover:text-[#158fd4] hover:bg-white/50'
                  } whitespace-nowrap py-4 px-6 font-medium text-sm flex items-center gap-2 rounded-t-xl transition-all duration-200`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-8">
          {activeTab === 'members' && (
            <div className="space-y-6">
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
            </div>
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