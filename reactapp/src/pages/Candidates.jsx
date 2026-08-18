import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Candidates.css';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal visibility states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  // Form and selection state
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', resumeUrl: '' });
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/candidates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/candidates', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', resumeUrl: '' });
      fetchCandidates();
    } catch (error) {
      console.error('Error creating candidate:', error);
    }
  };

  const openUpdateModal = (candidate) => {
    setSelectedCandidateId(candidate.id);
    setFormData({ 
      name: candidate.name || '', 
      email: candidate.email || '', 
      phone: candidate.phone || '', 
      resumeUrl: candidate.resumeUrl || '' 
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/candidates/${selectedCandidateId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowUpdateModal(false);
      setSelectedCandidateId(null);
      setFormData({ name: '', email: '', phone: '', resumeUrl: '' });
      fetchCandidates();
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/candidates/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCandidates();
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  return (
    <div className="candidates-container">
      <div className="section-header">
        <h2>Candidate Management</h2>
        <button 
          className="action-btn" 
          onClick={() => { 
            setFormData({ name: '', email: '', phone: '', resumeUrl: '' }); 
            setShowAddModal(true); 
          }}
        >
          + Add Candidate
        </button>
      </div>

      {loading ? (
        <p>Loading candidate profiles...</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Candidate Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.id}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone || 'N/A'}</td>
                    <td>
                      <button className="edit-btn" onClick={() => openUpdateModal(candidate)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(candidate.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No candidate records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Add New Candidate</h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Candidate Modal */}
      {showUpdateModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Update Candidate</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Update</button>
                <button type="button" className="cancel-btn" onClick={() => setShowUpdateModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;