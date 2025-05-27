import React from 'react';

const Input = ({ label, placeholder, value, onChange, type = 'text', required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-[#01050b] mb-1">
      {label} {required && <span className="text-[#0e4a80]">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-[#9daecc] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
      required={required}
    />
  </div>
);

export default Input;