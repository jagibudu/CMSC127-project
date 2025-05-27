import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import { StatusBadge, RoleBadge } from '../ui/Badges';

const MembershipTable = ({ memberships, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="text-center py-8 text-[#616161] text-xs">Loading...</div>;
  }

  if (memberships.length === 0) {
    return <div className="text-center py-8 text-[#616161] text-xs">No memberships found</div>;
  }

  return (
    <div className="bg-[#f9f9f9] rounded-lg shadow-md overflow-hidden min-h-[100px] w-full">
      <div className="overflow-x-auto h-full">
        <table className="w-full table-fixed h-full">
        <thead className="bg-[#f5f5f5]">
          <tr>
            <th className="w-[12%] px-6 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider truncate">
              Student
            </th>
            <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider truncate">
              Organization
            </th>
            <th className="w-[14%] px-6 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider truncate">
              Committee
            </th>
            <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider truncate">
              Role
            </th>
            <th className="w-[8%] px-6 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider truncate">
              Status
            </th>
            <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider truncate">
              Date Joined
            </th>
            <th className="w-[6%] px-6 py-3 text-left text-xs font-medium text-[#616161] uppercase tracking-wider truncate">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#ffffff] divide-y divide-[#b0bec5]">
          {memberships.map((membership, index) => (
            <tr
              key={`${membership.student_number}-${membership.organization_id}-${index}`}
              className="odd:bg-[#ffffff] even:bg-[#f9f9f9] hover:bg-[#f5f5f5] transition-colors"
            >
              <td className="px-6 py-4 border-r border-[#b0bec5] truncate">
                <div>
                  <div className="text-xs font-semibold text-[#212121] truncate">
                    {membership.student_number}
                  </div>
                  <div className="text-xs text-[#616161] truncate">
                    {membership.first_name} {membership.last_name}
                  </div>
                  <div className="text-xs text-[#616161] truncate">
                    {membership.gender} • {membership.degree_program}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-[#212121] border-r border-[#b0bec5]">
                <div className="flex flex-col min-w-0">
                  <div className="font-medium text-[#212121] truncate">{membership.organization_name}</div>
                  <div className="text-xs text-[#616161] truncate">{membership.organization_id}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-[#212121] border-r border-[#b0bec5] truncate">
                {membership.committee_name || '-'}
              </td>
              <td className="px-6 py-4 border-r border-[#b0bec5] truncate">
                <RoleBadge role={membership.role} />
              </td>
              <td className="px-6 py-4 border-r border-[#b0bec5] truncate">
                <StatusBadge status={membership.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-[#212121] border-r border-[#b0bec5]">
                <div className="flex items-center justify-center">
                  <Calendar size={16} className="mr-1 text-[#616161]" />
                  {membership.membership_date 
                    ? new Date(membership.membership_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : '-'}
                </div>
              </td>
              <td className="px-6 py-4 text-xs font-medium truncate">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(membership)}
                    className="text-[#1976d2] hover:text-[#1565c0]"
                    aria-label={`Edit membership for ${membership.student_number}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(membership)}
                    className="text-[#c62828] hover:text-[#b71c1c]"
                    aria-label={`Delete membership for ${membership.student_number}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default MembershipTable;