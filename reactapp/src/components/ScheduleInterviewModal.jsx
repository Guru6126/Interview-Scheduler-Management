import React, { useState, useEffect } from 'react';
import { candidateService } from '../services/candidateService';
import { jobApplicationService } from '../services/jobApplicationService';
import { availabilityService } from '../services/availabilityService';

export default function ScheduleInterviewModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    candidateId: '',
    jobPositionId: '',
    jobPositionTitle: '',
    interviewDate: '',
    interviewTime: '',
    interviewType: 'ONLINE',
    meetingLink: '',
    interviewerId: ''
  });

  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [availableInterviewers, setAvailableInterviewers] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoadingInterviewers, setIsLoadingInterviewers] = useState(false);
  const [hasFetchedInterviewers, setHasFetchedInterviewers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      setFormData({
        candidateId: '',
        jobPositionId: '',
        jobPositionTitle: '',
        interviewDate: '',
        interviewTime: '',
        interviewType: 'ONLINE',
        meetingLink: '',
        interviewerId: ''
      });
      setSelectedCandidate(null);
      setAvailableInterviewers([]);
      setHasFetchedInterviewers(false);
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      const [candidateData, appData] = await Promise.all([
        candidateService.getAllCandidates(),
        jobApplicationService.getAllApplications()
      ]);
      setCandidates(candidateData || []);
      setApplications(appData || []);
    } catch (error) {
      console.error("Failed to load candidates and applications:", error);
    }
  };

  // 1. When Candidate is selected: Derive Job Position & Autofill Availability Date
  const handleCandidateChange = (candId) => {
    if (!candId) {
      setSelectedCandidate(null);
      setFormData(prev => ({
        ...prev,
        candidateId: '',
        jobPositionId: '',
        jobPositionTitle: '',
        interviewDate: '',
        interviewTime: '',
        interviewerId: ''
      }));
      setAvailableInterviewers([]);
      setHasFetchedInterviewers(false);
      return;
    }

    const cand = candidates.find(c => String(c.id) === String(candId));
    setSelectedCandidate(cand || null);

    // Derive linked job position from JobApplication (or fallback from candidate)
    let matchedJobId = '';
    let matchedJobTitle = '';

    const app = applications.find(a => String(a.candidateId) === String(candId));
    if (app) {
      matchedJobId = app.jobPositionId || '';
      matchedJobTitle = app.jobPositionTitle || 'Applied Role';
    }

    const availDate = cand?.availabilityDate || '';

    setFormData(prev => ({
      ...prev,
      candidateId: candId,
      jobPositionId: matchedJobId,
      jobPositionTitle: matchedJobTitle,
      interviewDate: availDate,
      interviewTime: '',
      interviewerId: ''
    }));

    setAvailableInterviewers([]);
    setHasFetchedInterviewers(false);
  };

  // 2. Dynamic Smart Interviewer Filtering when Date and Time are set
  useEffect(() => {
    if (formData.interviewDate && formData.interviewTime) {
      fetchAvailableInterviewers(formData.interviewDate, formData.interviewTime);
    } else {
      setAvailableInterviewers([]);
      setHasFetchedInterviewers(false);
    }
  }, [formData.interviewDate, formData.interviewTime]);

  const fetchAvailableInterviewers = async (date, time) => {
    setIsLoadingInterviewers(true);
    setHasFetchedInterviewers(true);
    try {
      const interviewers = await availabilityService.getAvailableInterviewers(date, time, 60);
      setAvailableInterviewers(interviewers || []);
      // If current selected interviewer is not in the filtered list, reset it
      if (formData.interviewerId && !interviewers.some(i => String(i.id) === String(formData.interviewerId))) {
        setFormData(prev => ({ ...prev, interviewerId: '' }));
      }
    } catch (error) {
      console.error("Failed to fetch available interviewers:", error);
      setAvailableInterviewers([]);
    } finally {
      setIsLoadingInterviewers(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.candidateId) {
      alert("Please select a candidate.");
      return;
    }
    if (!formData.jobPositionId) {
      alert("No job position linked to this candidate's application. Please link an application first.");
      return;
    }
    if (!formData.interviewDate || !formData.interviewTime) {
      alert("Please specify interview date and time slot.");
      return;
    }
    if (!formData.interviewerId) {
      alert("Please select an available interviewer.");
      return;
    }

    const payload = {
      candidateId: Number(formData.candidateId),
      jobPositionId: Number(formData.jobPositionId),
      scheduledDate: formData.interviewDate,
      scheduledTime: formData.interviewTime.length === 5 ? `${formData.interviewTime}:00` : formData.interviewTime,
      interviewType: formData.interviewType,
      meetingLink: formData.meetingLink || '',
      status: "SCHEDULED",
      interviewerId: Number(formData.interviewerId)
    };

    console.log("Outgoing Schedule Interview Payload:", payload);
    onSubmit(payload);
    onClose();
  };

  const getCandidateName = (cand) => {
    const first = cand.firstName || '';
    const last = cand.lastName || '';
    return `${first} ${last}`.trim() || 'Candidate';
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'var(--card-bg, #1e293b)', color: 'var(--header-text, #f8fafc)', padding: '24px', borderRadius: '12px', width: '480px', maxWidth: '90%', border: '1px solid var(--card-border, #334155)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700' }}>Schedule New Interview</h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0' }}>
          Constraint-driven interview scheduling with automated position & availability binding.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* 1. Candidate Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>
              Select Candidate
            </label>
            <select 
              value={formData.candidateId} 
              onChange={(e) => handleCandidateChange(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
              required
            >
              <option value="">-- Choose Candidate --</option>
              {candidates.map(cand => (
                <option key={cand.id} value={cand.id}>
                  {getCandidateName(cand)} ({cand.email || 'No Email'})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Derived Job Position Display (Non-editable, auto-derived from Application) */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>
              Job Position (Auto-derived from Application)
            </label>
            <div style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'var(--bg-color, #0f172a)',
              border: '1px solid var(--card-border, #334155)',
              color: formData.jobPositionTitle ? '#38bdf8' : '#64748b',
              fontSize: '13px',
              fontWeight: formData.jobPositionTitle ? '600' : 'normal'
            }}>
              {formData.jobPositionTitle ? `💼 ${formData.jobPositionTitle}` : 'Select a candidate to load target position'}
            </div>
          </div>

          {/* 3. Availability Date (Autofilled from candidate profile) & Time Slot Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>
                Availability Date {selectedCandidate?.availabilityDate ? '(Autofilled)' : ''}
              </label>
              <input 
                type="date"
                value={formData.interviewDate}
                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                readOnly={Boolean(selectedCandidate?.availabilityDate)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: selectedCandidate?.availabilityDate ? 'rgba(15, 23, 42, 0.6)' : 'var(--bg-color, #0f172a)',
                  border: '1px solid var(--card-border, #334155)',
                  color: 'var(--text-color, #fff)',
                  cursor: selectedCandidate?.availabilityDate ? 'not-allowed' : 'auto'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>
                Interview Time Slot
              </label>
              <input 
                type="time" 
                value={formData.interviewTime}
                onChange={(e) => setFormData({ ...formData, interviewTime: e.target.value })}
                disabled={!formData.interviewDate}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--bg-color, #0f172a)',
                  border: '1px solid var(--card-border, #334155)',
                  color: 'var(--text-color, #fff)',
                  opacity: !formData.interviewDate ? 0.6 : 1
                }}
                required
              />
            </div>
          </div>

          {/* 4. Smart Filtered Interviewer Dropdown */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', color: '#94a3b8' }}>
                Select Available Interviewer
              </label>
              {isLoadingInterviewers && (
                <span style={{ fontSize: '11px', color: '#38bdf8' }}>Checking active slots...</span>
              )}
            </div>

            <select 
              value={formData.interviewerId} 
              onChange={(e) => setFormData({ ...formData, interviewerId: e.target.value })}
              disabled={!formData.interviewDate || !formData.interviewTime || isLoadingInterviewers}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'var(--bg-color, #0f172a)',
                border: '1px solid var(--card-border, #334155)',
                color: 'var(--text-color, #fff)',
                opacity: (!formData.interviewDate || !formData.interviewTime) ? 0.6 : 1
              }}
              required
            >
              {!formData.interviewDate || !formData.interviewTime ? (
                <option value="">-- Set Date & Time to View Available Interviewers --</option>
              ) : availableInterviewers.length === 0 ? (
                <option value="">❌ No interviewers available for this time slot</option>
              ) : (
                <>
                  <option value="">-- Choose Available Interviewer ({availableInterviewers.length} Available) --</option>
                  {availableInterviewers.map(intv => (
                    <option key={intv.id} value={intv.id}>
                      🟢 {intv.firstName} {intv.lastName} ({intv.email})
                    </option>
                  ))}
                </>
              )}
            </select>

            {hasFetchedInterviewers && formData.interviewTime && availableInterviewers.length === 0 && (
              <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>
                No active interviewer slot covers {formData.interviewDate} at {formData.interviewTime}. Please choose another time.
              </p>
            )}
          </div>

          {/* 5. Interview Type Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>Interview Type</label>
            <select 
              value={formData.interviewType} 
              onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
              required
            >
              <option value="ONLINE">ONLINE</option>
              <option value="OFFLINE">OFFLINE</option>
              <option value="TECHNICAL">TECHNICAL</option>
              <option value="HR">HR</option>
              <option value="MANAGERIAL">MANAGERIAL</option>
              <option value="FINAL">FINAL</option>
            </select>
          </div>

          {/* 6. Meeting Link */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>Meeting Link (Optional)</label>
            <input 
              type="url" 
              placeholder="https://meet.google.com/..."
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button 
              type="submit" 
              disabled={!formData.candidateId || !formData.jobPositionId || !formData.interviewerId || !formData.interviewTime}
              style={{
                padding: '10px 16px',
                background: (!formData.candidateId || !formData.jobPositionId || !formData.interviewerId || !formData.interviewTime) ? '#475569' : '#10b981',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '8px',
                cursor: (!formData.candidateId || !formData.jobPositionId || !formData.interviewerId || !formData.interviewTime) ? 'not-allowed' : 'pointer'
              }}
            >
              Schedule Slot
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}