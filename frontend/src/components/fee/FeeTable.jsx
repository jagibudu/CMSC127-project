import React from 'react';
import FeeTableRow from './FeeTableRow';

const FeeTable = ({ fees, loading, onEdit, onDelete, onUpdateStatus }) => {
  return (
    <div className="bg-[#f9f9f9] rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f5f5f5]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#616161] uppercase tracking-wider">
                Fee Details
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#616161] uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#616161] uppercase tracking-wider">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#616161] uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#616161] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#616161] uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#616161] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#ffffff] divide-y divide-[#b0bec5]">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-[#616161]">
                  Loading fees...
                </td>
              </tr>
            ) : fees.length > 0 ? (
              fees.map((fee) => (
                <FeeTableRow
                  key={fee.fee_id}
                  fee={fee}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onUpdateStatus={onUpdateStatus}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-[#616161]">
                  No fees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeTable;