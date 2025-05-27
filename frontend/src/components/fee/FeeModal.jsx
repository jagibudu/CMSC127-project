import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import FeeForm from './FeeForm';

const FeeModal = ({
  showModal,
  setShowModal,
  modalMode,
  selectedFee,
  formData,
  setFormData,
  students,
  organizations,
  onSubmit,
  onDelete,
}) => {
  const getModalTitle = () => {
    switch (modalMode) {
      case 'create':
        return 'Add New Fee';
      case 'edit':
        return 'Edit Fee';
      case 'delete':
        return 'Delete Fee';
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
      className="bg-[#ffffff] border-[#9daecc] text-[#01050b]"
    >
      {modalMode === 'delete' ? (
        <div>
          <p className="text-[#01050b] mb-6">
            Are you sure you want to delete the fee {selectedFee?.fee_id} for student {selectedFee?.student_number} in {selectedFee?.organization_name}?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="px-3 py-1 text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] rounded"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-[#158fd4] hover:bg-[#0e4a80] text-[#ffffff] rounded"
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <FeeForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          students={students}
          organizations={organizations}
          modalMode={modalMode}
        />
      )}
    </Modal>
  );
};

export default FeeModal;