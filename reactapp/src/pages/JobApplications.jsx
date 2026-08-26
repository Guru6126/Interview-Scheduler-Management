import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobApplicationService } from '../services/jobApplicationService';
import { candidateService } from '../services/candidateService';
import { jobService } from '../services/jobService';
import './Dashboard.css';

const PIPELINE_STAGES = ['APPLIED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWING', 'ACCEPTED', 'REJECTED'];

const STAGE_META = {
  APPLIED:      { label: 'Applied',      color: '#3b82f6', bg: '#eff6ff', darkBg: '#1e3a5f' },
  REVIEWING:    { label: 'Screening',    color: '#f59e0b', bg: '#fffbeb', darkBg: '#3f2c0b' },
  SHORTLISTED:  { label: 'Shortlisted',  color: '#8b5cf6', bg: '#f5f3ff', darkBg: '#2e1a5e' },
  INTERVIEWING: { label: 'Interviewing', color: '#06b6d4', bg: '#ecfeff', darkBg: '#0e3040' },
  ACCEPTED:     { label: 'Hired',        color: '#10b981', bg: '#f0fdf4', darkBg: '#0e2e1f' },
  REJECTED:     { label: 'Rejected',     color: '#ef4444', bg: '#fef2f2', darkBg: '#3a0e0e' },
};

const JobApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ candidateId: '', jobPositionId: '' });
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const getTokenPayload = () => {
    if (!user?.token) return {};
    try { return JSON.parse(atob(user.token.split('.')[1])); } catch { return {}; }
  };
  const tokenPayload = getTokenPayload();
  const roleString = (tokenPayload.roles || tokenPayload.role || user?.role || '').toString().toUpperCase();
  const canManage = roleString.includes('ADMIN') || roleString.includes('RECRUITER') || roleString.includes('COORDINATOR');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [appData, candData, jobData] = await Promise.all([
        jobApplicationService.getAllApplications(),
        candidateService.getAllCandidates(),
        jobService.getAllJobs()
      ]);
      setApplications(appData || []);
      setCandidates(candData || []);
      setJobs(jobData || []);
    } catch (e) {
      console.error('Failed to load applications', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await jobApplicationService.updateApplicationStatus(appId, newStatus);
      
      // Sync candidate profile status in backend
      const targetApp = applications.find(a => a.id === appId);
      if (targetApp && targetApp.candidateId) {
        let candidateStatusToSync = null;
        if (newStatus === 'ACCEPTED') candidateStatusToSync = 'HIRED';
        else if (newStatus === 'REJECTED') candidateStatusToSync = 'REJECTED';
        else if (newStatus === 'REVIEWING') candidateStatusToSync = 'SCREENING';
        else if (newStatus === 'INTERVIEWING') candidateStatusToSync = 'INTERVIEWING';
        else if (newStatus === 'APPLIED') candidateStatusToSync = 'APPLIED';

        if (candidateStatusToSync) {
          const candidateObj = candidates.find(c => c.id === targetApp.candidateId);
          if (candidateObj) {
            await candidateService.updateCandidate(targetApp.candidateId, {
              ...candidateObj,
              status: candidateStatusToSync
            });
          }
        }
      }

      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (e) {
      console.error('Failed to update status', e);
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      await jobApplicationService.applyToJob({
        candidateId: Number(applyForm.candidateId),
        jobPositionId: Number(applyForm.jobPositionId)
      });
      setShowApplyModal(false);
      loadAll();
    } catch (e) {
      alert('Failed to create application.');
    }
  };

  const getByStage = (stage) => applications.filter(a => a.status === stage);

  const totalByStage = (stage) => applications.filter(a => a.status === stage).length;

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '16px', color: '#64748b' }}>
      <div style={{ fontSize: '48px' }}>📋</div>
      <p style={{ fontSize: '16px' }}>Loading applications pipeline...</p>
    </div>
  );

  return (
    <div style={{ padding: '32px', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-color, #1e293b)' }}>Application Pipeline</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>Track candidates through each stage of the hiring funnel.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {canManage && (
            <button onClick={() => setShowApplyModal(true)} style={{ background: '#10b981', color: '#fff', padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
              + New Application
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats Row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {PIPELINE_STAGES.map(stage => {
          const meta = STAGE_META[stage];
          return (
            <div key={stage} style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '10px', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '100px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: meta.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{meta.label}</span>
              <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-color, #1e293b)' }}>{totalByStage(stage)}</span>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {PIPELINE_STAGES.map(stage => {
          const meta = STAGE_META[stage];
          const stageApps = getByStage(stage);
          return (
            <div 
              key={stage} 
              onDragOver={(e) => {
                if (canManage) e.preventDefault();
              }}
              onDrop={(e) => {
                if (!canManage) return;
                e.preventDefault();
                const appId = e.dataTransfer.getData('text/plain');
                if (appId) {
                  handleStatusChange(Number(appId), stage);
                }
              }}
              style={{ 
                background: 'var(--card-bg, #f8fafc)', 
                borderRadius: '12px', 
                border: `1px solid var(--card-border, #e2e8f0)`, 
                minHeight: '320px', 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden' 
              }}
            >
              {/* Column Header */}
              <div style={{ padding: '14px 16px', background: meta.color, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{meta.label}</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '700' }}>{stageApps.length}</span>
              </div>

              {/* Cards */}
              <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '420px' }}>
                {stageApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '13px' }}>No candidates here</div>
                ) : stageApps.map(app => (
                  <div 
                    key={app.id} 
                    draggable={canManage}
                    onDragStart={(e) => {
                      if (canManage) {
                        e.dataTransfer.setData('text/plain', String(app.id));
                        e.dataTransfer.effectAllowed = 'move';
                      }
                    }}
                    style={{ 
                      background: 'var(--card-bg, #ffffff)', 
                      border: '1px solid var(--card-border, #e2e8f0)', 
                      borderRadius: '10px', 
                      padding: '12px 14px', 
                      boxShadow: '0 1px 4px rgba(0,0,0,0.05)', 
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      cursor: canManage ? 'grab' : 'default',
                      opacity: updatingId === app.id ? 0.5 : 1
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}
                  >
                    {/* Candidate Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${meta.color}, ${meta.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '15px', flexShrink: 0 }}>
                        {(app.candidateName || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-color, #1e293b)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.candidateName || 'Candidate'}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{app.jobPositionTitle || 'Position'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--card-bg, #1e293b)', color: 'var(--header-text, #f8fafc)', padding: '28px', borderRadius: '12px', width: '440px', maxWidth: '90%', border: '1px solid var(--card-border, #334155)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <h3 style={{ margin: '0 0 6px 0' }}>New Application</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px 0' }}>Link a candidate to a job opening.</p>
            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#94a3b8' }}>Candidate</label>
                <select value={applyForm.candidateId} onChange={e => setApplyForm({ ...applyForm, candidateId: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }} required>
                  <option value="">-- Select Candidate --</option>
                  {candidates.filter(c => c.status?.toUpperCase() !== 'HIRED').map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#94a3b8' }}>Job Position</label>
                <select value={applyForm.jobPositionId} onChange={e => setApplyForm({ ...applyForm, jobPositionId: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }} required>
                  <option value="">-- Select Job --</option>
                  {jobs.filter(j => j.status?.toUpperCase() === 'OPEN').map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowApplyModal(false)} style={{ padding: '10px 18px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#10b981', border: 'none', color: '#fff', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}>Create Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;
