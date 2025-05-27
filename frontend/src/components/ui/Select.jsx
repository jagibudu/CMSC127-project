import React from 'react';

const Select = ({ label, value, onChange, options, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-[#01050b] mb-1">
      {label} {required && <span className="text-[#0e4a80]">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-[#9daecc] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
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

export default Select;