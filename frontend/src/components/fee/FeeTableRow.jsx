import React from 'react';
import { Edit2, Trash2, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

const FeeTableRow = ({ fee, onEdit, onDelete, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Late': return 'bg-red-100 text-red-800';
      case 'Unpaid': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && dueDate;
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {fee.fee_id}
          </div>
          <div className="text-sm text-gray-500">
            {fee.label || 'No label'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {fee.first_name} {fee.last_name}
        </div>
        <div className="text-sm text-gray-500">
          {fee.student_number}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {fee.organization_name || fee.organization_id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm font-medium text-gray-900">
          <DollarSign size={16} className="mr-1" />
          {parseFloat(fee.amount).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fee.status)}`}>
            {fee.status}
          </span>
          {isOverdue(fee.due_date) && fee.status === 'Unpaid' && (
            <AlertCircle size={16} className="text-red-500" />
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {fee.due_date ? (
          <div className="flex items-center">
            <Calendar size={16} className="mr-1 text-gray-400" />
            {new Date(fee.due_date).toLocaleDateString()}
          </div>
        ) : (
          'No due date'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          {fee.status === 'Unpaid' && (
            <button
              onClick={() => onUpdateStatus(fee.fee_id, 'Paid')}
              className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
            >
              Mark Paid
            </button>
          )}
          <button
            onClick={() => onEdit(fee)}
            className="text-blue-600 hover:text-blue-900"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(fee.fee_id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FeeTableRow;