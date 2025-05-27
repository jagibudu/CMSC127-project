import React, { useState, useEffect } from 'react';
import { Plus, FileText, CreditCard } from 'lucide-react';
import Button from '../components/ui/Button';
import FeeForm from '../components/fee/FeeForm';
import FeeFilters from '../components/fee/FeeFilters';
import FeeTable from '../components/fee/FeeTable';
import FeeReports from '../components/fee/FeeReports';

const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState('management');
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    fee_id: '',
    label: '',
    status: 'Unpaid',
    amount: '',
    date_issue: '',
    due_date: '',
    organization_id: '',
    student_number: ''
  });

  const API_BASE = 'http://localhost:3000';

  useEffect(() => {
    fetchFees();
    fetchStudents();
    fetchOrganizations();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/fee`);
      const data = await response.json();
      setFees(data);
    } catch (error) {
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
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

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${API_BASE}/organization`);
      const data = await response.json();
      setOrganizations(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const url = editingFee ? `${API_BASE}/fee` : `${API_BASE}/fee`;
      const method = editingFee ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchFees();
        resetForm();
      } else {
        console.error('Error saving fee');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setFormData({
      fee_id: fee.fee_id,
      label: fee.label || '',
      status: fee.status,
      amount: fee.amount,
      date_issue: fee.date_issue ? fee.date_issue.split('T')[0] : '',
      due_date: fee.due_date ? fee.due_date.split('T')[0] : '',
      organization_id: fee.organization_id,
      student_number: fee.student_number
    });
    setShowForm(true);
  };

  const handleDelete = async (feeId) => {
    if (window.confirm('Are you sure you want to delete this fee?')) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/fee?fee_id=${feeId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchFees();
        }
      } catch (error) {
        console.error('Error deleting fee:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateFeeStatus = async (feeId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/fee/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fee_id: feeId, status: newStatus }),
      });

      if (response.ok) {
        await fetchFees();
      }
    } catch (error) {
      console.error('Error updating fee status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      fee_id: '',
      label: '',
      status: 'Unpaid',
      amount: '',
      date_issue: '',
      due_date: '',
      organization_id: '',
      student_number: ''
    });
    setEditingFee(null);
    setShowForm(false);
  };

  const filteredFees = fees.filter(fee => {
    const matchesSearch = 
      fee.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.organization_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'management', label: 'Fee Management', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fee Management System</h2>
          <p className="text-gray-600">Track and manage organization fees and generate reports</p>
        </div>
        {activeTab === 'management' && (
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Fee
          </Button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'management' && (
        <div className="space-y-6">
          {/* Filters */}
          <FeeFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* Fee Form */}
          {showForm && (
            <FeeForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              loading={loading}
              editingFee={editingFee}
              students={students}
              organizations={organizations}
            />
          )}

          {/* Fee Table */}
          <FeeTable
            fees={filteredFees}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateStatus={updateFeeStatus}
          />
        </div>
      )}

      {activeTab === 'reports' && (
        <FeeReports />
      )}
    </div>
  );
};

export default FeeManagement;