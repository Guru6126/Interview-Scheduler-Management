import React, { useState } from 'react';

export default function InterviewFeedbackModal({ isOpen, onClose, onSubmit, interview }) {
  const [formData, setFormData] = useState({
    rating: 5,
    comments: '',
    recommendation: 'RECOMMENDED' // e.g., RECOMMENDED, REJECTED, ON_HOLD
  });

  if (!isOpen || !interview) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(interview.id, formData);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'var(--card-bg, #1e293b)', color: 'var(--header-text, #f8fafc)', padding: '24px', borderRadius: '12px', width: '450px', maxWidth: '90%', border: '1px solid var(--card-border, #334155)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <h3 style={{ margin: '0 0 4px 0' }}>Submit Interview Feedback</h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0' }}>
          Candidate for: <strong>{interview.jobTitle || interview.job || 'Role'}</strong>
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Rating Score */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>Rating (1 - 5)</label>
            <input 
              type="number" 
              min="1" 
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
              required
            />
          </div>

          {/* Feedback Comments */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>Detailed Comments & Notes</label>
            <textarea 
              rows="4"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Enter technical skills, communication, and overall performance notes..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)', resize: 'vertical' }}
              required
            />
          </div>

          {/* Recommendation Decision */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>Recommendation Status</label>
            <select 
              value={formData.recommendation} 
              onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
            >
              <option value="RECOMMENDED">Recommended (Pass)</option>
              <option value="REJECTED">Not Recommended (Reject)</option>
              <option value="ON_HOLD">On Hold / Second Round</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 16px', background: '#3b82f6', border: 'none', color: '#fff', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}>Submit Feedback</button>
          </div>

        </form>
      </div>
    </div>
  );
}