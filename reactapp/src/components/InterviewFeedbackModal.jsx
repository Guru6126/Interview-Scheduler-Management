import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { interviewService } from '../services/interviewService';

export default function InterviewFeedbackModal({ isOpen, onClose, onSubmit, interview }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    overallRating: 5,
    technicalSkillsRating: 5,
    communicationRating: 5,
    culturalFitRating: 5,
    problemSolvingRating: 5,
    strengths: '',
    weaknesses: '',
    detailedFeedback: '',
    recommendation: 'RECOMMENDED', // e.g., RECOMMENDED, REJECTED, ON_HOLD
    wouldInterviewAgain: true
  });
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  useEffect(() => {
    if (isOpen && interview) {
      if (interview.feedback) {
        setExistingFeedback(interview.feedback);
      } else if (interview.id) {
        // Check if feedback exists on server
        setIsLoadingFeedback(true);
        interviewService.getFeedbackByInterview(interview.id)
          .then((fb) => {
            setExistingFeedback(fb);
          })
          .catch(() => {
            setExistingFeedback(null);
          })
          .finally(() => {
            setIsLoadingFeedback(false);
          });
      } else {
        setExistingFeedback(null);
      }

      // Reset form
      setFormData({
        overallRating: 5,
        technicalSkillsRating: 5,
        communicationRating: 5,
        culturalFitRating: 5,
        problemSolvingRating: 5,
        strengths: '',
        weaknesses: '',
        detailedFeedback: '',
        recommendation: 'RECOMMENDED',
        wouldInterviewAgain: true
      });
    }
  }, [isOpen, interview]);

  if (!isOpen || !interview) return null;

  const isViewMode = Boolean(existingFeedback);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      interviewerId: interview.interviewerId || interview.interviewer?.id || (user?.id ? Number(user.id) : null)
    };
    onSubmit(interview.id, payload);
    onClose();
  };

  const getRecommendationBadge = (rec) => {
    const r = (rec || '').toUpperCase();
    if (r.includes('RECOMMEND') && !r.includes('REJECT') && !r.includes('NOT')) {
      return { label: 'Recommended (Pass)', bg: '#d1fae5', color: '#065f46' };
    }
    if (r.includes('REJECT')) {
      return { label: 'Not Recommended (Reject)', bg: '#fee2e2', color: '#991b1b' };
    }
    return { label: rec || 'On Hold', bg: '#fef3c7', color: '#92400e' };
  };

  const renderRatingRow = (label, value) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--card-border, #334155)' }}>
      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8' }}>{value || '—'} / 5</span>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
      <div style={{ backgroundColor: 'var(--card-bg, #1e293b)', color: 'var(--header-text, #f8fafc)', padding: '24px', borderRadius: '12px', width: '550px', maxWidth: '95%', border: '1px solid var(--card-border, #334155)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', margin: '40px auto', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
            {isViewMode ? 'Candidate Evaluation Feedback' : 'Submit Interview Feedback'}
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', padding: '0 4px' }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0' }}>
          Candidate: <strong>{interview.candidateName || 'Candidate'}</strong> &nbsp;|&nbsp; Role: <strong>{interview.jobPositionTitle || interview.jobTitle || 'Role'}</strong>
        </p>
        
        {isLoadingFeedback ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Loading evaluation details...</div>
        ) : isViewMode ? (
          /* View Mode */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1, background: 'var(--bg-color, #0f172a)', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border, #334155)' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700' }}>Overall Score</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8' }}>
                  ⭐ {existingFeedback.overallRating || '—'} / 5
                </span>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-color, #0f172a)', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border, #334155)' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700' }}>Decision</span>
                {(() => {
                  const badge = getRecommendationBadge(existingFeedback.recommendation);
                  return (
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Detailed Ratings */}
            <div style={{ background: 'var(--bg-color, #0f172a)', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border, #334155)' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Detailed Ratings</span>
              {renderRatingRow('Technical Skills', existingFeedback.technicalSkillsRating)}
              {renderRatingRow('Communication', existingFeedback.communicationRating)}
              {renderRatingRow('Cultural Fit', existingFeedback.culturalFitRating)}
              {renderRatingRow('Problem Solving', existingFeedback.problemSolvingRating)}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Strengths</span>
                <div style={{ background: 'var(--bg-color, #0f172a)', padding: '10px', borderRadius: '8px', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #f1f5f9)', fontSize: '12px', whiteSpace: 'pre-wrap', minHeight: '60px' }}>
                  {existingFeedback.strengths || 'N/A'}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Weaknesses</span>
                <div style={{ background: 'var(--bg-color, #0f172a)', padding: '10px', borderRadius: '8px', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #f1f5f9)', fontSize: '12px', whiteSpace: 'pre-wrap', minHeight: '60px' }}>
                  {existingFeedback.weaknesses || 'N/A'}
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Interviewer Comments & Notes
              </span>
              <div style={{ 
                background: 'var(--bg-color, #0f172a)', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid var(--card-border, #334155)',
                color: 'var(--text-color, #f1f5f9)',
                fontSize: '13px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                minHeight: '80px'
              }}>
                {existingFeedback.detailedFeedback || 'No detailed comments provided.'}
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#94a3b8', background: 'var(--bg-color, #0f172a)', padding: '10px', borderRadius: '8px', border: '1px solid var(--card-border, #334155)' }}>
              <strong>Would Interview Again?</strong> {existingFeedback.wouldInterviewAgain ? 'Yes' : 'No'}
            </div>

            {existingFeedback.interviewerName && (
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0, textAlign: 'right' }}>
                Evaluated by <strong>{existingFeedback.interviewerName}</strong>
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button 
                type="button" 
                onClick={onClose} 
                style={{ padding: '8px 18px', background: '#3b82f6', border: 'none', color: '#fff', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form Mode */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Overall Rating (1-5)</label>
                <input type="number" min="1" max="5" value={formData.overallRating} onChange={(e) => setFormData({ ...formData, overallRating: Number(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Technical Skills (1-5)</label>
                <input type="number" min="1" max="5" value={formData.technicalSkillsRating} onChange={(e) => setFormData({ ...formData, technicalSkillsRating: Number(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Communication (1-5)</label>
                <input type="number" min="1" max="5" value={formData.communicationRating} onChange={(e) => setFormData({ ...formData, communicationRating: Number(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Cultural Fit (1-5)</label>
                <input type="number" min="1" max="5" value={formData.culturalFitRating} onChange={(e) => setFormData({ ...formData, culturalFitRating: Number(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Problem Solving (1-5)</label>
                <input type="number" min="1" max="5" value={formData.problemSolvingRating} onChange={(e) => setFormData({ ...formData, problemSolvingRating: Number(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Strengths</label>
                <textarea rows="2" value={formData.strengths} onChange={(e) => setFormData({ ...formData, strengths: e.target.value })} placeholder="Key strengths..." style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)', resize: 'vertical' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Weaknesses</label>
                <textarea rows="2" value={formData.weaknesses} onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })} placeholder="Areas for improvement..." style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)', resize: 'vertical' }} />
              </div>
            </div>

            {/* Feedback Comments */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Detailed Comments & Notes</label>
              <textarea 
                rows="3"
                value={formData.detailedFeedback}
                onChange={(e) => setFormData({ ...formData, detailedFeedback: e.target.value })}
                placeholder="Enter general feedback and notes..."
                style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)', resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Recommendation Decision */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Recommendation</label>
                <select 
                  value={formData.recommendation} 
                  onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
                >
                  <option value="RECOMMENDED">Recommended (Pass / Shortlist)</option>
                  <option value="REJECTED">Not Recommended (Reject)</option>
                  <option value="ON_HOLD">On Hold / Further Review</option>
                </select>
              </div>

              {/* Would Interview Again */}
              <div style={{ flex: 1, marginTop: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.wouldInterviewAgain}
                    onChange={(e) => setFormData({ ...formData, wouldInterviewAgain: e.target.checked })}
                  />
                  Would you interview again?
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '10px 16px', background: '#3b82f6', border: 'none', color: '#fff', fontWeight: '600', borderRadius: '6px', cursor: 'pointer' }}>Submit Feedback</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}