import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const FeeForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  loading, 
  editingFee, 
  students, 
  organizations 
}) => {
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const statusOptions = [
    { value: 'Unpaid', label: 'Unpaid' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Late', label: 'Late' }
  ];

  const studentOptions = students.map(student => ({
    value: student.student_number,
    label: `${student.student_number} - ${student.first_name} ${student.last_name}`
  }));

  const organizationOptions = organizations.map(org => ({
    value: org.organization_id,
    label: org.organization_name || org.organization_id
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {editingFee ? 'Edit Fee' : 'Add New Fee'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Fee ID"
          value={formData.fee_id}
          onChange={(e) => handleInputChange('fee_id', e.target.value)}
          required
          disabled={editingFee}
        />

        <Input
          label="Label"
          value={formData.label}
          onChange={(e) => handleInputChange('label', e.target.value)}
          placeholder="e.g., Membership Fee, Event Fee"
        />

        <Input
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          required
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          options={statusOptions}
        />

        <Select
          label="Student"
          value={formData.student_number}
          onChange={(e) => handleInputChange('student_number', e.target.value)}
          options={studentOptions}
          required
        />

        <Select
          label="Organization"
          value={formData.organization_id}
          onChange={(e) => handleInputChange('organization_id', e.target.value)}
          options={organizationOptions}
          required
        />

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

        <div className="md:col-span-2 flex gap-2">
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : editingFee ? 'Update Fee' : 'Add Fee'}
          </Button>
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeeForm;