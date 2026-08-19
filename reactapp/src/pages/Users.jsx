import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import './Candidates.css'; // Reusing your existing table & modal stylesheet

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Track expandable rows for viewing full details
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Helper to decode roles from the auth token
  const getUserRole = () => {
    if (!user?.token) return '';
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      const roles = payload.roles || payload.role || '';
      if (Array.isArray(roles)) {
        return roles.join(',').toUpperCase();
      }
      return String(roles).toUpperCase();
    } catch (e) {
      console.error("Could not decode token", e);
      return '';
    }
  };

  const roleString = getUserRole();
  const isAdmin = roleString.includes('ADMIN');
  const isCoordinator = roleString.includes('COORDINATOR');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Form state strictly mapped to UserRequest DTO
  const emptyFormState = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    employeeId: '',
    department: '',
    role: 'RECRUITER',
    isActive: true,
    timezone: ''
  };

  const [formData, setFormData] = useState(emptyFormState);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      setShowAddModal(false);
      setFormData(emptyFormState);
      fetchUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create user.';
      alert(errorMessage);
      console.error('Error creating user:', error);
    }
  };

  const openUpdateModal = (userData) => {
    setSelectedUserId(userData.id);
    setFormData({
      username: userData.username || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      password: '', // Keep blank unless resetting password
      phoneNumber: userData.phoneNumber || '',
      employeeId: userData.employeeId || '',
      department: userData.department || '',
      role: userData.role || 'RECRUITER',
      isActive: userData.isActive ?? true,
      timezone: userData.timezone || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(selectedUserId, formData);
      setShowUpdateModal(false);
      setSelectedUserId(null);
      setFormData(emptyFormState);
      fetchUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update user.';
      alert(errorMessage);
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user.';
        alert(errorMessage);
        console.error('Error deleting user:', error);
      }
    }
  };

  // Filter users based on logged-in user role permissions
  const filteredUsers = users.filter((u) => {
    const userRole = String(u.role || '').toUpperCase();
    if (isAdmin) return true;
    if (isCoordinator) {
      return userRole === 'RECRUITER' || userRole === 'INTERVIEWER';
    }
    return false;
  });

  return (
    <div className="content-section" style={{ margin: '32px' }}>
      <div className="section-header">
        <div>
          <h2>User Management Portal</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
            Manage system administrators, recruiters, interviewers, and coordinators. Click a user name to view extended profile attributes.
          </p>
        </div>
        <button 
          className="action-btn" 
          onClick={() => { 
            setFormData(emptyFormState); 
            setShowAddModal(true); 
          }}
        >
          + Add User
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Loading user directory...</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isExpanded = !!expandedRows[u.id];
                  return (
                    <React.Fragment key={u.id}>
                      <tr className="hover:bg-gray-50 transition">
                        <td>{u.id}</td>
                        <td>
                          <button 
                            onClick={() => toggleRow(u.id)} 
                            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', padding: 0, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <span>{isExpanded ? '▼' : '▶'}</span>
                            {u.firstName} {u.lastName}
                          </button>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.department || 'N/A'}</td>
                        <td>
                          <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ background: u.isActive ? '#dcfce7' : '#fee2e2', color: u.isActive ? '#166534' : '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="edit-btn" 
                            onClick={() => openUpdateModal(u)}
                            style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '600', cursor: 'pointer', marginRight: '10px' }}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDelete(u.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Details Drawer */}
                      {isExpanded && (
                        <tr style={{ background: '#f8fafc' }}>
                          <td colSpan="7" style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Username</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{u.username}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Employee ID</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{u.employeeId || 'N/A'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Phone Number</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{u.phoneNumber || 'N/A'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Timezone</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{u.timezone || 'UTC'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Created Date</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{u.createdDate ? new Date(u.createdDate).toLocaleString() : 'N/A'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Last Login</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No system users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>Create New System User</h3>
            <form onSubmit={handleCreateSubmit} autoComplete="off">
              <div className="form-group">
                <label>Username *</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} required maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required maxLength={100} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Password * (Min 6 chars)</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength={6} autoComplete="new-password" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} maxLength={20} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Employee ID</label>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleInputChange} maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <input type="text" name="timezone" value={formData.timezone} onChange={handleInputChange} placeholder="e.g. Asia/Kolkata" maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select name="role" value={formData.role} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}>
                  <option value="RECRUITER">RECRUITER</option>
                  <option value="INTERVIEWER">INTERVIEWER</option>
                  {isAdmin && (
                    <>
                      <option value="COORDINATOR">COORDINATOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </>
                  )}
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} style={{ width: '18px', height: '18px' }} />
                <label htmlFor="isActive" style={{ margin: 0, cursor: 'pointer' }}>Active Account</label>
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="submit-btn" style={{ background: '#10b981', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save User</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)} style={{ background: '#e2e8f0', color: '#334155', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      {showUpdateModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>Update User Profile</h3>
            <form onSubmit={handleUpdateSubmit} autoComplete="off">
              <div className="form-group">
                <label>Username *</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} required maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required maxLength={100} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Password (Leave blank to keep existing)</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter new password if changing" autoComplete="new-password" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} maxLength={20} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Employee ID</label>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleInputChange} maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <input type="text" name="timezone" value={formData.timezone} onChange={handleInputChange} maxLength={50} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select name="role" value={formData.role} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}>
                  <option value="RECRUITER">RECRUITER</option>
                  <option value="INTERVIEWER">INTERVIEWER</option>
                  {isAdmin && (
                    <>
                      <option value="COORDINATOR">COORDINATOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </>
                  )}
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="updateIsActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} style={{ width: '18px', height: '18px' }} />
                <label htmlFor="updateIsActive" style={{ margin: 0, cursor: 'pointer' }}>Active Account</label>
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="submit-btn" style={{ background: '#10b981', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Update Record</button>
                <button type="button" className="cancel-btn" onClick={() => setShowUpdateModal(false)} style={{ background: '#e2e8f0', color: '#334155', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;