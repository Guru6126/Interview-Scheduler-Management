import React, { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { candidateService } from '../services/candidateService';
import { userService } from '../services/userService';

export default function ScheduleInterviewModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    candidateId: '',
    jobPositionId: '',
    interviewDate: '',
    interviewType: 'ONLINE',
    meetingLink: '',
    interviewerId: ''
  });

  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviewers, setInterviewers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadDropdownData();
      setFormData({
        candidateId: '',
        jobPositionId: '',
        interviewDate: '',
        interviewType: 'ONLINE',
        meetingLink: '',
        interviewerId: ''
      });
    }
  }, [isOpen]);

  const loadDropdownData = async () => {
    try {
      const jobData = await jobService.getAllJobs();
      setJobs(jobData);

      const candidateData = await candidateService.getAllCandidates();
      setCandidates(candidateData);

      const interviewerData = await userService.getUsersByRole('INTERVIEWER');
      setInterviewers(interviewerData || []);
    } catch (error) {
      console.error("Failed to load modal dropdown data:", error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.interviewDate) return;

    // Parse YYYY-MM-DD and HH:mm from interviewDate (e.g. "2026-08-25T19:40")
    const [datePart, timePart] = formData.interviewDate.split('T');

    const payload = {
      candidateId: Number(formData.candidateId),
      jobPositionId: Number(formData.jobPositionId),
      scheduledDate: datePart,
      scheduledTime: `${timePart}:00`, // Format as "HH:mm:ss"
      interviewType: formData.interviewType,
      meetingLink: formData.meetingLink || '',
      status: "SCHEDULED",
      interviewerId: formData.interviewerId ? Number(formData.interviewerId) : null
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
      <div style={{ backgroundColor: 'var(--card-bg, #1e293b)', color: 'var(--header-text, #f8fafc)', padding: '24px', borderRadius: '12px', width: '450px', maxWidth: '90%', border: '1px solid var(--card-border, #334155)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <h3 style={{ margin: '0 0 4px 0' }}>Schedule New Interview</h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0' }}>Select candidate, job opening, date, and type.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Candidate Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>Select Candidate</label>
            <select 
              value={formData.candidateId} 
              onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
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

          {/* Job Position Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>Select Job Position</label>
            <select 
              value={formData.jobPositionId} 
              onChange={(e) => setFormData({ ...formData, jobPositionId: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
              required
            >
              <option value="">-- Choose Job Position --</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.department})
                </option>
              ))}
            </select>
          </div>

          {/* Interviewer Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>Select Interviewer</label>
            <select 
              value={formData.interviewerId} 
              onChange={(e) => setFormData({ ...formData, interviewerId: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
              required
            >
              <option value="">-- Choose Interviewer --</option>
              {interviewers.map(intv => (
                <option key={intv.id} value={intv.id}>
                  {intv.firstName} {intv.lastName} ({intv.email})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>Interview Date & Time</label>
            <input 
              type="datetime-local" 
              value={formData.interviewDate}
              onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
              required
            />
          </div>

          {/* Interview Type Selection */}
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

          {/* Meeting Link */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>Meeting Link (Optional)</label>
            <input 
              type="url" 
              placeholder="https://..."
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 16px', background: '#10b981', border: 'none', color: '#fff', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}>Schedule Slot</button>
          </div>

        </form>
      </div>
    </div>
  );
}