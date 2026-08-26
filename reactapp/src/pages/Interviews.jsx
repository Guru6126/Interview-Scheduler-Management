import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { interviewService } from '../services/interviewService';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';
import InterviewFeedbackModal from '../components/InterviewFeedbackModal';
import RescheduleModal from '../components/RescheduleModal';
import './Dashboard.css';

const Interviews = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const [interviewsData, setInterviewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  // Helper to extract token payload safely (same pattern as JobPosts)
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

  // Flexible role extractor
  const getUserRole = () => {
    const roles = tokenPayload.roles || tokenPayload.role || user?.role || '';
    if (Array.isArray(roles)) {
      return roles.join(',').toUpperCase();
    }
    return String(roles).toUpperCase();
  };

  const roleString = getUserRole();
  const canManageInterviews = roleString.includes('ADMIN') || roleString.includes('RECRUITER') || roleString.includes('COORDINATOR');
  const canProvideFeedback = roleString.includes('ADMIN') || roleString.includes('INTERVIEWER');
  const canModifyInterviews = roleString.includes('ADMIN') || roleString.includes('COORDINATOR');

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    setIsLoading(true);
    try {
      const data = await interviewService.getAllInterviews();
      setInterviewsData(data || []);
    } catch (error) {
      console.error("Error loading interviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleSubmit = async (formData) => {
    try {
      await interviewService.scheduleInterview(formData);
      setIsScheduleModalOpen(false);
      loadInterviews();
    } catch (error) {
      console.error("Failed to schedule interview:", error);
      alert("Failed to schedule interview. Please check your inputs.");
    }
  };

  const handleFeedbackSubmit = async (interviewId, feedbackData) => {
    try {
      await interviewService.submitFeedback(interviewId, feedbackData);
      setIsFeedbackModalOpen(false);
      loadInterviews();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  const handleCancelInterview = async (id) => {
    if (window.confirm("Are you sure you want to cancel this interview?")) {
      try {
        await interviewService.cancelInterview(id);
        loadInterviews();
      } catch (error) {
        console.error("Failed to cancel interview:", error);
        alert("Failed to cancel interview.");
      }
    }
  };

  const handleReschedule = (interview) => {
    setSelectedInterview(interview);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (newDate, newTime) => {
    if (!selectedInterview) return;
    try {
      await interviewService.rescheduleInterview(selectedInterview.id, newDate, newTime);
      setIsRescheduleModalOpen(false);
      loadInterviews();
    } catch (error) {
      console.error("Failed to reschedule interview:", error);
      alert("Failed to reschedule interview.");
    }
  };

  const filteredInterviews = interviewsData.filter(item => {
    if (filter === 'ALL') return true;
    return item.status?.toUpperCase() === filter;
  });

  return (
    <div className="content-section" style={{ margin: '32px' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Interviews Management</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
            Schedule, track, and manage all candidate interview sessions.
          </p>
        </div>
        {canManageInterviews && (
          <button
            className="action-btn"
            onClick={() => setIsScheduleModalOpen(true)}
            style={{ background: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            + Schedule Interview
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['ALL', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'].map(status => (
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
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '32px' }}>Loading interviews...</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px' }}>Candidate Name</th>
                <th style={{ padding: '12px' }}>Job Title</th>
                <th style={{ padding: '12px' }}>Type</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Time</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterviews.length > 0 ? (
                filteredInterviews.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px' }}><strong>{item.candidateName}</strong></td>
                    <td style={{ padding: '12px' }}>{item.jobPositionTitle}</td>
                    <td style={{ padding: '12px' }}>{item.interviewType}</td>
                    <td style={{ padding: '12px' }}>{item.scheduledDate}</td>
                    <td style={{ padding: '12px' }}>{item.scheduledTime}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${item.status?.toLowerCase()}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: '#e2e8f0' }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {/* Feedback Action */}
                      {canProvideFeedback && item.status !== 'CANCELLED' && (
                        <>
                          {/* View Feedback: interview completed and feedback was already recorded */}
                          {item.feedback && (
                            <button
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#8b5cf6',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginRight: '10px'
                              }}
                              onClick={() => {
                                setSelectedInterview(item);
                                setIsFeedbackModalOpen(true);
                              }}
                            >
                              View Feedback
                            </button>
                          )}

                          {/* Submit Feedback: only allowed when candidate status is INTERVIEWING and no feedback yet */}
                          {!item.feedback && item.candidateStatus === 'INTERVIEWING' && (
                            <button
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#3b82f6',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginRight: '10px'
                              }}
                              onClick={() => {
                                setSelectedInterview(item);
                                setIsFeedbackModalOpen(true);
                              }}
                            >
                              Submit Feedback
                            </button>
                          )}

                          {/* N/A: candidate not in INTERVIEWING stage and no feedback */}
                          {!item.feedback && item.candidateStatus !== 'INTERVIEWING' && (
                            <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>N/A</span>
                          )}
                        </>
                      )}

                      {/* N/A for CANCELLED interviews or non-feedback roles */}
                      {(item.status === 'CANCELLED' || (!canProvideFeedback && item.status === 'COMPLETED')) && (
                        <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>N/A</span>
                      )}

                      {/* Reschedule Action (Only for active sessions: SCHEDULED/CONFIRMED/RESCHEDULED) */}
                      {canModifyInterviews && item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                        <button
                          style={{ background: 'none', border: 'none', color: '#f59e0b', fontWeight: '600', cursor: 'pointer', marginRight: '10px' }}
                          onClick={() => handleReschedule(item)}
                        >
                          Reschedule
                        </button>
                      )}

                      {/* Cancel Action (Only for active sessions: SCHEDULED/CONFIRMED/RESCHEDULED) */}
                      {canModifyInterviews && item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                        <button
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}
                          onClick={() => handleCancelInterview(item.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No interviews found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSubmit={handleScheduleSubmit}
      />

      <InterviewFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        interview={selectedInterview}
      />

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        onSubmit={handleRescheduleSubmit}
        interview={selectedInterview}
      />
    </div>
  );
};

export default Interviews;