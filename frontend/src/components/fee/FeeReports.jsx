import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, User, Building, DollarSign } from 'lucide-react';
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

  const [filters, setFilters] = useState({
    organization_id: '',
    student_number: '',
    year: new Date().getFullYear(),
    semester: 'First',
    as_of_date: '',
    limit: 10
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
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/students`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const generateReport = async (reportType) => {
    setLoading(true);
    setActiveReport(reportType);
    
    try {
      let url = '';
      let params = new URLSearchParams();

      switch (reportType) {
        case 'unpaid-by-org-semester':
          // This endpoint requires ALL three parameters
          if (!filters.organization_id || !filters.year || !filters.semester) {
            alert('Please select organization, year, and semester');
            setLoading(false);
            return;
          }
          url = `${API_BASE}/fee/unpaid/organization-semester`;
          params.append('organization_id', filters.organization_id);
          params.append('year', filters.year);
          params.append('semester', filters.semester);
          break;

        case 'unpaid-by-student':
          if (!filters.student_number) {
            alert('Please select a student');
            setLoading(false);
            return;
          }
          url = `${API_BASE}/fee/unpaid/student/${filters.student_number}`;
          break;

        case 'late-fees':
          // Now requires organization and year
          if (!filters.organization_id || !filters.year) {
            alert('Please select organization and year');
            setLoading(false);
            return;
          }
          url = `${API_BASE}/fee/late`;
          params.append('organization_id', filters.organization_id);
          params.append('year', filters.year);
          break;

        case 'total-fees':
          // Now requires organization and as_of_date
          if (!filters.organization_id || !filters.as_of_date) {
            alert('Please select organization and as of date');
            setLoading(false);
            return;
          }
          url = `${API_BASE}/fee/totals`;
          params.append('organization_id', filters.organization_id);
          params.append('as_of_date', filters.as_of_date);
          break;

        case 'highest-debtors':
          // This endpoint requires year and semester
          if (!filters.year || !filters.semester) {
            alert('Please select year and semester');
            setLoading(false);
            return;
          }
          url = `${API_BASE}/fee/debtors`;
          params.append('year', filters.year);
          params.append('semester', filters.semester);
          if (filters.limit) params.append('limit', filters.limit);
          break;

        default:
          throw new Error('Invalid report type');
      }

      const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
      console.log('Requesting URL:', fullUrl); // Debug log
      
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Report data received:', data); // Debug log
      
      setReportData(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error generating report:', error);
      alert(`Error generating report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data) return;
    
    // Handle single object (like totals) vs array
    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) return;
    
    const headers = Object.keys(dataArray[0]);
    const csvContent = [
      headers.join(','),
      ...dataArray.map(row => headers.map(header => 
        typeof row[header] === 'string' && row[header].includes(',') 
          ? `"${row[header]}"` 
          : row[header] || ''
      ).join(','))
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

    switch (activeReport) {
      case 'unpaid-by-org-semester':
        if (!Array.isArray(reportData) || reportData.length === 0) {
          return <div className="text-center py-4 text-gray-500">No unpaid fees found for the selected filters.</div>;
        }
        return (
          <div>
            <h4 className="font-semibold mb-3">Unpaid Fees by Organization & Semester</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Fee ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Student</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Organization</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Date Issued</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((fee, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{fee.fee_id}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {fee.first_name} {fee.last_name} ({fee.student_number})
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{fee.organization_name}</td>
                      <td className="border border-gray-300 px-4 py-2">${parseFloat(fee.amount).toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {fee.date_issue ? new Date(fee.date_issue).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'unpaid-by-student':
        if (!Array.isArray(reportData) || reportData.length === 0) {
          return <div className="text-center py-4 text-gray-500">No unpaid fees found for this student.</div>;
        }
        return (
          <div>
            <h4 className="font-semibold mb-3">Student's Unpaid Fees (Member's POV)</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Fee ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Organization</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Label</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Date Issued</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((fee, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{fee.fee_id}</td>
                      <td className="border border-gray-300 px-4 py-2">{fee.organization_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{fee.label || 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-2">${parseFloat(fee.amount).toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {fee.date_issue ? new Date(fee.date_issue).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'late-fees':
        if (!Array.isArray(reportData) || reportData.length === 0) {
          return <div className="text-center py-4 text-gray-500">No late fees found for the selected filters.</div>;
        }
        return (
          <div>
            <h4 className="font-semibold mb-3">Late Payment Fees</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Fee ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Student</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Organization</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Due Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Days Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((fee, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{fee.fee_id}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {fee.first_name} {fee.last_name} ({fee.student_number})
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{fee.organization_name}</td>
                      <td className="border border-gray-300 px-4 py-2">${parseFloat(fee.amount).toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-red-600 font-semibold">
                        {fee.days_overdue} days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'total-fees':
        // This returns a single object, not an array
        return (
          <div>
            <h4 className="font-semibold mb-3">Total Fees Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{reportData.total_fees || 0}</div>
                <div className="text-sm text-blue-800">Total Fees</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ${parseFloat(reportData.total_amount || 0).toFixed(2)}
                </div>
                <div className="text-sm text-green-800">Total Amount</div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  ${parseFloat(reportData.paid_amount || 0).toFixed(2)}
                </div>
                <div className="text-sm text-green-900">Paid Amount ({reportData.paid_count || 0} fees)</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  ${parseFloat(reportData.unpaid_amount || 0).toFixed(2)}
                </div>
                <div className="text-sm text-yellow-800">Unpaid Amount ({reportData.unpaid_count || 0} fees)</div>
              </div>
            </div>
          </div>
        );

      case 'highest-debtors':
        if (!Array.isArray(reportData) || reportData.length === 0) {
          return <div className="text-center py-4 text-gray-500">No debtors found for the selected semester.</div>;
        }
        return (
          <div>
            <h4 className="font-semibold mb-3">Highest Debtors by Semester</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Rank</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Student</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Student Number</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Total Debt</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Number of Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((debtor, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-semibold">#{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {debtor.first_name} {debtor.last_name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{debtor.student_number}</td>
                      <td className="border border-gray-300 px-4 py-2 text-red-600 font-semibold">
                        ${parseFloat(debtor.total_debt).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{debtor.fee_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div>No data available</div>;
    }
  };

  const organizationOptions = [
    { value: '', label: 'All Organizations' },
    ...organizations.map(org => ({
      value: org.organization_id,
      label: org.organization_name || org.organization_id
    }))
  ];

  const studentOptions = [
    { value: '', label: 'Select Student' },
    ...students.map(student => ({
      value: student.student_number,
      label: `${student.student_number} - ${student.first_name} ${student.last_name}`
    }))
  ];

  const semesterOptions = [
    { value: 'First', label: 'First Semester' },
    { value: 'Second', label: 'Second Semester' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Fee Reports</h3>
        <p className="text-gray-600">Generate detailed reports on fee payments and organization finances</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-semibold mb-4">Report Filters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Organization"
            value={filters.organization_id}
            onChange={(e) => setFilters({...filters, organization_id: e.target.value})}
            options={organizationOptions}
          />
          
          <Select
            label="Student"
            value={filters.student_number}
            onChange={(e) => setFilters({...filters, student_number: e.target.value})}
            options={studentOptions}
          />
          
          <Input
            label="Year"
            type="number"
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: e.target.value})}
          />
          
          <Select
            label="Semester"
            value={filters.semester}
            onChange={(e) => setFilters({...filters, semester: e.target.value})}
            options={semesterOptions}
          />
          
          <Input
            label="As of Date"
            type="date"
            value={filters.as_of_date}
            onChange={(e) => setFilters({...filters, as_of_date: e.target.value})}
          />
          
          <Input
            label="Limit (for top debtors)"
            type="number"
            value={filters.limit}
            onChange={(e) => setFilters({...filters, limit: e.target.value})}
            min="1"
            max="100"
          />
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Report 2: Unpaid fees by organization and semester */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Building className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h4 className="font-semibold">Unpaid Fees by Organization</h4>
              <p className="text-sm text-gray-600">View unpaid fees for specific organization & semester</p>
              <p className="text-xs text-red-500 mt-1">*Requires organization, year, and semester</p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => generateReport('unpaid-by-org-semester')}
            disabled={loading || !filters.organization_id || !filters.year || !filters.semester}
            className="w-full"
          >
            {loading && activeReport === 'unpaid-by-org-semester' ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>

        {/* Report 3: Student's unpaid fees (Member's POV) */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h4 className="font-semibold">Student's Unpaid Fees</h4>
              <p className="text-sm text-gray-600">Member's POV - all unpaid fees for a student</p>
              <p className="text-xs text-red-500 mt-1">*Requires student selection</p>
            </div>
          </div>
          <Button
            variant="success"
            onClick={() => generateReport('unpaid-by-student')}
            disabled={loading || !filters.student_number}
            className="w-full"
          >
            {loading && activeReport === 'unpaid-by-student' ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>

        {/* Report 6: Late payment fees */}
        <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
            <Calendar className="w-8 h-8 text-red-500 mr-3" />
            <div>
            <h4 className="font-semibold">Late Payment Fees</h4>
            <p className="text-sm text-gray-600">View all late payments by organization & year</p>
            <p className="text-xs text-red-500 mt-1">*Requires organization, year</p>
            </div>
        </div>
        <Button
            variant="danger"
            onClick={() => generateReport('late-fees')}
            disabled={loading || !filters.organization_id || !filters.year}
            className="w-full"
        >
            {loading && activeReport === 'late-fees' ? 'Generating...' : 'Generate Report'}
        </Button>
        </div>

        {/* Report 9: Total fees by organization */}
        <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
            <DollarSign className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
            <h4 className="font-semibold">Total Fees Summary</h4>
            <p className="text-sm text-gray-600">Total paid/unpaid fees by organization</p>
            <p className="text-xs text-red-500 mt-1">*Requires organization and date</p>
            </div>
        </div>
        <Button
            variant="warning"
            onClick={() => generateReport('total-fees')}
            disabled={loading || !filters.organization_id || !filters.as_of_date}
            className="w-full"
        >
            {loading && activeReport === 'total-fees' ? 'Generating...' : 'Generate Report'}
        </Button>
        </div>

        {/* Report 10: Highest debtors by semester */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <h4 className="font-semibold">Highest Debtors</h4>
              <p className="text-sm text-gray-600">Top debtors by semester</p>
              <p className="text-xs text-red-500 mt-1">*Requires year and semester</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => generateReport('highest-debtors')}
            disabled={loading || !filters.year || !filters.semester}
            className="w-full"
          >
            {loading && activeReport === 'highest-debtors' ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Report Results"
      >
        <div className="space-y-4">
          {renderReportContent()}
          
          {reportData && (
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="primary"
                onClick={() => exportToCSV(reportData, `fee-report-${activeReport}-${Date.now()}`)}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export to CSV
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FeeReports;