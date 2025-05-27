import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { StatusBadge, RoleBadge } from '../ui/Badges';

const MembershipTable = ({ memberships, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (memberships.length === 0) {
    return <div className="text-center py-8 text-gray-500">No memberships found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Student</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Organization</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Committee</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date Joined</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((membership, index) => (
            <tr key={`${membership.student_number}-${membership.organization_id}-${index}`} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                <div>
                  <div className="font-medium">{membership.student_number}</div>
                  <div className="text-sm text-gray-600">
                    {membership.first_name} {membership.last_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {membership.gender} • {membership.degree_program}
                  </div>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div>
                  <div className="font-medium">{membership.organization_name}</div>
                  <div className="text-xs text-gray-500">{membership.organization_id}</div>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {membership.committee_name || '-'}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <RoleBadge role={membership.role} />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <StatusBadge status={membership.status} />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {membership.membership_date ? new Date(membership.membership_date).toLocaleDateString() : '-'}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex gap-2">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => onEdit(membership)}
                    className="flex items-center gap-1"
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(membership)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembershipTable;