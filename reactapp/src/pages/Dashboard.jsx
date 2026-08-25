import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { interviewService } from '../services/interviewService';
import { candidateService } from '../services/candidateService';
import { jobService } from '../services/jobService';
import { jobApplicationService } from '../services/jobApplicationService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTokenPayload = () => {
    if (!user?.token) return {};
    try { return JSON.parse(atob(user.token.split('.')[1])); } catch { return {}; }
  };

  const tokenPayload = getTokenPayload();
  const roleString = (tokenPayload.roles || tokenPayload.role || user?.role || '').toString().toUpperCase();
  const currentUserId = tokenPayload.id || tokenPayload.userId || user?.id;

  const isAdmin = roleString.includes('ADMIN');
  const isRecruiter = roleString.includes('RECRUITER');
  const isInterviewer = roleString.includes('INTERVIEWER');
  const isCoordinator = roleString.includes('COORDINATOR');

  const getRoleBadge = () => {
    if (isAdmin) return { label: 'Administrator', color: '#ef4444', bg: '#fee2e2' };
    if (isRecruiter) return { label: 'Recruiter', color: '#3b82f6', bg: '#dbeafe' };
    if (isInterviewer) return { label: 'Interviewer', color: '#8b5cf6', bg: '#ede9fe' };
    if (isCoordinator) return { label: 'Coordinator', color: '#f59e0b', bg: '#fef3c7' };
    return { label: 'User', color: '#64748b', bg: '#f1f5f9' };
  };

  const badge = getRoleBadge();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const promises = [interviewService.getAllInterviews()];
      if (isAdmin || isRecruiter || isCoordinator) {
        promises.push(candidateService.getAllCandidates());
        promises.push(jobService.getAllJobs());
        promises.push(jobApplicationService.getAllApplications());
      }
      const results = await Promise.allSettled(promises);
      setInterviews(results[0].status === 'fulfilled' ? results[0].value || [] : []);
      setCandidates(results[1]?.status === 'fulfilled' ? results[1].value || [] : []);
      setJobs(results[2]?.status === 'fulfilled' ? results[2].value || [] : []);
      setApplications(results[3]?.status === 'fulfilled' ? results[3].value || [] : []);
    } catch (e) {
      console.error('Dashboard load error', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Computed metrics
  const now = new Date();
  const upcomingInterviews = interviews.filter(i => i.status === 'SCHEDULED' || i.status === 'CONFIRMED');
  const completedInterviews = interviews.filter(i => i.status === 'COMPLETED');
  const pendingFeedback = completedInterviews.filter(i => !i.feedback);
  const myInterviews = interviews; // All fetched interviews (backend already filters by role implicitly)
  const activeJobs = jobs.filter(j => j.status === 'ACTIVE' || j.status === 'OPEN');
  const shortlisted = applications.filter(a => a.status === 'SHORTLISTED');

  const statusBadgeStyle = (status) => {
    const map = {
      SCHEDULED:  { background: '#dbeafe', color: '#1e40af' },
      CONFIRMED:  { background: '#d1fae5', color: '#065f46' },
      COMPLETED:  { background: '#f3e8ff', color: '#6d28d9' },
      CANCELLED:  { background: '#fee2e2', color: '#991b1b' },
      RESCHEDULED:{ background: '#fef3c7', color: '#92400e' },
    };
    return map[status] || { background: '#f1f5f9', color: '#475569' };
  };

  const displayName = user?.firstName || tokenPayload.firstName || user?.email?.split('@')[0] || 'there';

  return (
    <>
      {/* Top Header */}
      <header className="dashboard-header" style={{ padding: '24px 32px', borderBottom: '1px solid var(--header-border, #e2e8f0)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: 'var(--header-text, #0f172a)' }}>
              Welcome back, {displayName} 👋
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>
              Here's what's happening in your workspace today.
            </p>
          </div>
          <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: badge.bg, color: badge.color, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {badge.label}
          </span>
        </div>
      </header>

      <div style={{ padding: '28px 32px' }}>

        {/* ===================== ADMIN DASHBOARD ===================== */}
        {isAdmin && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Total Interviews', value: interviews.length, icon: '📅', color: '#3b82f6', trend: `${upcomingInterviews.length} upcoming` },
                { label: 'Candidates', value: candidates.length, icon: '👥', color: '#10b981', trend: `${shortlisted.length} shortlisted` },
                { label: 'Active Job Posts', value: activeJobs.length, icon: '💼', color: '#8b5cf6', trend: `${jobs.length} total` },
                { label: 'Pending Feedback', value: pendingFeedback.length, icon: '⭐', color: '#f59e0b', trend: `${completedInterviews.length} completed` },
                { label: 'Applications', value: applications.length, icon: '📝', color: '#06b6d4', trend: `${shortlisted.length} shortlisted` },
              ].map(card => (
                <div key={card.label} className="metric-card" style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{card.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: card.color, background: `${card.color}15`, padding: '3px 8px', borderRadius: '12px' }}>{card.trend}</span>
                  </div>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: card.color }}>{isLoading ? '...' : card.value}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '4px' }}>{card.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===================== RECRUITER DASHBOARD ===================== */}
        {isRecruiter && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Total Candidates', value: candidates.length, icon: '👥', color: '#3b82f6' },
                { label: 'Active Jobs', value: activeJobs.length, icon: '💼', color: '#10b981' },
                { label: 'Applications', value: applications.length, icon: '📝', color: '#8b5cf6' },
                { label: 'Shortlisted', value: shortlisted.length, icon: '🎯', color: '#f59e0b' },
                { label: 'Feedback Pending', value: pendingFeedback.length, icon: '⭐', color: '#ef4444' },
              ].map(card => (
                <div key={card.label} className="metric-card" style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{card.icon}</div>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: card.color }}>{isLoading ? '...' : card.value}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '4px' }}>{card.label}</div>
                </div>
              ))}
            </div>
            {/* Pipeline breakdown */}
            <div style={{ background: 'var(--card-bg,#fff)', border: '1px solid var(--card-border,#e2e8f0)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-color,#1e293b)' }}>Pipeline Stage Distribution</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['APPLIED','REVIEWING','SHORTLISTED','INTERVIEWING','ACCEPTED','REJECTED'].map(stage => {
                  const count = applications.filter(a => a.status === stage).length;
                  const colors = { APPLIED:'#3b82f6', REVIEWING:'#f59e0b', SHORTLISTED:'#8b5cf6', INTERVIEWING:'#06b6d4', ACCEPTED:'#10b981', REJECTED:'#ef4444' };
                  return (
                    <div key={stage} style={{ textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: colors[stage] }}>{count}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>{stage}</div>
                      <div style={{ height: '4px', borderRadius: '2px', background: colors[stage], marginTop: '4px', width: `${Math.max(8, (count / Math.max(applications.length, 1)) * 80)}%`, minWidth: '8px' }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ===================== INTERVIEWER DASHBOARD ===================== */}
        {isInterviewer && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Assigned Sessions', value: interviews.length, icon: '📅', color: '#3b82f6' },
                { label: 'Upcoming', value: upcomingInterviews.length, icon: '⏰', color: '#10b981' },
                { label: 'Completed', value: completedInterviews.length, icon: '✅', color: '#8b5cf6' },
                { label: 'Feedback Due', value: pendingFeedback.length, icon: '📝', color: '#f59e0b' },
              ].map(card => (
                <div key={card.label} className="metric-card" style={{ background: 'var(--card-bg, #fff)', border: `2px solid ${card.color}30`, borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{card.icon}</div>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: card.color }}>{isLoading ? '...' : card.value}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '4px' }}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* Feedback Action Reminder */}
            {pendingFeedback.length > 0 && (
              <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fef9ee)', border: '1px solid #fcd34d', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '28px' }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#92400e', fontSize: '14px' }}>Action Required</div>
                  <div style={{ fontSize: '13px', color: '#78350f' }}>
                    You have <strong>{pendingFeedback.length}</strong> interview(s) awaiting feedback submission. Go to <strong>Interviews</strong> → COMPLETED status to submit.
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===================== COORDINATOR DASHBOARD ===================== */}
        {isCoordinator && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Total Scheduled', value: upcomingInterviews.length, icon: '📅', color: '#3b82f6' },
                { label: 'Completed', value: completedInterviews.length, icon: '✅', color: '#10b981' },
                { label: 'Candidates', value: candidates.length, icon: '👥', color: '#8b5cf6' },
                { label: 'Active Jobs', value: activeJobs.length, icon: '💼', color: '#f59e0b' },
              ].map(card => (
                <div key={card.label} className="metric-card" style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{card.icon}</div>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: card.color }}>{isLoading ? '...' : card.value}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '4px' }}>{card.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===================== UPCOMING INTERVIEWS TABLE — All Roles ===================== */}
        <section className="content-section" style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-color, #1e293b)' }}>
              {isInterviewer ? '🗓 My Assigned Sessions' : '🗓 Upcoming Interviews'}
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{upcomingInterviews.length} sessions</span>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--table-border, #e2e8f0)', color: 'var(--table-th-text, #475569)', background: 'var(--table-th-bg, #f8fafc)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700' }}>Candidate</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700' }}>Job Title</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700' }}>Date</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700' }}>Time</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700' }}>Type</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(isInterviewer ? upcomingInterviews : upcomingInterviews).slice(0, 8).map(item => {
                    const bs = statusBadgeStyle(item.status);
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--table-border, #f1f5f9)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--row-hover-bg, #f8fafc)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '11px 14px', fontWeight: '600', fontSize: '13px', color: 'var(--table-td-text, #334155)' }}>{item.candidateName || '—'}</td>
                        <td style={{ padding: '11px 14px', fontSize: '13px', color: 'var(--table-td-text, #334155)' }}>{item.jobPositionTitle || '—'}</td>
                        <td style={{ padding: '11px 14px', fontSize: '13px', color: '#64748b' }}>{item.scheduledDate || '—'}</td>
                        <td style={{ padding: '11px 14px', fontSize: '13px', color: '#64748b' }}>{item.scheduledTime ? item.scheduledTime.substring(0, 5) : '—'}</td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>{item.interviewType || '—'}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ ...bs, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{item.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {upcomingInterviews.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '28px', color: '#94a3b8', fontSize: '14px' }}>
                        🎉 No upcoming interviews scheduled.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ===================== RECENT COMPLETED INTERVIEWS ===================== */}
        {(isAdmin || isRecruiter || isCoordinator) && completedInterviews.length > 0 && (
          <section style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '14px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-color, #1e293b)' }}>✅ Recently Completed</h3>
            <div className="table-responsive">
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--table-border, #e2e8f0)', color: 'var(--table-th-text, #475569)', background: 'var(--table-th-bg, #f8fafc)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700' }}>Candidate</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700' }}>Job</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700' }}>Date</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700' }}>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {completedInterviews.slice(0, 5).map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--table-border, #f1f5f9)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--row-hover-bg, #f8fafc)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '11px 14px', fontWeight: '600', fontSize: '13px', color: 'var(--table-td-text, #334155)' }}>{item.candidateName || '—'}</td>
                      <td style={{ padding: '11px 14px', fontSize: '13px', color: 'var(--table-td-text, #334155)' }}>{item.jobPositionTitle || '—'}</td>
                      <td style={{ padding: '11px 14px', fontSize: '13px', color: '#64748b' }}>{item.scheduledDate || '—'}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: item.feedback ? '#d1fae5' : '#fee2e2', color: item.feedback ? '#065f46' : '#991b1b' }}>
                          {item.feedback ? '✓ Submitted' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Dashboard;