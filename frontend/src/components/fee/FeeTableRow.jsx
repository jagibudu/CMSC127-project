import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import Button from '../ui/Button';

const FeeTableRow = ({ fee, onEdit, onDelete, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-[#a5d6a7] text-[#212121]'; 
      case 'Late':
        return 'bg-[#fff59d] text-[#212121]'; 
      case 'Unpaid':
        return 'bg-[#ef9a9a] text-[#212121]'; 
      default:
        return 'bg-[#b0bec5] text-[#212121]'; 
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return 'Invalid date';
    return parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <tr className="odd:bg-[#ffffff] even:bg-[#f9f9f9] hover:bg-[#f5f5f5] transition-colors">
      <td className="px-6 py-4 whitespace-nowrap border-r border-[#b0bec5]">
        <div>
          <div className="text-sm font-semibold text-[#212121]">
            {fee.fee_id}
          </div>
          <div className="text-sm text-[#616161]">
            {fee.label || 'No label'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-r border-[#b0bec5]">
        <div className="text-sm font-semibold text-[#212121]">
          {fee.first_name} {fee.last_name}
        </div>
        <div className="text-sm text-[#616161]">
          {fee.student_number}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212121] border-r border-[#b0bec5]">
        {fee.organization_name || fee.organization_id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-r border-[#b0bec5]">
        <div className="text-sm font-semibold text-[#212121]">
          ${parseFloat(fee.amount).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-r border-[#b0bec5]">
        <div className="flex items-center gap-2">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fee.status)}`}>
            {fee.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212121] border-r border-[#b0bec5]">
        <div className="flex items-center">
          <Calendar size={16} className="mr-1 text-[#616161]" />
          {formatDate(fee.due_date)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(fee)}
            className="text-[#1976d2] hover:text-[#1565c0]"
            aria-label={`Edit fee ${fee.fee_id}`}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(fee.fee_id)}
            className="text-[#c62828] hover:text-[#b71c1c]"
            aria-label={`Delete fee ${fee.fee_id}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FeeTableRow;