import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, Calendar, Users, Award, TrendingUp, GraduationCap, X, Filter, RefreshCcw } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { StatusBadge, RoleBadge } from '../ui/Badges';

const API_BASE_URL = 'http://localhost:3000';

const MembershipReports = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedRole, setSelectedRole] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [numberOfSemesters, setNumberOfSemesters] = useState('4');
  const [asOfDate, setAsOfDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [error, setError] = useState(null);

  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  useEffect(() => {
    fetchOrganizations();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedOrganization) {
      fetchOrganizationRoles();
    }
  }, [selectedOrganization]);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/organization`);
      setOrganizations(response.data);
    } catch (error) {
      setError('Failed to fetch organizations');
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/membership/roles`);
      setAvailableRoles(response.data.map(item => ({ value: item.role, label: item.role })));
    } catch (error) {
      setError('Failed to fetch roles');
      console.error('Error fetching roles:', error);
    }
  };

  const fetchOrganizationRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/membership/roles?organization_id=${selectedOrganization}`);
      const roles = response.data.map(item => ({ value: item.role, label: item.role }));
      setAvailableRoles(roles);
    } catch (error) {
      setError('Failed to fetch organization roles');
      console.error('Error fetching organization roles:', error);
    }
  };

  const refreshData = () => {
    setOrganizations([]);
    setAvailableRoles([]);
    fetchOrganizations();
    fetchRoles();
  };

  const showReport = (data, title, type) => {
    setReportData(data);
    setModalTitle(title);
    setReportType(type);
    setShowModal(true);
  };

  const generateAllMembersReport = async () => {
    if (!selectedOrganization) {
      setError('Please select an organization');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/membership/organization/${selectedOrganization}`);
      const orgName = organizations.find(org => org.organization_id.toString() === selectedOrganization)?.organization_name;
      showReport(response.data, `All Members - ${orgName}`, 'all-members');
    } catch (error) {
      setError('Error generating all members report');
      console.error('Error fetching all members:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateExecutiveReport = async () => {
    if (!selectedOrganization || !selectedYear) {
      setError('Please select organization and year');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/membership/executive?organization_id=${selectedOrganization}&year=${selectedYear}`
      );
      const orgName = organizations.find(org => org.organization_id.toString() === selectedOrganization)?.organization_name;
      showReport(response.data, `Executive Committee Members ${selectedYear} - ${orgName}`, 'executive');
    } catch (error) {
      setError('Error generating executive committee report');
      console.error('Error fetching executive members:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRoleHistoryReport = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/membership/role/${selectedRole}`);
      showReport(response.data, `${selectedRole} History (All Organizations)`, 'role-history');
    } catch (error) {
      setError('Error generating role history report');
      console.error('Error fetching role history:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStatusPercentageReport = async () => {
    if (!selectedOrganization) {
      setError('Please select an organization');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const yearsBack = Math.floor(parseInt(numberOfSemesters) / 2);
      const response = await axios.get(
        `${API_BASE_URL}/membership/status-percentage?organization_id=${selectedOrganization}&years_back=${yearsBack}`
      );
      const orgName = organizations.find(org => org.organization_id.toString() === selectedOrganization)?.organization_name;
      showReport(response.data, `Membership Status Distribution - ${orgName}`, 'status-percentage');
    } catch (error) {
      setError('Error generating status distribution report');
      console.error('Error fetching status percentage:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAlumniReport = async () => {
    if (!selectedOrganization) {
      setError('Please select an organization');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/membership/alumni?organization_id=${selectedOrganization}`;
      if (asOfDate) {
        url += `&as_of_date=${asOfDate}`;
      }
      const response = await axios.get(url);
      const orgName = organizations.find(org => org.organization_id.toString() === selectedOrganization)?.organization_name;
      const dateStr = asOfDate ? ` as of ${new Date(asOfDate).toLocaleDateString()}` : '';
      showReport(response.data, `Alumni Members${dateStr} - ${orgName}`, 'alumni');
    } catch (error) {
      setError('Error generating alumni report');
      console.error('Error fetching alumni members:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers
          .map(header =>
            typeof row[header] === 'string' && row[header].includes(',')
              ? `"${row[header]}"`
              : row[header] || ''
          )
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#4caf50'; 
      case 'Inactive':
        return '#ffca28';
      case 'Alumni':
        return '#158fd4'; 
      default:
        return '#01050b';
    }
  };

  const renderReportData = () => {
    if (!reportData || reportData.length === 0) {
      return <div className="text-center py-4 text-[#01050b]">No data found</div>;
    }

    switch (reportType) {
      case 'all-members':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#01050b] border-l-4 border-[#158fd4] pl-3">All Members Report</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Student</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Role</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Status</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Committee</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((member, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f9f9f9]'}>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">
                        <div className="font-medium">{member.student_number}</div>
                        <div className="text-sm">{member.full_name}</div>
                        <div className="text-xs">{member.gender} • {member.degree_program}</div>
                      </td>
                      <td className="border border-[#9daecc] px-4 py-2">
                        <RoleBadge role={member.role} className="text-[#01050b] bg-[#9daecc] rounded px-2 py-1 text-sm" />
                      </td>
                      <td className="border border-[#9daecc] px-4 py-2">
                        <StatusBadge
                          status={member.status}
                          className={`text-[#ffffff] bg-[${getStatusColor(member.status)}] rounded px-2 py-1 text-sm`}
                        />
                      </td>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">{member.committee_name || '-'}</td>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">
                        {member.membership_date ? new Date(member.membership_date).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'executive':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#01050b] border-l-4 border-[#4caf50] pl-3">Executive Committee Members</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Student</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Role</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Status</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Committee</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((member, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f9f9f9]'}>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">
                        <div className="font-medium">{member.student_number}</div>
                        <div className="text-sm">{member.full_name}</div>
                        <div className="text-xs">{member.gender} • {member.degree_program}</div>
                      </td>
                      <td className="border border-[#9daecc] px-4 py-2">
                        <RoleBadge role={member.role} className="text-[#01050b] bg-[#9daecc] rounded px-2 py-1 text-sm" />
                      </td>
                      <td className="border border-[#9daecc] px-4 py-2">
                        <StatusBadge
                          status={member.status}
                          className={`text-[#ffffff] bg-[${getStatusColor(member.status)}] rounded px-2 py-1 text-sm`}
                        />
                      </td>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">{member.committee_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'role-history':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#01050b] border-l-4 border-[#158fd4] pl-3">Role History Report</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Student</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Organization</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Year Joined</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((member, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f9f9f9]'}>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">
                        <div className="font-medium">{member.student_number}</div>
                        <div className="text-sm">{member.full_name}</div>
                        <div className="text-xs">{member.gender} • {member.degree_program}</div>
                      </td>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">{member.organization_name}</td>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">{member.year_joined}</td>
                      <td className="border border-[#9daecc] px-4 py-2">
                        <StatusBadge
                          status={member.status}
                          className={`text-[#ffffff] bg-[${getStatusColor(member.status)}] rounded px-2 py-1 text-sm`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'status-percentage':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#01050b] border-l-4 border-[#ffca28] pl-3">Membership Status Distribution</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportData.map((item, index) => (
                <div key={index} className="bg-[#f5f5f5] p-4 rounded-lg shadow-md border-l-4 border-[#ffca28]">
                  <div className="flex items-center justify-between">
                    <StatusBadge
                      status={item.status}
                      className={`text-[#ffffff] bg-[${getStatusColor(item.status)}] rounded px-2 py-1 text-sm`}
                    />
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#158fd4]">{item.percentage}%</div>
                      <div className="text-sm text-[#01050b] mt-1">{item.count} members</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'alumni':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#01050b] border-l-4 border-[#158fd4] pl-3">Alumni Members Report</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Student</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Organization</th>
                    <th className="border border-[#9daecc] px-4 py-2 text-left text-[#01050b] font-medium">Membership Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((member, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f9f9f9]'}>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">
                        <div className="font-medium">{member.student_number}</div>
                        <div className="text-sm">{member.full_name}</div>
                        <div className="text-xs">{member.gender} • {member.degree_program}</div>
                      </td>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">{member.organization_name}</td>
                      <td className="border border-[#9daecc] px-4 py-2 text-[#01050b]">
                        {member.membership_date ? new Date(member.membership_date).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div className="text-center py-4 text-[#01050b]">Unknown report type</div>;
    }
  };

  const organizationOptions = [
    { value: '', label: 'All Organizations' },
    ...organizations.map(org => ({
      value: org.organization_id.toString(),
      label: org.organization_name || org.organization_id,
    })),
  ];

  const roleOptions = [
    { value: '', label: 'Select Role' },
    ...availableRoles,
  ];

  const clearFilters = () => {
    setSelectedOrganization('');
    setSelectedYear(new Date().getFullYear().toString());
    setSelectedRole('');
    setNumberOfSemesters('4');
    setAsOfDate('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-row">
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-[#ffffff] shadow-md transform transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:w-72 p-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-lg font-semibold text-[#01050b]">Reports</h2>
          <button onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
            <X className="w-6 h-6 text-[#01050b]" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#81b4e4]">
            <div className="flex items-center mb-3">
              <Users className="w-6 h-6 text-[#81b4e4] mr-2" />
              <div>
                <h4 className="font-semibold text-[#01050b] text-sm">All Members Report</h4>
                <p className="text-xs text-[#01050b] mt-1">Requires organization</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={generateAllMembersReport}
              disabled={loading || !selectedOrganization}
              className="w-full text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] disabled:bg-[#9daecc] disabled:text-[#ffffff]"
            >
              {loading && reportType === 'all-members' ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          <div className="rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#95c097]">
            <div className="flex items-center mb-3">
              <Award className="w-6 h-6 text-[#95c097] mr-2" />
              <div>
                <h4 className="font-semibold text-[#01050b] text-sm">Executive Committee</h4>
                <p className="text-xs text-[#01050b] mt-1">Requires organization, year</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={generateExecutiveReport}
              disabled={loading || !selectedOrganization || !selectedYear}
              className="w-full text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] disabled:bg-[#9daecc] disabled:text-[#ffffff]"
            >
              {loading && reportType === 'executive' ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          <div className="rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#e08585]">
            <div className="flex items-center mb-3">
              <Calendar className="w-6 h-6 text-[#e08585] mr-2" />
              <div>
                <h4 className="font-semibold text-[#01050b] text-sm">Role History</h4>
                <p className="text-xs text-[#01050b] mt-1">Requires role selection</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={generateRoleHistoryReport}
              disabled={loading || !selectedRole}
              className="w-full text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] disabled:bg-[#9daecc] disabled:text-[#ffffff]"
            >
              {loading && reportType === 'role-history' ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          <div className="rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#ffee58]">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-6 h-6 text-[#ffee58] mr-2" />
              <div>
                <h4 className="font-semibold text-[#01050b] text-sm">Status Distribution</h4>
                <p className="text-xs text-[#01050b] mt-1">Requires organization</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={generateStatusPercentageReport}
              disabled={loading || !selectedOrganization}
              className="w-full text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] disabled:bg-[#9daecc] disabled:text-[#ffffff]"
            >
              {loading && reportType === 'status-percentage' ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          <div className="rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#ba68c8]">
            <div className="flex items-center mb-3">
              <GraduationCap className="w-6 h-6 text-[#ba68c8] mr-2" />
              <div>
                <h4 className="font-semibold text-[#01050b] text-sm">Alumni Members</h4>
                <p className="text-xs text-[#01050b] mt-1">Requires organization</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={generateAlumniReport}
              disabled={loading || !selectedOrganization}
              className="w-full text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] disabled:bg-[#9daecc] disabled:text-[#ffffff]"
            >
              {loading && reportType === 'alumni' ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 lg:pl-4">
        <div className="max-w-6xl mx-auto">
          <div className="lg:hidden mb-6 flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] px-4 py-2 rounded-lg"
              aria-label="Open reports sidebar"
            >
              <Filter className="w-5 h-5" />
              Reports
            </Button>
            <Button
              variant="secondary"
              onClick={refreshData}
              className="flex items-center gap-2 bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] px-4 py-2 rounded-lg"
              aria-label="Refresh data"
            >
              <RefreshCcw className="w-5 h-5" />
              Refresh
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#01050b] mb-2">Membership Reports Dashboard</h1>
            <p className="text-[#01050b] text-sm">Generate and export detailed membership reports for organizations</p>
          </div>

          <div className="bg-[#ffffff] rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#01050b] flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#01050b]" />
                Report Filters
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="text-[#01050b] text-sm hover:text-[#158fd4]"
                  aria-expanded={isFilterOpen}
                  aria-label={isFilterOpen ? 'Collapse filters' : 'Expand filters'}
                >
                  {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="text-[#01050b] text-sm hover:text-[#158fd4]"
                  aria-label="Toggle advanced filters"
                >
                  {showAdvancedFilters ? 'Basic Filters' : 'Advanced Filters'}
                </button>
              </div>
            </div>
            {isFilterOpen && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Select
                    label="Organization"
                    value={selectedOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    options={organizationOptions}
                    aria-label="Select organization"
                    className="w-full text-[#01050b] focus:ring-[#158fd4] focus:border-[#158fd4] bg-[#ffffff]"
                  />
                  <Select
                    label="Year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    options={yearOptions}
                    aria-label="Select year"
                    className="w-full text-[#01050b] focus:ring-[#158fd4] focus:border-[#158fd4] bg-[#ffffff]"
                  />
                  <Select
                    label="Role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    options={roleOptions}
                    aria-label="Select role"
                    className="w-full text-[#01050b] focus:ring-[#158fd4] focus:border-[#158fd4] bg-[#ffffff]"
                  />
                  {showAdvancedFilters && (
                    <>
                      <Input
                        label="Number of Semesters"
                        type="number"
                        value={numberOfSemesters}
                        onChange={(e) => setNumberOfSemesters(e.target.value)}
                        aria-label="Enter number of semesters"
                        className="w-full text-[#01050b] focus:ring-[#158fd4] focus:border-[#158fd4] bg-[#ffffff]"
                      />
                      <Input
                        label="As of Date"
                        type="date"
                        value={asOfDate}
                        onChange={(e) => setAsOfDate(e.target.value)}
                        aria-label="Select as of date"
                        className="w-full text-[#01050b] focus:ring-[#158fd4] focus:border-[#158fd4] bg-[#ffffff]"
                      />
                    </>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] px-4 py-2 rounded-lg"
                    aria-label="Clear all filters"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-[#f5f5f5] text-[#01050b] p-4 rounded-lg mb-8 flex items-center gap-2" role="alert">
              <X className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalTitle}
            className="rounded-lg bg-[#ffffff] text-[#01050b]"
          >
            <div className="max-h-[70vh] overflow-y-auto p-4">
              {renderReportData()}
            </div>
            {reportData && reportData.length > 0 && (
              <div className="sticky bottom-0 bg-[#ffffff] p-4 flex justify-end rounded-b-lg">
                <Button
                  variant="primary"
                  onClick={() => exportToCSV(reportData, `${modalTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`)}
                  className="flex items-center gap-2 bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] px-4 py-2 rounded-lg"
                  aria-label="Export report to CSV"
                >
                  <Download size={16} />
                  Export to CSV
                </Button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default MembershipReports;