import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const FeeForm = ({ 
  formData: initialFormData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  loading, 
  editingFee, 
  students, 
  organizations 
}) => {
  const [formData, setLocalFormData] = useState({
    fee_id: '',
    label: '',
    amount: '',
    status: '',
    student_number: '',
    organization_id: '',
    date_issue: '',
    due_date: '',
    ...initialFormData,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setLocalFormData({ ...formData, [field]: value });
    setFormData({ ...formData, [field]: value }); 
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fee_id) newErrors.fee_id = 'Fee ID is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.student_number) newErrors.student_number = 'Student is required';
    if (!formData.organization_id) newErrors.organization_id = 'Organization is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  const statusOptions = [
    { value: 'Unpaid', label: 'Unpaid' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Late', label: 'Late' },
  ];

  const studentOptions = students.map(student => ({
    value: student.student_number,
    label: `${student.student_number} - ${student.first_name} ${student.last_name}`,
  }));

  const organizationOptions = organizations.map(org => ({
    value: org.organization_id,
    label: org.organization_name || org.organization_id,
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#ffffff] rounded-lg shadow p-6"
    >
      <h3 className="text-lg font-semibold text-[#01050b] mb-4">
        {editingFee ? 'Edit Fee' : 'Add New Fee'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <Input
            label="Fee ID"
            value={formData.fee_id}
            onChange={(e) => handleInputChange('fee_id', e.target.value)}
            required
            disabled={editingFee}
          />
          {errors.fee_id && (
            <p className="text-[#0e4a80] text-xs mt-1">{errors.fee_id}</p>
          )}
        </div>

        <Input
          label="Label"
          value={formData.label}
          onChange={(e) => handleInputChange('label', e.target.value)}
          placeholder="e.g., Membership Fee, Event Fee"
        />

        <div className="relative">
          <Input
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            required
          />
          {errors.amount && (
            <p className="text-[#0e4a80] text-xs mt-1">{errors.amount}</p>
          )}
        </div>

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          options={statusOptions}
        />

        <div className="relative">
          <Select
            label="Student"
            value={formData.student_number}
            onChange={(e) => handleInputChange('student_number', e.target.value)}
            options={studentOptions}
            required
          />
          {errors.student_number && (
            <p className="text-[#0e4a80] text-xs mt-1">{errors.student_number}</p>
          )}
        </div>

        <div className="relative">
          <Select
            label="Organization"
            value={formData.organization_id}
            onChange={(e) => handleInputChange('organization_id', e.target.value)}
            options={organizationOptions}
            required
          />
          {errors.organization_id && (
            <p className="text-[#0e4a80] text-xs mt-1">{errors.organization_id}</p>
          )}
        </div>

        <Input
          label="Date Issued"
          type="date"
          value={formData.date_issue}
          onChange={(e) => handleInputChange('date_issue', e.target.value)}
        />

        <Input
          label="Due Date"
          type="date"
          value={formData.due_date}
          onChange={(e) => handleInputChange('due_date', e.target.value)}
        />

        <div className="md:col-span-2 flex gap-3">
          <Button
            variant="primary"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-[#ffffff]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Saving...
              </span>
            ) : editingFee ? 'Update Fee' : 'Add Fee'}
          </Button>
          <Button
            variant="secondary"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FeeForm;