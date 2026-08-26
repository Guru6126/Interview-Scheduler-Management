import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';
import './Dashboard.css';

const JobPosts = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Helper to extract token payload safely
  const getTokenPayload = () => {
    if (!user?.token) return {};
    try {
      return JSON.parse(atob(user.token.split('.')[1]));
    } catch (e) {
      console.error("Could not decode token", e);
      return {};
    }
  };

  const tokenPayload = getTokenPayload();

  // Flexible user ID extractor modeled after getUserRole
  const getUserId = () => {
    const possibleId = tokenPayload.id || tokenPayload.userId || tokenPayload.uid || tokenPayload.sub;
    if (possibleId && !isNaN(possibleId)) {
      return Number(possibleId);
    }
    return 1; // Fallback ID if none found in token
  };

  const currentUserId = getUserId();

  // Flexible role extractor
  const getUserRole = () => {
    const roles = tokenPayload.roles || tokenPayload.role || '';
    if (Array.isArray(roles)) {
      return roles.join(',').toUpperCase();
    }
    return String(roles).toUpperCase();
  };

  const roleString = getUserRole();
  const canManageJobs = roleString.includes('ADMIN') || roleString.includes('RECRUITER');

  const emptyJobState = {
    creatorId: currentUserId,
    title: '',
    department: '',
    description: '',
    employmentType: 'FULL_TIME',
    location: '',
    salaryMin: '',
    salaryMax: '',
    requirements: '',
    responsibilities: '',
    status: 'OPEN'
  };

  const [formData, setFormData] = useState(emptyJobState);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch job posts:", error);
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
    const payload = {
      ...formData,
      creatorId: Number(currentUserId),
      salaryMin: formData.salaryMin !== '' ? Number(formData.salaryMin) : null,
      salaryMax: formData.salaryMax !== '' ? Number(formData.salaryMax) : null,
    };
    try {
      await jobService.createJob(payload);
      setShowAddModal(false);
      setFormData(emptyJobState);
      fetchJobs();
    } catch (error) {
      console.error("Error creating job post:", error);
      alert("Failed to create job post. Check console for details.");
    }
  };

  const openUpdateModal = (job) => {
    setSelectedJobId(job.id);
    setFormData({
      creatorId: job.creatorId || currentUserId,
      title: job.title || '',
      department: job.department || '',
      description: job.description || '',
      employmentType: job.employmentType || 'FULL_TIME',
      location: job.location || '',
      salaryMin: job.salaryMin ?? '',
      salaryMax: job.salaryMax ?? '',
      requirements: job.requirements || '',
      responsibilities: job.responsibilities || '',
      status: job.status || 'OPEN'
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      creatorId: Number(formData.creatorId || currentUserId),
      salaryMin: formData.salaryMin !== '' ? Number(formData.salaryMin) : null,
      salaryMax: formData.salaryMax !== '' ? Number(formData.salaryMax) : null,
    };
    try {
      await jobService.updateJob(selectedJobId, payload);
      setShowUpdateModal(false);
      setSelectedJobId(null);
      setFormData(emptyJobState);
      fetchJobs();
    } catch (error) {
      console.error("Error updating job post:", error);
      alert("Failed to update job post.");
    }
  };

  const handleClosePost = async (id) => {
    if (!window.confirm("Are you sure you want to close this job post?")) return;
    try {
      const jobToUpdate = jobs.find(j => j.id === id);
      if (jobToUpdate) {
        await jobService.updateJob(id, { ...jobToUpdate, status: 'CLOSED' });
        fetchJobs();
      }
    } catch (error) {
      console.error("Failed to close job post:", error);
      alert("Error closing job post.");
    }
  };

  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const filteredJobs = safeJobs.filter(job => {
    if (filter === 'ALL') return true;
    return job.status?.toUpperCase() === filter;
  });

  if (loading) {
    return <div className="content-section" style={{ margin: '32px', textAlign: 'center' }}>Loading job posts...</div>;
  }

  return (
    <div className="content-section" style={{ margin: '32px' }}>
      <div className="section-header">
        <div>
          <h2>Job Posts Management</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
            {canManageJobs 
              ? "Manage open roles, track applicant counts, and create new job listings." 
              : "View available job criteria and position details."}
          </p>
        </div>
        {canManageJobs && (
          <button 
            className="action-btn"
            onClick={() => {
              setFormData({ ...emptyJobState, creatorId: currentUserId });
              setShowAddModal(true);
            }}
          >
            + Create Job Post
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['ALL', 'OPEN', 'DRAFT', 'CLOSED', 'ON_HOLD'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: filter === status ? '#10b981' : '#ffffff',
              color: filter === status ? '#ffffff' : '#334155',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Department</th>
              <th>Type</th>
              <th>Applicants</th>
              <th>Posted Date</th>
              <th>Status</th>
              {canManageJobs && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td><strong>{job.title}</strong></td>
                  <td>{job.department}</td>
                  <td>{job.employmentType}</td>
                  <td>{job.jobApplications?.length || 0} Candidates</td>
                  <td>{job.createdDate ? job.createdDate.substring(0, 10) : 'N/A'}</td>
                  <td>
                    <span className={`badge ${job.status === 'OPEN' ? 'confirmed' : 'completed'}`}>
                      {job.status}
                    </span>
                  </td>
                  {canManageJobs && (
                    <td>
                      {job.status === 'CLOSED' ? (
                        <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>N/A</span>
                      ) : (
                        <>
                          <button 
                            onClick={() => openUpdateModal(job)}
                            style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '600', cursor: 'pointer', marginRight: '10px' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleClosePost(job.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Close Post
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canManageJobs ? 7 : 6} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No job posts found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {(showAddModal || showUpdateModal) && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>{showAddModal ? 'Create New Job Post' : 'Edit Job Post'}</h3>
            <form onSubmit={showAddModal ? handleCreateSubmit : handleUpdateSubmit}>
              <div className="form-group">
                <label>Job Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <input type="text" name="department" value={formData.department} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Employment Type *</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div className="form-group">
                <label>Requirements</label>
                <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div className="form-group">
                <label>Responsibilities</label>
                <textarea name="responsibilities" value={formData.responsibilities} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Salary Min</label>
                  <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleInputChange} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Salary Max</label>
                  <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select name="status" value={formData.status} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}>
                  <option value="OPEN">Open</option>
                  <option value="DRAFT">Draft</option>
                  <option value="CLOSED">Closed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="submit-btn" style={{ background: '#10b981', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  {showAddModal ? 'Save Job' : 'Update Job'}
                </button>
                <button type="button" className="cancel-btn" onClick={() => { setShowAddModal(false); setShowUpdateModal(false); }} style={{ background: '#e2e8f0', color: '#334155', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPosts;