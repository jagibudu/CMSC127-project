import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const Button = ({ variant = 'primary', size = 'md', onClick, children, className = '', disabled = false }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
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
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      required={required}
    />
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    student_number: '',
    first_name: '',
    middle_initial: '',
    last_name: '',
    gender: '',
    degree_program: ''
  });

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

  const filteredStudents = students.filter(student =>
    student.student_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.degree_program?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Student Management</h2>
            <Button onClick={openCreateModal} className="flex items-center gap-2">
              <Plus size={16} />
              Add Student
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No students found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Student Number</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Middle Initial</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Gender</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Degree Program</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.student_number} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{student.student_number}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.first_name || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.middle_initial || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.last_name || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.gender}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.degree_program || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => openEditModal(student)}
                            className="flex items-center gap-1"
                          >
                            <Edit size={14} />
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => openDeleteModal(student)}
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
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'create' ? 'Add New Student' :
          modalMode === 'edit' ? 'Edit Student' :
          'Delete Student'
        }
      >
        {modalMode === 'delete' ? (
          <div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete student {selectedStudent?.student_number}?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
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
            <Input
              label="Gender"
              placeholder="Ex: Male/Female"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              required
            />
            <Input
              label="Degree Program"
              placeholder="Ex: Computer Science"
              value={formData.degree_program}
              onChange={(e) => setFormData({...formData, degree_program: e.target.value})}
            />
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                variant={modalMode === 'create' ? 'success' : 'warning'}
                onClick={modalMode === 'create' ? handleCreate : handleUpdate}
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