import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, User, Building, DollarSign, X, Filter, RefreshCcw } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';

const FeeReports = () => {
  const [organizations, setOrganizations] = useState([]);
  const [students, setStudents] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [filters, setFilters] = useState({
    organization_id: '',
    student_number: '',
    year: new Date().getFullYear(),
    semester: 'First',
    as_of_date: '',
    limit: 10,
  });

  const API_BASE = 'http://localhost:3000';

  useEffect(() => {
    fetchOrganizations();
    fetchStudents();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${API_BASE}/organization`);
      const data = await response.json();
      setOrganizations(data);
    } catch (error) {
      setError('Failed to fetch organizations');
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/students`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', error);
    }
  };

  const refreshData = () => {
    setOrganizations([]);
    setStudents([]);
    fetchOrganizations();
    fetchStudents();
  };

  const generateReport = async (reportType) => {
    setLoading(true);
    setActiveReport(reportType);
    setError(null);

    try {
      let url = '';
      let params = new URLSearchParams();

      switch (reportType) {
        case 'unpaid-by-org-semester':
          if (!filters.organization_id || !filters.year || !filters.semester) {
            setError('Please select organization, year, and semester');
            return;
          }
          url = `${API_BASE}/fee/unpaid/organization-semester`;
          params.append('organization_id', filters.organization_id);
          params.append('year', filters.year);
          params.append('semester', filters.semester);
          break;

        case 'unpaid-by-student':
          if (!filters.student_number) {
            setError('Please select a student');
            return;
          }
          url = `${API_BASE}/fee/unpaid/student/${filters.student_number}`;
          break;

        case 'late-fees':
          if (!filters.organization_id || !filters.year) {
            setError('Please select organization and year');
            return;
          }
          url = `${API_BASE}/fee/late`;
          params.append('organization_id', filters.organization_id);
          params.append('year', filters.year);
          break;

        case 'total-fees':
          if (!filters.organization_id || !filters.as_of_date) {
            setError('Please select organization and as of date');
            return;
          }
          url = `${API_BASE}/fee/totals`;
          params.append('organization_id', filters.organization_id);
          params.append('as_of_date', filters.as_of_date);
          break;

        case 'highest-debtors':
          if (!filters.organization_id || !filters.year || !filters.semester) {
            setError('Please select organization, year, and semester');
            return;
          }
          url = `${API_BASE}/fee/debtors`;
          params.append('organization_id', filters.organization_id);
          params.append('year', filters.year);
          params.append('semester', filters.semester);
          if (filters.limit) params.append('limit', filters.limit);
          break;

        default:
          throw new Error('Invalid report type');
      }

      const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
      const response = await fetch(fullUrl);

      if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);

      const data = await response.json();
      setReportData(data);
      setShowModal(true);
    } catch (error) {
      setError(`Error generating report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data) return;

    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) return;

    const headers = Object.keys(dataArray[0]);
    const csvContent = [
      headers.join(','),
      ...dataArray.map(row =>
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

  const renderReportContent = () => {
    if (!reportData) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case 'Unpaid':
          return '#1976d2';
        case 'Late':
          return '#ffca28';
        case 'Paid':
          return '#4caf50';
        default:
          return '#212121';
      }
    };

    switch (activeReport) {
      case 'unpaid-by-org-semester':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#212121] border-l-4 border-[#1976d2] pl-3">Unpaid Fees by Organization & Semester</h4>
            {Array.isArray(reportData) && reportData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f5f5f5]">
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Fee ID</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Student</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Organization</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Amount</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Date Issued</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Due Date</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((fee, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f9f9f9]'}>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">{fee.fee_id}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">
                          {fee.first_name} {fee.last_name} ({fee.student_number})
                        </td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">{fee.organization_name}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">${parseFloat(fee.amount).toFixed(2)}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">
                          {fee.date_issue ? new Date(fee.date_issue).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">
                          {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#1976d2] font-semibold">Unpaid</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-[#1976d2]">No unpaid fees found for the selected filters.</div>
            )}
          </div>
        );

      case 'unpaid-by-student':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#212121] border-l-4 border-[#1976d2] pl-3">Student's Unpaid Fees</h4>
            {Array.isArray(reportData) && reportData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f5f5f5]">
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Fee ID</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Organization</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Label</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Amount</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Date Issued</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Due Date</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((fee, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f9f9f9]'}>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">{fee.fee_id}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">{fee.organization_name}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">{fee.label || 'N/A'}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">${parseFloat(fee.amount).toFixed(2)}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">
                          {fee.date_issue ? new Date(fee.date_issue).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">
                          {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#1976d2] font-semibold">Unpaid</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-[#1976d2]">No unpaid fees found for this student.</div>
            )}
          </div>
        );

      case 'late-fees':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#212121] border-l-4 border-[#ffca28] pl-3">Late Payment Fees</h4>
            {Array.isArray(reportData) && reportData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f5f5f5]">
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Fee ID</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Student</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Organization</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Amount</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Due Date</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Days Overdue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((fee, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f9f9f9]'}>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">{fee.fee_id}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">
                          {fee.first_name} {fee.last_name} ({fee.student_number})
                        </td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">{fee.organization_name}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">${parseFloat(fee.amount).toFixed(2)}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">
                          {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#ffca28] font-semibold">
                          {fee.days_overdue} days
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-[#ffca28]">No late fees found for the selected filters.</div>
            )}
          </div>
        );

      case 'total-fees':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#212121] border-l-4 border-[#4caf50] pl-3">Total Fees Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#f5f5f5] p-4 rounded-lg shadow-md border-l-4 border-[#4caf50]">
                <div className="text-xl font-bold text-[#1976d2]">{reportData.total_fees || 0}</div>
                <div className="text-sm text-[#616161] mt-1">Total Fees</div>
              </div>
              <div className="bg-[#f5f5f5] p-4 rounded-lg shadow-md border-l-4 border-[#4caf50]">
                <div className="text-xl font-bold text-[#1976d2]">${parseFloat(reportData.total_amount || 0).toFixed(2)}</div>
                <div className="text-sm text-[#616161] mt-1">Total Amount</div>
              </div>
              <div className="bg-[#f5f5f5] p-4 rounded-lg shadow-md border-l-4 border-[#4caf50]">
                <div className="text-xl font-bold text-[#4caf50]">${parseFloat(reportData.paid_amount || 0).toFixed(2)}</div>
                <div className="text-sm text-[#616161] mt-1">Paid Amount ({reportData.paid_count || 0} fees)</div>
              </div>
              <div className="bg-[#f5f5f5] p-4 rounded-lg shadow-md border-l-4 border-[#4caf50]">
                <div className="text-xl font-bold text-[#1976d2]">${parseFloat(reportData.unpaid_amount || 0).toFixed(2)}</div>
                <div className="text-sm text-[#616161] mt-1">Unpaid Amount ({reportData.unpaid_count || 0} fees)</div>
              </div>
            </div>
          </div>
        );

      case 'highest-debtors':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#212121] border-l-4 border-[#ffca28] pl-3">Highest Debtors by Organization and Semester</h4>
            {Array.isArray(reportData) && reportData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f5f5f5]">
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Rank</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Student</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Student Number</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Organization</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Total Debt</th>
                      <th className="border border-[#b0bec5] px-4 py-2 text-left text-[#212121] font-medium">Number of Fees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((debtor, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f9f9f9]'}>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121] font-semibold">#{index + 1}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">
                          {debtor.first_name} {debtor.last_name}
                        </td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">{debtor.student_number}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">{debtor.organization_name}</td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#ffca28] font-semibold">
                          ${parseFloat(debtor.total_debt).toFixed(2)}
                        </td>
                        <td className="border border-[#b0bec5] px-4 py-2 text-[#212121]">{debtor.fee_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-[#ffca28]">No debtors found for the selected organization and semester.</div>
            )}
          </div>
        );

      default:
        return <div className="text-center py-4 text-[#616161]">No data available</div>;
    }
  };

  const organizationOptions = [
    { value: '', label: 'All Organizations' },
    ...organizations.map(org => ({
      value: org.organization_id,
      label: org.organization_name || org.organization_id,
    })),
  ];

  const studentOptions = [
    { value: '', label: 'Select Student' },
    ...students.map(student => ({
      value: student.student_number,
      label: `${student.student_number} - ${student.first_name} ${student.last_name}`,
    })),
  ];

  const semesterOptions = [
    { value: 'First', label: 'First Semester' },
    { value: 'Second', label: 'Second Semester' },
  ];

  const clearFilters = () => {
    setFilters({
      organization_id: '',
      student_number: '',
      year: new Date().getFullYear(),
      semester: 'First',
      as_of_date: '',
      limit: 10,
    });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-row">
      {/* reports in d sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-[#ffffff] shadow-md transform transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:w-72 p-6 border-r border-[#e0e0e0] overflow-y-auto rounded-r-lg`}
      >
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-lg font-semibold text-[#212121]">Reports</h2>
          <button onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
            <X className="w-6 h-6 text-[#616161]" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#81b4e4]">
            <div className="flex items-center mb-3">
              <Building className="w-6 h-6 text-[#1976d2] mr-2" />
              <div>
                <h4 className="font-semibold text-[#212121] text-sm">Unpaid Fees by Organization</h4>
                <p className="text-xs text-[#424242] mt-1">Requires organization, year, semester</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => generateReport('unpaid-by-org-semester')}
              disabled={loading || !filters.organization_id || !filters.year || !filters.semester}
              className="w-full text-sm bg-[#b0bec5] hover:bg-[#1976d2] text-[#ffffff] disabled:bg-[#e0e0e0] disabled:text-[#616161]"
            >
              {loading && activeReport === 'unpaid-by-org-semester' ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          <div className="rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#95c097]">
            <div className="flex items-center mb-3">
              <User className="w-6 h-6 text-[#616161] mr-2" />
              <div>
                <h4 className="font-semibold text-[#212121] text-sm">Student's Unpaid Fees</h4>
                <p className="text-xs text-[#424242] mt-1">Requires student selection</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => generateReport('unpaid-by-student')}
              disabled={loading || !filters.student_number}
              className="w-full text-sm bg-[#b0bec5] hover:bg-[#2e7d32] text-[#ffffff] disabled:bg-[#e0e0e0] disabled:text-[#616161]"
            >
              {loading && activeReport === 'unpaid-by-student' ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          <div className="rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#e08585]">
            <div className="flex items-center mb-3">
              <Calendar className="w-6 h-6 text-[#c62828] mr-2" />
              <div>
                <h4 className="font-semibold text-[#212121] text-sm">Late Payment Fees</h4>
                <p className="text-xs text-[#424242] mt-1">Requires organization, year</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => generateReport('late-fees')}
              disabled={loading || !filters.organization_id || !filters.year}
              className="w-full text-sm bg-[#b0bec5] hover:bg-[#c62828] text-[#ffffff] disabled:bg-[#e0e0e0] disabled:text-[#616161]"
            >
              {loading && activeReport === 'late-fees' ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          <div className="rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#ffee58]">
            <div className="flex items-center mb-3">
              <DollarSign className="w-6 h-6 text-[#fbc02d] mr-2" />
              <div>
                <h4 className="font-semibold text-[#212121] text-sm">Total Fees Summary</h4>
                <p className="text-xs text-[#424242] mt-1">Requires organization, date</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => generateReport('total-fees')}
              disabled={loading || !filters.organization_id || !filters.as_of_date}
              className="w-full text-sm bg-[#b0bec5] hover:bg-[#fbc02d] hover:text-[#212121] text-[#ffffff] disabled:bg-[#e0e0e0] disabled:text-[#616161]"
            >
              {loading && activeReport === 'total-fees' ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          <div className="rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#ba68c8]">
            <div className="flex items-center mb-3">
              <FileText className="w-6 h-6 text-[#7b1fa2] mr-2" />
              <div>
                <h4 className="font-semibold text-[#212121] text-sm">Highest Debtors</h4>
                <p className="text-xs text-[#424242] mt-1">Requires organization, year, semester</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => generateReport('highest-debtors')}
              disabled={loading || !filters.organization_id || !filters.year || !filters.semester}
              className="w-full text-sm bg-[#b0bec5] hover:bg-[#7b1fa2] text-[#ffffff] disabled:bg-[#e0e0e0] disabled:text-[#616161]"
            >
              {loading && activeReport === 'highest-debtors' ? 'Generating...' : 'Generate Report'}
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
              className="flex items-center gap-2 bg-[#b0bec5] hover:bg-[#1976d2] text-[#ffffff] px-4 py-2 rounded-lg"
              aria-label="Open reports sidebar"
            >
              <Filter className="w-5 h-5" />
              Reports
            </Button>
            <Button
              variant="secondary"
              onClick={refreshData}
              className="flex items-center gap-2 bg-[#b0bec5] hover:bg-[#1976d2] text-[#ffffff] px-4 py-2 rounded-lg"
              aria-label="Refresh data"
            >
              <RefreshCcw className="w-5 h-5" />
              Refresh
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#212121] mb-2">Fee Reports Dashboard</h1>
            <p className="text-[#616161] text-sm">Generate and export detailed financial reports for organizations and students</p>
          </div>

          <div className="bg-[#ffffff] rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#212121] flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#616161]" />
                Report Filters
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="text-[#616161] text-sm hover:text-[#1976d2]"
                  aria-expanded={isFilterOpen}
                  aria-label={isFilterOpen ? 'Collapse filters' : 'Expand filters'}
                >
                  {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="text-[#616161] text-sm hover:text-[#1976d2]"
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
                    value={filters.organization_id}
                    onChange={(e) => setFilters({ ...filters, organization_id: e.target.value })}
                    options={organizationOptions}
                    aria-label="Select organization"
                  />
                  <Select
                    label="Student"
                    value={filters.student_number}
                    onChange={(e) => setFilters({ ...filters, student_number: e.target.value })}
                    options={studentOptions}
                    aria-label="Select student"
                  />
                  <Input
                    label="Year"
                    type="number"
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    aria-label="Enter year"
                  />
                  <Select
                    label="Semester"
                    value={filters.semester}
                    onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                    options={semesterOptions}
                    aria-label="Select semester"
                  />
                  {showAdvancedFilters && (
                    <>
                      <Input
                        label="As of Date"
                        type="date"
                        value={filters.as_of_date}
                        onChange={(e) => setFilters({ ...filters, as_of_date: e.target.value })}
                        aria-label="Select as of date"
                      />
                      <Input
                        label="Limit (for top debtors)"
                        type="number"
                        value={filters.limit}
                        onChange={(e) => setFilters({ ...filters, limit: e.target.value })}
                        min="1"
                        max="100"
                        aria-label="Enter limit for top debtors"
                      />
                    </>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm bg-[#b0bec5] hover:bg-[#1976d2] text-[#ffffff] px-4 py-2 rounded-lg disabled:bg-[#e0e0e0] disabled:text-[#616161]"
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
            <div className="bg-[#f5f5f5] border border-[#616161] text-[#616161] p-4 rounded-lg mb-8 flex items-center gap-2" role="alert">
              <X className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Report Results"
            className="rounded-lg"
          >
            <div className="max-h-[70vh] overflow-y-auto p-4">
              {renderReportContent()}
            </div>
            {reportData && (
              <div className="sticky bottom-0 bg-[#ffffff] border-t border-[#b0bec5] p-4 flex justify-end rounded-b-lg">
                <Button
                  variant="primary"
                  onClick={() => exportToCSV(reportData, `fee-report-${activeReport}-${Date.now()}`)}
                  className="flex items-center gap-2 bg-[#b0bec5] hover:bg-[#1976d2] text-[#ffffff] px-4 py-2 rounded-lg disabled:bg-[#e0e0e0] disabled:text-[#616161]"
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

export default FeeReports;