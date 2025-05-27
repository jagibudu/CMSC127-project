import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, Users, DollarSign, TrendingUp, AlertCircle, Search } from 'lucide-react';

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

const Select = ({ label, value, onChange, options, required = false, className = '' }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
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

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false }) => (
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

const StatusBadge = ({ status }) => {
  const colors = {
    'Active': 'bg-green-100 text-green-800',
    'Alumni': 'bg-blue-100 text-blue-800',
    'Inactive': 'bg-gray-100 text-gray-800',
    'Suspended': 'bg-red-100 text-red-800',
    'Expelled': 'bg-red-100 text-red-800',
    'Paid': 'bg-green-100 text-green-800',
    'Unpaid': 'bg-yellow-100 text-yellow-800',
    'Late': 'bg-red-100 text-red-800'
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

const ReportsManagement = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState([]);
  const [reportSummary, setReportSummary] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    organization_id: '',
    year: new Date().getFullYear().toString(),
    semester: '',
    role: '',
    status: '',
    gender: '',
    degree_program: '',
    batch: '',
    committee_name: '',
    student_number: '',
    as_of_date: '',
    years_back: '1',
    limit: '10'
  });

  const reportTypes = [
    { value: 'members-by-details', label: '1. Members by Role/Status/Gender/Program/Batch/Committee' },
    { value: 'unpaid-fees-org-semester', label: '2. Unpaid Membership Fees by Organization & Semester' },
    { value: 'member-unpaid-fees', label: '3. Member\'s Unpaid Fees (All Organizations)' },
    { value: 'executive-committee', label: '4. Executive Committee Members by Organization & Year' },
    { value: 'presidents-by-year', label: '5. Presidents by Organization & Year (Chronological)' },
    { value: 'late-payments', label: '6. Late Payments by Organization & Semester' },
    { value: 'status-percentage', label: '7. Active vs Inactive Members Percentage' },
    { value: 'alumni-members', label: '8. Alumni Members by Organization & Date' },
    { value: 'fee-totals', label: '9. Total Unpaid/Paid Fees by Organization & Date' },
    { value: 'highest-debtors', label: '10. Highest Debtors by Organization & Semester' }
  ];

  const semesterOptions = [
    { value: 'First', label: 'First Semester (Jan-Jun)' },
    { value: 'Second', label: 'Second Semester (Jul-Dec)' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Alumni', label: 'Alumni' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Suspended', label: 'Suspended' },
    { value: 'Expelled', label: 'Expelled' }
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' }
  ];

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/organization`);
      const data = await response.json();
      setOrganizations(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push({ value: i.toString(), label: i.toString() });
    }
    return years;
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReport = async () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }

    setLoading(true);
    setReportData([]);
    setReportSummary(null);

    try {
      let url = '';
      let queryParams = new URLSearchParams();

      switch (selectedReport) {
        case 'members-by-details':
          url = `${API_BASE_URL}/membership/filter`;
          if (filters.organization_id) queryParams.append('organization_id', filters.organization_id);
          if (filters.role) queryParams.append('role', filters.role);
          if (filters.status) queryParams.append('status', filters.status);
          if (filters.gender) queryParams.append('gender', filters.gender);
          if (filters.degree_program) queryParams.append('degree_program', filters.degree_program);
          if (filters.batch) queryParams.append('batch', filters.batch);
          if (filters.committee_name) queryParams.append('committee_name', filters.committee_name);
          break;

        case 'unpaid-fees-org-semester':
          if (!filters.organization_id || !filters.year || !filters.semester) {
            alert('Organization, Year, and Semester are required for this report');
            setLoading(false);
            return;
          }
          url = `${API_BASE_URL}/fee/unpaid/organization-semester`;
          queryParams.append('organization_id', filters.organization_id);
          queryParams.append('year', filters.year);
          queryParams.append('semester', filters.semester);
          break;

        case 'member-unpaid-fees':
          if (!filters.student_number) {
            alert('Student Number is required for this report');
            setLoading(false);
            return;
          }
          url = `${API_BASE_URL}/fee/unpaid/student/${filters.student_number}`;
          break;

        case 'executive-committee':
          if (!filters.organization_id || !filters.year) {
            alert('Organization and Year are required for this report');
            setLoading(false);
            return;
          }
          url = `${API_BASE_URL}/membership/executive`;
          queryParams.append('organization_id', filters.organization_id);
          queryParams.append('year', filters.year);
          break;

        case 'presidents-by-year':
          if (!filters.organization_id) {
            alert('Organization is required for this report');
            setLoading(false);
            return;
          }
          url = `${API_BASE_URL}/membership/role/President`;
          queryParams.append('organization_id', filters.organization_id);
          break;

        case 'late-payments':
          if (!filters.organization_id || !filters.year) {
            alert('Organization and Year are required for this report');
            setLoading(false);
            return;
          }
          url = `${API_BASE_URL}/fee/late`;
          queryParams.append('organization_id', filters.organization_id);
          queryParams.append('year', filters.year);
          break;

        case 'status-percentage':
          if (!filters.organization_id) {
            alert('Organization is required for this report');
            setLoading(false);
            return;
          }
          url = `${API_BASE_URL}/membership/status-percentage`;
          queryParams.append('organization_id', filters.organization_id);
          if (filters.years_back) queryParams.append('years_back', filters.years_back);
          break;

        case 'alumni-members':
          if (!filters.organization_id) {
            alert('Organization is required for this report');
            setLoading(false);
            return;
          }
          url = `${API_BASE_URL}/membership/alumni`;
          queryParams.append('organization_id', filters.organization_id);
          if (filters.as_of_date) queryParams.append('as_of_date', filters.as_of_date);
          break;

        case 'fee-totals':
          if (!filters.organization_id) {
            alert('Organization is required for this report');
            setLoading(false);
            return;
          }
          url = `${API_BASE_URL}/fee/totals`;
          queryParams.append('organization_id', filters.organization_id);
          if (filters.as_of_date) queryParams.append('as_of_date', filters.as_of_date);
          break;

        case 'highest-debtors':
          if (!filters.year || !filters.semester) {
            alert('Year and Semester are required for this report');
            setLoading(false);
            return;
          }
          url = `${API_BASE_URL}/fee/debtors`;
          queryParams.append('year', filters.year);
          queryParams.append('semester', filters.semester);
          if (filters.limit) queryParams.append('limit', filters.limit);
          break;

        default:
          alert('Invalid report type selected');
          setLoading(false);
          return;
      }

      const fullUrl = queryParams.toString() ? `${url}?${queryParams}` : url;
      const response = await fetch(fullUrl);
      const data = await response.json();

      if (selectedReport === 'fee-totals' || selectedReport === 'status-percentage') {
        setReportSummary(data);
      } else {
        setReportData(Array.isArray(data) ? data : [data]);
      }

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      organization_id: '',
      year: new Date().getFullYear().toString(),
      semester: '',
      role: '',
      status: '',
      gender: '',
      degree_program: '',
      batch: '',
      committee_name: '',
      student_number: '',
      as_of_date: '',
      years_back: '1',
      limit: '10'
    });
  };

  const renderFilterInputs = () => {
    const showOrgFilter = ['members-by-details', 'unpaid-fees-org-semester', 'executive-committee', 'presidents-by-year', 'late-payments', 'status-percentage', 'alumni-members', 'fee-totals'].includes(selectedReport);
    const showYearFilter = ['unpaid-fees-org-semester', 'executive-committee', 'presidents-by-year', 'late-payments', 'highest-debtors'].includes(selectedReport);
    const showSemesterFilter = ['unpaid-fees-org-semester', 'late-payments', 'highest-debtors'].includes(selectedReport);
    const showStudentFilter = selectedReport === 'member-unpaid-fees';
    const showDateFilter = ['alumni-members', 'fee-totals'].includes(selectedReport);
    const showYearsBackFilter = selectedReport === 'status-percentage';
    const showLimitFilter = selectedReport === 'highest-debtors';
    const showDetailFilters = selectedReport === 'members-by-details';

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {showOrgFilter && (
          <Select
            label="Organization"
            value={filters.organization_id}
            onChange={(e) => setFilters({...filters, organization_id: e.target.value})}
            options={organizations.map(org => ({
              value: org.organization_id,
              label: org.organization_name || org.organization_id
            }))}
            required={['unpaid-fees-org-semester', 'executive-committee', 'presidents-by-year', 'late-payments', 'status-percentage', 'alumni-members', 'fee-totals'].includes(selectedReport)}
          />
        )}

        {showYearFilter && (
          <Select
            label="Year"
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: e.target.value})}
            options={generateYearOptions()}
            required
          />
        )}

        {showSemesterFilter && (
          <Select
            label="Semester"
            value={filters.semester}
            onChange={(e) => setFilters({...filters, semester: e.target.value})}
            options={semesterOptions}
            required
          />
        )}

        {showStudentFilter && (
          <Input
            label="Student Number"
            value={filters.student_number}
            onChange={(e) => setFilters({...filters, student_number: e.target.value})}
            placeholder="Enter student number"
            required
          />
        )}

        {showDateFilter && (
          <Input
            label="As of Date"
            type="date"
            value={filters.as_of_date}
            onChange={(e) => setFilters({...filters, as_of_date: e.target.value})}
          />
        )}

        {showYearsBackFilter && (
          <Input
            label="Years Back"
            type="number"
            value={filters.years_back}
            onChange={(e) => setFilters({...filters, years_back: e.target.value})}
            placeholder="1"
          />
        )}

        {showLimitFilter && (
          <Input
            label="Limit Results"
            type="number"
            value={filters.limit}
            onChange={(e) => setFilters({...filters, limit: e.target.value})}
            placeholder="10"
          />
        )}

        {showDetailFilters && (
          <>
            <Input
              label="Role"
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              placeholder="e.g., President, Member"
            />
            
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              options={statusOptions}
            />

            <Select
              label="Gender"
              value={filters.gender}
              onChange={(e) => setFilters({...filters, gender: e.target.value})}
              options={genderOptions}
            />

            <Input
              label="Degree Program"
              value={filters.degree_program}
              onChange={(e) => setFilters({...filters, degree_program: e.target.value})}
              placeholder="e.g., Computer Science"
            />

            <Input
              label="Batch/Year"
              value={filters.batch}
              onChange={(e) => setFilters({...filters, batch: e.target.value})}
              placeholder="e.g., 2024"
            />

            <Input
              label="Committee Name"
              value={filters.committee_name}
              onChange={(e) => setFilters({...filters, committee_name: e.target.value})}
              placeholder="e.g., Finance Committee"
            />
          </>
        )}
      </div>
    );
  };

  const renderReportData = () => {
    if (reportSummary) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(reportSummary).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  {key.includes('amount') || key.includes('debt') ? (
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  ) : key.includes('count') || key.includes('total') ? (
                    <Users className="w-6 h-6 text-blue-600" />
                  ) : (
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!reportData || reportData.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No data found for the selected criteria
        </div>
      );
    }

    const headers = Object.keys(reportData[0]);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th key={header} className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
                  {header.replace(/_/g, ' ').toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="border border-gray-300 px-4 py-2">
                    {header === 'status' && row[header] ? (
                      <StatusBadge status={row[header]} />
                    ) : header === 'role' && row[header] ? (
                      <RoleBadge role={row[header]} />
                    ) : header.includes('date') && row[header] ? (
                      new Date(row[header]).toLocaleDateString()
                    ) : header.includes('amount') || header.includes('balance') || header.includes('debt') ? (
                      row[header] ? `$${parseFloat(row[header]).toFixed(2)}` : '$0.00'
                    ) : (
                      row[header] || '-'
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Reports Management</h2>
              <p className="text-sm text-gray-600 mt-1">Generate comprehensive reports for organizations and memberships</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              {(reportData.length > 0 || reportSummary) && (
                <Button 
                  variant="success"
                  onClick={() => exportToCSV(reportData.length > 0 ? reportData : [reportSummary], `report-${selectedReport}-${new Date().toISOString().split('T')[0]}`)}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Export CSV
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <Select
                label="Select Report Type"
                value={selectedReport}
                onChange={(e) => {
                  setSelectedReport(e.target.value);
                  setReportData([]);
                  setReportSummary(null);
                  setShowFilters(true);
                }}
                options={reportTypes}
                required
              />
            </div>

            {/* Filters */}
            {showFilters && selectedReport && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Report Filters</h3>
                  <Button variant="secondary" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
                {renderFilterInputs()}
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={generateReport}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText size={16} />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Report Results */}
            {(reportData.length > 0 || reportSummary) && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Report Results
                    {reportData.length > 0 && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({reportData.length} records)
                      </span>
                    )}
                  </h3>
                </div>
                {renderReportData()}
              </div>
            )}

            {/* Report Descriptions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center gap-2">
                <FileText size={20} />
                Available Reports
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Membership Reports</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Members by Role, Status, Gender, Program, etc.</li>
                    <li>• Executive Committee Members by Year</li>
                    <li>• Presidents History (Chronological)</li>
                    <li>• Active vs Inactive Percentage</li>
                    <li>• Alumni Members by Date</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Financial Reports</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Unpaid Fees by Organization & Semester</li>
                    <li>• Member's Unpaid Fees (All Organizations)</li>
                    <li>• Late Payments by Organization</li>
                    <li>• Total Paid/Unpaid Fees Summary</li>
                    <li>• Highest Debtors by Semester</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;