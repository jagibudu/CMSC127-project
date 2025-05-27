import React, { useState } from 'react';
import { Users, Building2, Calendar, DollarSign, UserCheck, Settings } from 'lucide-react';
import StudentManagement from './pages/StudentManagement';
import OrganizationManagement from './pages/OrganizationManagement';
import MembershipManagement from './pages/MembershipManagement';
import FeeManagement from './pages/FeeManagement';
import EventManagement from './pages/EventManagement';
import CommitteeManagement from './pages/CommitteeManagement';

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    <Icon size={18} />
    {children}
  </button>
);

function App() {
  const [activeTab, setActiveTab] = useState('students');

  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'memberships', label: 'Memberships', icon: UserCheck },
    { id: 'fees', label: 'Fees', icon: DollarSign },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'committees', label: 'Committees', icon: Settings }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'students':
        return <StudentManagement />;
      case 'organizations':
        return <OrganizationManagement />;
      case 'memberships':
        return <MembershipManagement />;
      case 'fees':
        return <FeeManagement />;
      case 'events':
        return <EventManagement />;
      case 'committees':
        return <CommitteeManagement />;
      default:
        return <StudentManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Student Organization Management System
            </h1>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  icon={tab.icon}
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveComponent()}
      </div>
    </div>
  );
}

export default App;

