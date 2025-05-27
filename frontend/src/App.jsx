import React, { useState } from 'react';
import { Users, Building2, Calendar, DollarSign, UserCheck, Settings } from 'lucide-react';
import StudentManagement from './pages/StudentManagement';
import OrganizationManagement from './pages/OrganizationManagement';
import MembershipManagement from './pages/MembershipManagement';
import FeeManagement from './pages/FeeManagement';
import EventManagement from './pages/EventManagement';
import CommitteeManagement from './pages/CommitteeManagement';

function App() {
  const [activeTab, setActiveTab] = useState('students');

  const navItems = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'memberships', label: 'Membership', icon: UserCheck },
    { id: 'fees', label: 'Fee', icon: DollarSign },
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
    <div className="min-h-screen bg-[#9DAECC]">
      {/* SOMA Navbar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/src/assets/soma-logo.png" 
                alt="SOMA Logo" 
                className="h-48 w-auto"
              />
            </div>
            
            {/* Navigation */}
            <nav className="flex justify-center flex-1 space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'text-[#0E4A80] bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            
            {/* Mobile menu placeholder */}
            <div className="md:hidden">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveComponent()}
      </div>
    </div>
  );
}

export default App;