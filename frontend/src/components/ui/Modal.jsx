import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#ffffff] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#9daecc]">
          <h3 className="text-lg font-semibold text-[#01050b]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#0e4a80] hover:text-[#158fd4] focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;