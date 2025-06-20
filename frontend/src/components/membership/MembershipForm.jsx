import React from 'react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import CustomRoleInput from './CustomRoleInput';

const MembershipForm = ({ 
  formData, 
  setFormData, 
  students, 
  organizations, 
  committees,
  statusOptions,
  roleOptions,
  organizationRoles,
  showCustomRole,
  customRole,
  setCustomRole,
  setShowCustomRole,
  modalMode,
  onSubmit,
  onCancel 
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Student"
          value={formData.student_number}
          onChange={(e) => setFormData({...formData, student_number: e.target.value})}
          options={students.map(student => ({
            value: student.student_number,
            label: `${student.student_number} - ${student.first_name} ${student.last_name}`
          }))}
          required
          className="w-full text-[#01050b] border-[#9daecc] focus:ring-[#158fd4] focus:border-[#158fd4] bg-[#ffffff]"
        />
        <Select
          label="Organization"
          value={formData.organization_id}
          onChange={(e) => setFormData({...formData, organization_id: e.target.value, committee_id: ''})}
          options={organizations.map(org => ({
            value: org.organization_id,
            label: org.organization_name || org.organization_id
          }))}
          required
          className="w-full text-[#01050b] border-[#9daecc] focus:ring-[#158fd4] focus:border-[#158fd4] bg-[#ffffff]"
        />
        <Select
          label="Committee"
          value={formData.committee_id}
          onChange={(e) => setFormData({...formData, committee_id: e.target.value})}
          options={committees.map(committee => ({
            value: committee.committee_id,
            label: committee.committee_name
          }))}
          className="w-full text-[#01050b] border-[#9daecc] focus:ring-[#158fd4] focus:border-[#158fd4] bg-[#ffffff]"
        />
        <Input
          label="Membership Date"
          type="date"
          value={formData.membership_date}
          onChange={(e) => setFormData({...formData, membership_date: e.target.value})}
          className="w-full text-[#01050b] border-[#9daecc] focus:ring-[#158fd4] focus:border-[#158fd4] bg-[#ffffff]"
        />
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          options={statusOptions}
          className="w-full text-[#01050b] border-[#9daecc] focus:ring-[#158fd4] focus:border-[#158fd4] bg-[#ffffff]"
        />
        <CustomRoleInput
          showCustomRole={showCustomRole}
          customRole={customRole}
          setCustomRole={setCustomRole}
          setShowCustomRole={setShowCustomRole}
          setFormData={setFormData}
          formData={formData}
          organizationRoles={organizationRoles}
          roleOptions={roleOptions}
        />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button 
          variant="secondary" 
          onClick={onCancel}
          className="px-3 py-1 text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] rounded"
        >
          Cancel
        </Button>
        <Button 
          variant={modalMode === 'create' ? 'success' : 'warning'}
          onClick={onSubmit}
          className="px-3 py-1 text-sm bg-[#158fd4] hover:bg-[#0e4a80] text-[#ffffff] rounded"
        >
          {modalMode === 'create' ? 'Create Membership' : 'Update Membership'}
        </Button>
      </div>
    </div>
  );
};

export default MembershipForm;