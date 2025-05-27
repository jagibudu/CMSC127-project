import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, Calendar, Users, Award, TrendingUp, GraduationCap } from 'lucide-react';
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

  // Generate year options (current year and past 10 years)
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
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/membership/roles`);
      setAvailableRoles(response.data.map(item => ({ value: item.role, label: item.role })));
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchOrganizationRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/membership/roles?organization_id=${selectedOrganization}`);
      const roles = response.data.map(item => ({ value: item.role, label: item.role }));
      setAvailableRoles(roles);
    } catch (error) {
      console.error('Error fetching organization roles:', error);
    }
  };

  const showReport = (data, title, type) => {
    setReportData(data);
    setModalTitle(title);
    setReportType(type);
    setShowModal(true);
  };

  // Report 1: View all members by role, status, gender, degree program, batch, committee
  const generateAllMembersReport = async () => {
    if (!selectedOrganization) {
      alert('Please select an organization');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/membership/organization/${selectedOrganization}`);
      const orgName = organizations.find(org => org.organization_id.toString() === selectedOrganization)?.organization_name;
      showReport(response.data, `All Members - ${orgName}`, 'all-members');
    } catch (error) {
      console.error('Error fetching all members:', error);
      alert('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  // Report 4: Executive committee members for a given year
  const generateExecutiveReport = async () => {
    if (!selectedOrganization || !selectedYear) {
      alert('Please select organization and year');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/membership/executive?organization_id=${selectedOrganization}&year=${selectedYear}`
      );
      const orgName = organizations.find(org => org.organization_id.toString() === selectedOrganization)?.organization_name;
      showReport(response.data, `Executive Committee Members ${selectedYear} - ${orgName}`, 'executive');
    } catch (error) {
      console.error('Error fetching executive members:', error);
      alert('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  // Report 5: All Presidents (or other role) by year in reverse chronological order
  const generateRoleHistoryReport = async () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/membership/role/${selectedRole}`);
      showReport(response.data, `${selectedRole} History (All Organizations)`, 'role-history');
    } catch (error) {
      console.error('Error fetching role history:', error);
      alert('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  // Report 7: Percentage of active vs inactive members
  const generateStatusPercentageReport = async () => {
    if (!selectedOrganization) {
      alert('Please select an organization');
      return;
    }

    setLoading(true);
    try {
      const yearsBack = Math.floor(parseInt(numberOfSemesters) / 2); // Convert semesters to years
      const response = await axios.get(
        `${API_BASE_URL}/membership/status-percentage?organization_id=${selectedOrganization}&years_back=${yearsBack}`
      );
      const orgName = organizations.find(org => org.organization_id.toString() === selectedOrganization)?.organization_name;
      showReport(response.data, `Membership Status Distribution - ${orgName}`, 'status-percentage');
    } catch (error) {
      console.error('Error fetching status percentage:', error);
      alert('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  // Report 8: Alumni members as of a given date
  const generateAlumniReport = async () => {
    if (!selectedOrganization) {
      alert('Please select an organization');
      return;
    }

    setLoading(true);
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
      console.error('Error fetching alumni members:', error);
      alert('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderReportData = () => {
    if (!reportData || reportData.length === 0) {
      return <div className="text-center py-8 text-gray-500">No data found</div>;
    }

    switch (reportType) {
      case 'all-members':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Student</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Role</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Committee</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">
                      <div>
                        <div className="font-medium">{member.student_number}</div>
                        <div className="text-sm text-gray-600">{member.full_name}</div>
                        <div className="text-xs text-gray-500">{member.gender} • {member.degree_program}</div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{member.committee_name || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      {member.membership_date ? new Date(member.membership_date).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'executive':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Student</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Role</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Committee</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">
                      <div>
                        <div className="font-medium">{member.student_number}</div>
                        <div className="text-sm text-gray-600">{member.full_name}</div>
                        <div className="text-xs text-gray-500">{member.gender} • {member.degree_program}</div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{member.committee_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'role-history':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Student</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Organization</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Year Joined</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">
                      <div>
                        <div className="font-medium">{member.student_number}</div>
                        <div className="text-sm text-gray-600">{member.full_name}</div>
                        <div className="text-xs text-gray-500">{member.gender} • {member.degree_program}</div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{member.organization_name}</td>
                    <td className="border border-gray-300 px-3 py-2">{member.year_joined}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      <StatusBadge status={member.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'status-percentage':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportData.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={item.status} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{item.percentage}%</div>
                      <div className="text-sm text-gray-600">{item.count} members</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'alumni':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Student</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Organization</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Membership Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">
                      <div>
                        <div className="font-medium">{member.student_number}</div>
                        <div className="text-sm text-gray-600">{member.full_name}</div>
                        <div className="text-xs text-gray-500">{member.gender} • {member.degree_program}</div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{member.organization_name}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      {member.membership_date ? new Date(member.membership_date).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div>Unknown report type</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Membership Reports</h2>
              <p className="text-sm text-gray-600">Generate comprehensive membership reports</p>
            </div>
          </div>

          {/* Common Filters */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Common Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Organization"
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                options={organizations.map(org => ({
                  value: org.organization_id.toString(),
                  label: org.organization_name || org.organization_id
                }))}
              />
              <Select
                label="Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                options={yearOptions}
              />
              <Select
                label="Role (for role-specific reports)"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                options={availableRoles}
              />
            </div>
          </div>

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Report 1: All Members */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <Users className="text-blue-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">All Members Report</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View all members by role, status, gender, degree program, and committee
                  </p>
                  <Button 
                    size="sm" 
                    onClick={generateAllMembersReport}
                    disabled={loading || !selectedOrganization}
                    className="w-full"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Report 4: Executive Committee */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <Award className="text-purple-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">Executive Committee</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View executive committee members for a specific year
                  </p>
                  <Button 
                    size="sm" 
                    variant="success"
                    onClick={generateExecutiveReport}
                    disabled={loading || !selectedOrganization || !selectedYear}
                    className="w-full"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Report 5: Role History */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <Calendar className="text-green-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">Role History</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View all members with a specific role across all years
                  </p>
                  <Button 
                    size="sm" 
                    variant="warning"
                    onClick={generateRoleHistoryReport}
                    disabled={loading || !selectedRole}
                    className="w-full"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Report 7: Status Percentage with semester input */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <TrendingUp className="text-orange-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">Status Distribution</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    View percentage of active vs inactive members
                  </p>
                  <div className="mb-3">
                    <Input
                      label="Number of Semesters"
                      type="number"
                      value={numberOfSemesters}
                      onChange={(e) => setNumberOfSemesters(e.target.value)}
                      placeholder="4"
                    />
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={generateStatusPercentageReport}
                    disabled={loading || !selectedOrganization}
                    className="w-full"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Report 8: Alumni Members with date input */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <GraduationCap className="text-indigo-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">Alumni Members</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    View all alumni members as of a specific date
                  </p>
                  <div className="mb-3">
                    <Input
                      label="As of Date (optional)"
                      type="date"
                      value={asOfDate}
                      onChange={(e) => setAsOfDate(e.target.value)}
                    />
                  </div>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={generateAlumniReport}
                    disabled={loading || !selectedOrganization}
                    className="w-full"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total Records: {reportData.length}
            </p>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => exportToCSV(reportData, modalTitle.toLowerCase().replace(/\s+/g, '-'))}
              className="flex items-center gap-2"
            >
              <Download size={14} />
              Export CSV
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {renderReportData()}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MembershipReports;