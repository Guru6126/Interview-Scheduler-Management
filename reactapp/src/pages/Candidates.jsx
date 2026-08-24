import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { candidateService } from '../services/candidateService';
import './Candidates.css';

const Candidates = () => {
  const { user } = useAuth();
  console.log("Current Logged-in User Object:", user);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Track which rows are expanded to show full details
  const [expandedRows, setExpandedRows] = useState({});
  
  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
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
  // Restrict full management permissions to ADMIN and RECRUITER
  const canManage = roleString.includes('ADMIN') || roleString.includes('RECRUITER');

  // Modal visibility states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  // Comprehensive form state aligned with Spring Boot CandidateRequest DTO
  const emptyFormState = { 
    firstName: '', 
    lastName: '', 
    email: '', 
    phoneNumber: '', 
    status: 'APPLIED',
    currentPosition: '',
    currentCompany: '',
    experienceYears: '',
    expectedSalary: '',
    availabilityDate: '',
    source: '',
    resumeUrl: ''
  };

  const [formData, setFormData] = useState(emptyFormState);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await candidateService.getAllCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert numeric fields appropriately before sending
      const payload = {
        ...formData,
        experienceYears: formData.experienceYears ? Number(formData.experienceYears) : null,
        expectedSalary: formData.expectedSalary ? Number(formData.expectedSalary) : null,
        availabilityDate: formData.availabilityDate || null
      };
      await candidateService.createCandidate(payload);
      setShowAddModal(false);
      setFormData(emptyFormState);
      fetchCandidates();
    } catch (error) {
      console.error('Error creating candidate:', error);
    }
  };

  const openUpdateModal = (candidate) => {
    setSelectedCandidateId(candidate.id);
    setFormData({ 
      firstName: candidate.firstName || '', 
      lastName: candidate.lastName || '', 
      email: candidate.email || '', 
      phoneNumber: candidate.phoneNumber || '',
      status: candidate.status || 'APPLIED',
      currentPosition: candidate.currentPosition || '',
      currentCompany: candidate.currentCompany || '',
      experienceYears: candidate.experienceYears ?? '',
      expectedSalary: candidate.expectedSalary ?? '',
      availabilityDate: candidate.availabilityDate || '',
      source: candidate.source || '',
      resumeUrl: candidate.resumeUrl || ''
    });
    setShowUpdateModal(true);
  };
  
  const openStatusModal = (candidate) => {
    setSelectedCandidateId(candidate.id);
    setFormData({ 
      firstName: candidate.firstName || '', 
      lastName: candidate.lastName || '', 
      email: candidate.email || '', 
      phoneNumber: candidate.phoneNumber || '',
      status: candidate.status || 'APPLIED',
      currentPosition: candidate.currentPosition || '',
      currentCompany: candidate.currentCompany || '',
      experienceYears: candidate.experienceYears ?? '',
      expectedSalary: candidate.expectedSalary ?? '',
      availabilityDate: candidate.availabilityDate || '',
      source: candidate.source || '',
      resumeUrl: candidate.resumeUrl || ''
    });
    setShowStatusModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        experienceYears: formData.experienceYears !== '' ? Number(formData.experienceYears) : null,
        expectedSalary: formData.expectedSalary !== '' ? Number(formData.expectedSalary) : null,
        availabilityDate: formData.availabilityDate || null
      };
      await candidateService.updateCandidate(selectedCandidateId, payload);
      setShowUpdateModal(false);
      setSelectedCandidateId(null);
      setFormData(emptyFormState);
      fetchCandidates();
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };
  
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        experienceYears: formData.experienceYears !== '' ? Number(formData.experienceYears) : null,
        expectedSalary: formData.expectedSalary !== '' ? Number(formData.expectedSalary) : null,
        availabilityDate: formData.availabilityDate || null
      };
      await candidateService.updateCandidate(selectedCandidateId, payload);
      setShowStatusModal(false);
      setSelectedCandidateId(null);
      setFormData(emptyFormState);
      fetchCandidates();
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate record?')) {
      try {
        await candidateService.deleteCandidate(id);
        fetchCandidates();
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  return (
    <div className="content-section" style={{ margin: '32px' }}>
      <div className="section-header">
        <div>
          <h2>Candidate Management</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
            {canManage 
              ? 'Manage applicant pipelines, update profile statuses, and onboard new talent. Click a candidate name to view full profile details.' 
              : 'View candidate profiles and pipeline status metrics.'}
          </p>
        </div>
        {canManage && (
          <button 
            className="action-btn" 
            onClick={() => { 
              setFormData(emptyFormState); 
              setShowAddModal(true); 
            }}
          >
            + Add Candidate
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Loading candidate profiles...</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Candidate Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                {(canManage || isAdmin || isCoordinator) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {candidates.length > 0 ? (
                candidates.map((candidate) => {
                  const isExpanded = !!expandedRows[candidate.id];
                  return (
                    <React.Fragment key={candidate.id}>
                      {/* Main Summary Row */}
                      <tr className="hover:bg-gray-50 transition">
                        <td>{candidate.id}</td>
                        <td>
                          <button 
                            onClick={() => toggleRow(candidate.id)} 
                            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', padding: 0, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <span>{isExpanded ? '▼' : '▶'}</span>
                            {candidate.firstName} {candidate.lastName}
                          </button>
                        </td>
                        <td>{candidate.email}</td>
                        <td>{candidate.phoneNumber || 'N/A'}</td>
                        <td>
                          <span className="badge" style={{ background: '#e2e8f0', color: '#334155', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                            {candidate.status}
                          </span>
                        </td>
                        {(canManage || isAdmin || isCoordinator) && (
                          <td>
                            {canManage && (
                              <button 
                                className="edit-btn" 
                                onClick={() => openUpdateModal(candidate)}
                                style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '600', cursor: 'pointer', marginRight: '10px' }}
                              >
                                Edit
                              </button>
                            )}
                            {isCoordinator && (
                              <button 
                                className="edit-btn" 
                                onClick={() => openStatusModal(candidate)}
                                style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '600', cursor: 'pointer', marginRight: '10px' }}
                              >
                                Update Status
                              </button>
                            )}
                            {isAdmin && (
                              <button 
                                className="delete-btn" 
                                onClick={() => handleDelete(candidate.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        )}
                      </tr>

                      {/* Expandable Details Drawer */}
                      {isExpanded && (
                        <tr style={{ background: '#f8fafc' }}>
                          <td colSpan={(canManage || isAdmin || isCoordinator) ? "6" : "5"} style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Current Position</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{candidate.currentPosition || 'N/A'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Current Company</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{candidate.currentCompany || 'N/A'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Experience</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{candidate.experienceYears != null ? `${candidate.experienceYears} Years` : 'N/A'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Expected Salary</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{candidate.expectedSalary != null ? `$${candidate.expectedSalary}` : 'N/A'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Availability Date</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{candidate.availabilityDate || 'Immediate'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Source</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{candidate.source || 'N/A'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Assigned Recruiter</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{candidate.recruiterName || 'Unassigned'}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Resume Link</span>
                                {candidate.resumeUrl ? (
                                  <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'underline' }}>
                                    View Resume
                                  </a>
                                ) : (
                                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Not Provided</span>
                                )}
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
                  <td colSpan={(canManage || isAdmin || isCoordinator) ? "6" : "5"} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No candidate records found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>Add New Candidate</h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Current Position</label>
                <input type="text" name="currentPosition" value={formData.currentPosition} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Current Company</label>
                <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Expected Salary</label>
                <input type="number" step="0.01" name="expectedSalary" value={formData.expectedSalary} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Availability Date</label>
                <input type="date" name="availabilityDate" value={formData.availabilityDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Source</label>
                <input type="text" name="source" value={formData.source} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Resume URL</label>
                <input type="text" name="resumeUrl" value={formData.resumeUrl} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select name="status" value={formData.status} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}>
                  <option value="APPLIED">Applied</option>
                  <option value="SCREENING">Screening</option>
                  <option value="INTERVIEWING">Interviewing</option>
                  <option value="OFFERED">Offered</option>
                  <option value="HIRED">Hired</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="submit-btn" style={{ background: '#10b981', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Candidate</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)} style={{ background: '#e2e8f0', color: '#334155', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Candidate Modal */}
      {showUpdateModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>Update Candidate Profile</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Current Position</label>
                <input type="text" name="currentPosition" value={formData.currentPosition} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Current Company</label>
                <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Expected Salary</label>
                <input type="number" step="0.01" name="expectedSalary" value={formData.expectedSalary} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Availability Date</label>
                <input type="date" name="availabilityDate" value={formData.availabilityDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Source</label>
                <input type="text" name="source" value={formData.source} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Resume URL</label>
                <input type="text" name="resumeUrl" value={formData.resumeUrl} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select name="status" value={formData.status} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}>
                  <option value="APPLIED">Applied</option>
                  <option value="SCREENING">Screening</option>
                  <option value="INTERVIEWING">Interviewing</option>
                  <option value="OFFERED">Offered</option>
                  <option value="HIRED">Hired</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="submit-btn" style={{ background: '#10b981', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Update Record</button>
                <button type="button" className="cancel-btn" onClick={() => setShowUpdateModal(false)} style={{ background: '#e2e8f0', color: '#334155', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Candidate Status Modal (For Coordinators) */}
      {showStatusModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>Update Candidate Status</h3>
            <p style={{ margin: '8px 0 16px 0', color: '#64748b', fontSize: '14px' }}>
              Updating status for: <strong>{formData.firstName} {formData.lastName}</strong>
            </p>
            <form onSubmit={handleStatusSubmit}>
              <div className="form-group">
                <label>Status *</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleInputChange} 
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
                >
                  <option value="APPLIED">Applied</option>
                  <option value="SCREENING">Screening</option>
                  <option value="INTERVIEWING">Interviewing</option>
                  <option value="OFFERED">Offered</option>
                  <option value="HIRED">Hired</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="submit-btn" style={{ background: '#10b981', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Update Status</button>
                <button type="button" className="cancel-btn" onClick={() => setShowStatusModal(false)} style={{ background: '#e2e8f0', color: '#334155', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;