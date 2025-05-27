import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Users, GraduationCap, UserCheck, Filter, X, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const Button = ({ variant = 'primary', size = 'md', onClick, children, className = '', disabled = false }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#158fd4] hover:bg-[#0f7bc4] text-white focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, placeholder, value, onChange, type = 'text', required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4] transition-all duration-200"
      required={required}
    />
  </div>
);

const Select = ({ label, value, onChange, options, placeholder = "Select...", required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4] transition-all duration-200"
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-[#ffffff] border-[#9daecc] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}>
        <div className="flex items-center justify-between p-6 border-b border-[#9daecc]">
          <h3 className="text-xl font-semibold text-[#01050b]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#01050b] hover:text-[#0e4a80] focus:outline-none transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 text-[#01050b]">
          {children}
        </div>
      </div>
    </div>
  );
};

const StudentTableRow = ({ student, onEdit, onDelete }) => {
  const getGenderColor = (gender) => {
    switch (gender) {
      case 'Male':
        return 'bg-[#a5d6a7] text-[#212121]';
      case 'Female':
        return 'bg-[#f8bbd9] text-[#212121]';
      default:
        return 'bg-[#b0bec5] text-[#212121]';
    }
  };

  return (
    <tr className="odd:bg-[#ffffff] even:bg-[#f9f9f9] hover:bg-[#f5f5f5] transition-colors">
      <td className="px-6 py-4 whitespace-nowrap border-r border-[#b0bec5]">
        <div className="text-sm font-semibold text-[#212121]">
          {student.student_number}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-r border-[#b0bec5]">
        <div className="text-sm font-semibold text-[#212121]">
          {[student.first_name, student.middle_initial, student.last_name]
            .filter(Boolean)
            .join(' ') || '-'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-r border-[#b0bec5]">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(student.gender)}`}>
          {student.gender || '-'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212121] border-r border-[#b0bec5]">
        {student.degree_program || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(student)}
            className="text-[#1976d2] hover:text-[#1565c0]"
            aria-label={`Edit student ${student.student_number}`}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(student)}
            className="text-[#c62828] hover:text-[#b71c1c]"
            aria-label={`Delete student ${student.student_number}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [filters, setFilters] = useState({
    gender: '',
    degree_program: ''
  });
  
  const [formData, setFormData] = useState({
    student_number: '',
    first_name: '',
    middle_initial: '',
    last_name: '',
    gender: '',
    degree_program: ''
  });

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  const degreeProgramOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Education', label: 'Education' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Nursing', label: 'Nursing' },
    { value: 'Accounting', label: 'Accounting' }
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.student_number || !formData.gender) {
      alert('Student Number and Gender are required');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/students`, formData);
      setStudents([...students, response.data]);
      resetForm();
      setShowModal(false);
      alert('Student created successfully');
    } catch (error) {
      console.error('Error creating student:', error);
      if (error.response?.status === 409) {
        alert('Student already exists');
      } else {
        alert('Error creating student');
      }
    }
  };

  const handleUpdate = async () => {
    if (!formData.student_number) {
      alert('Student Number is required');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/students`, formData);
      setStudents(students.map(student => 
        student.student_number === formData.student_number ? response.data : student
      ));
      resetForm();
      setShowModal(false);
      alert('Student updated successfully');
    } catch (error) {
      console.error('Error updating student:', error);
      if (error.response?.status === 404) {
        alert('Student does not exist');
      } else {
        alert('Error updating student');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/students`, {
        data: { student_number: selectedStudent.student_number }
      });
      setStudents(students.filter(student => 
        student.student_number !== selectedStudent.student_number
      ));
      setShowModal(false);
      setSelectedStudent(null);
      alert('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      if (error.response?.status === 404) {
        alert('Student does not exist');
      } else {
        alert('Error deleting student');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student_number: '',
      first_name: '',
      middle_initial: '',
      last_name: '',
      gender: '',
      degree_program: ''
    });
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setFormData({ ...student });
    setSelectedStudent(student);
    setModalMode('edit');
    setShowModal(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setModalMode('delete');
    setShowModal(true);
  };

  const clearFilters = () => {
    setFilters({
      gender: '',
      degree_program: ''
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.student_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.degree_program?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = !filters.gender || student.gender === filters.gender;
    const matchesDegree = !filters.degree_program || 
      student.degree_program?.toLowerCase().includes(filters.degree_program.toLowerCase());

    return matchesSearch && matchesGender && matchesDegree;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPage = (page) => setCurrentPage(page);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const totalCount = filteredStudents.length;
  const maleCount = filteredStudents.filter(s => s.gender === 'Male').length;
  const femaleCount = filteredStudents.filter(s => s.gender === 'Female').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#158fd4] to-[#01050b] text-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Student Management</h1>
          <p className="text-blue-100">Manage student information and records</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Students</p>
                  <p className="text-2xl font-bold">{totalCount}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Male Students</p>
                  <p className="text-2xl font-bold">{maleCount}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-300" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Female Students</p>
                  <p className="text-2xl font-bold">{femaleCount}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-[#9daecc]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter size={16} />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <Button onClick={openCreateModal} className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Student
                </Button>
              </div>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4] transition-all duration-200"
              />
            </div>
          </div>
          {showFilters && (
            <div className="bg-[#ffffff] p-4 rounded-lg mb-6 border border-[#9daecc]">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#01050b] mb-1">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters({...filters, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-[#9daecc] rounded-md text-sm bg-[#ffffff] text-[#01050b] focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
                  >
                    <option value="">All Genders</option>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#01050b] mb-1">Degree Program</label>
                  <input
                    type="text"
                    placeholder="Enter program..."
                    value={filters.degree_program}
                    onChange={(e) => setFilters({...filters, degree_program: e.target.value})}
                    className="w-full px-3 py-2 border border-[#9daecc] rounded-md text-sm bg-[#ffffff] text-[#01050b] focus:outline-none focus:ring-2 focus:ring-[#158fd4] focus:border-[#158fd4]"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] rounded"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="w-full">
            {loading ? (
              <div className="text-center py-8 text-[#616161] text-xs">Loading...</div>
            ) : currentStudents.length === 0 ? (
              <div className="text-center py-8 text-[#616161] text-xs">No students found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#158fd4] to-[#0e4a80] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[20%]">
                      Student Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[25%]">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[15%]">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[25%]">
                      Degree Program
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider w-[15%]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentStudents.map((student, index) => (
                    <StudentTableRow
                      key={`${student.student_number}-${index}`}
                      student={student}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, totalCount)} of {totalCount} results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                aria-label="Go to first page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                aria-label="Go to previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex space-x-1">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      currentPage === pageNum
                        ? 'bg-[#158fd4] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                aria-label="Go to next page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                aria-label="Go to last page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'create' ? 'Add New Student' :
          modalMode === 'edit' ? 'Edit Student' :
          'Delete Student'
        }
        className="bg-[#ffffff] border-[#9daecc] text-[#01050b]"
      >
        {modalMode === 'delete' ? (
          <div>
            <p className="text-[#01050b] mb-6">
              Are you sure you want to delete student {selectedStudent?.student_number}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] rounded"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-[#158fd4] hover:bg-[#0e4a80] text-[#ffffff] rounded"
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Input
              label="Student Number"
              placeholder="Ex: 2021-12345"
              value={formData.student_number}
              onChange={(e) => setFormData({...formData, student_number: e.target.value})}
              required
            />
            <Input
              label="First Name"
              placeholder="Ex: John"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            />
            <Input
              label="Middle Initial"
              placeholder="Ex: D"
              value={formData.middle_initial}
              onChange={(e) => setFormData({...formData, middle_initial: e.target.value})}
            />
            <Input
              label="Last Name"
              placeholder="Ex: Doe"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              options={genderOptions}
              placeholder="Select Gender"
              required
            />
            <Select
              label="Degree Program"
              value={formData.degree_program}
              onChange={(e) => setFormData({...formData, degree_program: e.target.value})}
              options={degreeProgramOptions}
              placeholder="Select Degree Program"
            />
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm bg-[#9daecc] hover:bg-[#0e4a80] text-[#ffffff] rounded"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={modalMode === 'create' ? handleCreate : handleUpdate}
                className="px-3 py-1 text-sm bg-[#158fd4] hover:bg-[#0e4a80] text-[#ffffff] rounded"
              >
                {modalMode === 'create' ? 'Create Student' : 'Update Student'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentManagement;