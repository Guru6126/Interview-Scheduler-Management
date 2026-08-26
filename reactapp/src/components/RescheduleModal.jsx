import React, { useState, useEffect } from 'react';

export default function RescheduleModal({ isOpen, onClose, onSubmit, interview }) {
  const [interviewDate, setInterviewDate] = useState('');

  useEffect(() => {
    if (isOpen && interview) {
      // Parse scheduledTime safely (usually HH:mm or HH:mm:ss)
      const timeStr = interview.scheduledTime ? interview.scheduledTime.substring(0, 5) : '00:00';
      setInterviewDate(`${interview.scheduledDate}T${timeStr}`);
    }
  }, [isOpen, interview]);

  if (!isOpen || !interview) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!interviewDate) return;

    const [datePart, timePart] = interviewDate.split('T');
    onSubmit(datePart, timePart);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'var(--card-bg, #1e293b)', color: 'var(--header-text, #f8fafc)', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%', border: '1px solid var(--card-border, #334155)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <h3 style={{ margin: '0 0 4px 0' }}>Reschedule Interview</h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0' }}>
          Update the interview date and time for <strong>{interview.candidateName}</strong>.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Date & Time Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8' }}>New Date & Time</label>
            <input 
              type="datetime-local" 
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
              required
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 16px', background: '#f59e0b', border: 'none', color: '#fff', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}>Reschedule</button>
          </div>

        </form>
      </div>
    </div>
  );
}
