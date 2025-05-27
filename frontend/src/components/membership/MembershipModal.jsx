import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import MembershipForm from './MembershipForm';

const MembershipModal = ({ 
  showModal,
  setShowModal,
  modalMode,
  selectedMembership,
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
  onSubmit,
  onDelete 
}) => {
  const getModalTitle = () => {
    switch (modalMode) {
      case 'create':
        return 'Add New Membership';
      case 'edit':
        return 'Edit Membership';
      case 'delete':
        return 'Delete Membership';
      default:
        return '';
    }
  };

  const handleSubmit = () => {
    onSubmit(modalMode);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={handleCancel}
      title={getModalTitle()}
    >
      {modalMode === 'delete' ? (
        <div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the membership for student {selectedMembership?.student_number} 
            in {selectedMembership?.organization_name}?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <MembershipForm
          formData={formData}
          setFormData={setFormData}
          students={students}
          organizations={organizations}
          committees={committees}
          statusOptions={statusOptions}
          roleOptions={roleOptions}
          organizationRoles={organizationRoles}
          showCustomRole={showCustomRole}
          customRole={customRole}
          setCustomRole={setCustomRole}
          setShowCustomRole={setShowCustomRole}
          modalMode={modalMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </Modal>
  );
};

export default MembershipModal;