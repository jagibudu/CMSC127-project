import React, { useState, useEffect } from 'react';
import { Plus, FileText, CreditCard, BarChart3 } from 'lucide-react';
import Button from '../components/ui/Button';
import FeeFilters from '../components/fee/FeeFilters';
import FeeTable from '../components/fee/FeeTable';
import FeeReports from '../components/fee/FeeReports';
import FeeModal from '../components/fee/FeeModal';

const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState('management');
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedFee, setSelectedFee] = useState(null);
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

  const handleSubmit = async (mode) => {
    setLoading(true);
    try {
      const url = mode === 'edit' ? `${API_BASE}/fee` : `${API_BASE}/fee`;
      const method = mode === 'edit' ? 'PUT' : 'POST';
      
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
        setShowModal(false);
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
    setSelectedFee(fee);
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
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (selectedFee) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/fee?fee_id=${selectedFee.fee_id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchFees();
          setShowModal(false);
          setSelectedFee(null);
        }
      } catch (error) {
        console.error('Error deleting fee:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const openDeleteModal = (fee) => {
    setSelectedFee(fee);
    setModalMode('delete');
    setShowModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
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
    setSelectedFee(null);
    setShowModal(false);
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
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const totalFees = filteredFees.length;
  const unpaidFees = filteredFees.filter(f => f.status === 'Unpaid').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#158fd4] to-[#01050b] text-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Fee Management System</h1>
          <p className="text-blue-100">Track and manage organization fees and generate reports</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Fees</p>
                  <p className="text-2xl font-bold">{totalFees}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Unpaid Fees</p>
                  <p className="text-2xl font-bold">{unpaidFees}</p>
                </div>
                <FileText className="h-8 w-8 text-green-300" />
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
          {activeTab === 'management' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Button
                  variant="primary"
                  onClick={openCreateModal}
                  className="flex items-center gap-2 bg-[#158fd4] hover:bg-[#1278b0] text-white"
                >
                  <Plus size={20} />
                  Add Fee
                </Button>
              </div>

              <FeeFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />

              <FeeTable
                fees={filteredFees}
                loading={loading}
                onEdit={handleEdit}
                onDelete={openDeleteModal}
                onUpdateStatus={updateFeeStatus}
              />
            </div>
          )}

          {activeTab === 'reports' && (
            <FeeReports />
          )}
        </div>
      </div>

      {/* Fee Modal */}
      <FeeModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalMode={modalMode}
        selectedFee={selectedFee}
        formData={formData}
        setFormData={setFormData}
        students={students}
        organizations={organizations}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default FeeManagement;