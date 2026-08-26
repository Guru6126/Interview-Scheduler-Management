import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { availabilityService } from '../services/availabilityService';
import { userService } from '../services/userService';
import './Dashboard.css';

const Availability = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [filterInterviewerId, setFilterInterviewerId] = useState('');
  const [interviewers, setInterviewers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    availableDate: '',
    startTime: '',
    endTime: '',
    isAvailable: true,
    recurring: false,
    userId: ''
  });

  const getTokenPayload = () => {
    if (!user?.token) return {};
    try { return JSON.parse(atob(user.token.split('.')[1])); } catch { return {}; }
  };

  const tokenPayload = getTokenPayload();
  const roleString = (tokenPayload.roles || tokenPayload.role || user?.role || '').toString().toUpperCase();
  const isAdmin = roleString.includes('ADMIN');
  const isRecruiter = roleString.includes('RECRUITER');
  const isCoordinator = roleString.includes('COORDINATOR');
  const isInterviewer = roleString.includes('INTERVIEWER');
  const canManageAll = isAdmin || isRecruiter || isCoordinator;

  const currentUserId = user?.userId                              // from new login response field
    || tokenPayload.userId                                          // from new JWT claim
    || tokenPayload.id                                              // fallback JWT claim name
    || user?.id;                                                    // legacy fallback

  useEffect(() => {
    loadSlots();
    if (canManageAll) loadInterviewers();
  }, []);

  const loadInterviewers = async () => {
    try {
      const data = await userService.getUsersByRole('INTERVIEWER');
      setInterviewers(data || []);
    } catch (e) { console.error('Failed to load interviewers', e); }
  };

  const loadSlots = async () => {
    setIsLoading(true);
    try {
      let data;
      if (canManageAll) {
        data = filterInterviewerId
          ? await availabilityService.getAvailabilityByInterviewer(filterInterviewerId)
          : await availabilityService.getAllAvailabilities();
      } else {
        data = await availabilityService.getAvailabilityByInterviewer(currentUserId);
      }
      setSlots(data || []);
    } catch (e) {
      console.error('Failed to load availability', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadSlots(); }, [filterInterviewerId]);

  const openAddForm = () => {
    setEditingSlot(null);
    setFormData({
      availableDate: '',
      startTime: '',
      endTime: '',
      isAvailable: true,
      recurring: false,
      userId: isInterviewer ? String(currentUserId) : ''
    });
    setError(''); setSuccess('');
    setShowForm(true);
  };

  const openEditForm = (slot) => {
    setEditingSlot(slot);
    setFormData({
      availableDate: slot.availableDate || '',
      startTime: slot.startTime ? slot.startTime.substring(0, 5) : '',
      endTime: slot.endTime ? slot.endTime.substring(0, 5) : '',
      isAvailable: slot.isAvailable !== false,
      recurring: slot.recurring || false,
      userId: String(slot.userId || currentUserId)
    });
    setError(''); setSuccess('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time.');
      return;
    }

    const payload = {
      availableDate: formData.availableDate,
      startTime: `${formData.startTime}:00`,
      endTime: `${formData.endTime}:00`,
      isAvailable: formData.isAvailable,
      recurring: formData.recurring,
      userId: Number(formData.userId || currentUserId)
    };

    try {
      if (editingSlot) {
        await availabilityService.updateAvailability(editingSlot.id, payload);
        setSuccess('Slot updated successfully.');
      } else {
        await availabilityService.createAvailability(payload);
        setSuccess('Slot created successfully.');
      }
      setShowForm(false);
      loadSlots();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save slot. Please check the form.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this availability slot?')) return;
    try {
      await availabilityService.deleteAvailability(id);
      loadSlots();
    } catch (e) {
      alert('Failed to delete slot.');
    }
  };

  const statusColors = {
    true: { bg: '#d1fae5', color: '#065f46' },
    false: { bg: '#fee2e2', color: '#991b1b' }
  };

  return (
    <div className="content-section" style={{ margin: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Availability Management</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
            {isInterviewer && !canManageAll
              ? 'Manage your available time slots for interviews.'
              : 'View and manage interviewer availability slots across the team.'}
          </p>
        </div>
        <button
          onClick={openAddForm}
          style={{ background: '#10b981', color: '#fff', padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
        >
          + Add Slot
        </button>
      </div>

      {/* Interviewer Filter (for Admin/Recruiter/Coordinator) */}
      {canManageAll && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Filter by Interviewer:</label>
          <select
            value={filterInterviewerId}
            onChange={(e) => setFilterInterviewerId(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--card-border, #e2e8f0)', background: 'var(--card-bg, #ffffff)', color: 'var(--text-color, #1e293b)', fontSize: '14px' }}
          >
            <option value="">All Interviewers</option>
            {interviewers.map(i => (
              <option key={i.id} value={i.id}>{i.firstName} {i.lastName}</option>
            ))}
          </select>
          {filterInterviewerId && (
            <button onClick={() => setFilterInterviewerId('')} style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#64748b', padding: '7px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Clear</button>
          )}
        </div>
      )}

      {/* Slot Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <p>Loading availability slots...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--table-border, #e2e8f0)', textAlign: 'left', color: 'var(--table-th-text, #475569)', background: 'var(--table-th-bg, #f8fafc)' }}>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Start Time</th>
                <th style={{ padding: '12px 16px' }}>End Time</th>
                {canManageAll && <th style={{ padding: '12px 16px' }}>Interviewer</th>}
                <th style={{ padding: '12px 16px' }}>Recurring</th>
                <th style={{ padding: '12px 16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.length > 0 ? slots.map(slot => (
                <tr key={slot.id} style={{ borderBottom: '1px solid var(--table-border, #f1f5f9)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--row-hover-bg, #f8fafc)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: '500', color: 'var(--table-td-text, #334155)' }}>{slot.availableDate}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--table-td-text, #334155)' }}>{slot.startTime?.substring(0, 5)}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--table-td-text, #334155)' }}>{slot.endTime?.substring(0, 5)}</td>
                  {canManageAll && <td style={{ padding: '12px 16px', color: 'var(--table-td-text, #334155)' }}>{slot.userName || 'N/A'}</td>}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '13px', color: slot.recurring ? '#3b82f6' : '#94a3b8' }}>
                      {slot.recurring ? '🔁 Yes' : '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEditForm(slot)} style={{ background: 'none', border: 'none', color: '#f59e0b', fontWeight: '600', cursor: 'pointer', fontSize: '13px', padding: '4px 8px' }}>Edit</button>
                    <button onClick={() => handleDelete(slot.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer', fontSize: '13px', padding: '4px 8px' }}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={canManageAll ? 6 : 5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No availability slots found. Click "Add Slot" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--card-bg, #1e293b)', color: 'var(--header-text, #f8fafc)', padding: '28px', borderRadius: '12px', width: '460px', maxWidth: '90%', border: '1px solid var(--card-border, #334155)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <h3 style={{ margin: '0 0 6px 0' }}>{editingSlot ? 'Edit Slot' : 'Add Availability Slot'}</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px 0' }}>Define a time window when you are available for interviews.</p>

            {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
            {success && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{success}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {canManageAll && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#94a3b8' }}>Interviewer</label>
                  <select value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
                    required>
                    <option value="">-- Select Interviewer --</option>
                    {interviewers.map(i => <option key={i.id} value={i.id}>{i.firstName} {i.lastName}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#94a3b8' }}>Date</label>
                <input type="date" value={formData.availableDate} onChange={e => setFormData({ ...formData, availableDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
                  required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#94a3b8' }}>Start Time</label>
                  <input type="time" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
                    required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#94a3b8' }}>End Time</label>
                  <input type="time" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-color, #0f172a)', border: '1px solid var(--card-border, #334155)', color: 'var(--text-color, #fff)' }}
                    required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#94a3b8' }}>
                  <input type="checkbox" checked={formData.isAvailable} onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#10b981' }} />
                  Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#94a3b8' }}>
                  <input type="checkbox" checked={formData.recurring} onChange={e => setFormData({ ...formData, recurring: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }} />
                  Recurring Weekly
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 18px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#10b981', border: 'none', color: '#fff', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}>
                  {editingSlot ? 'Update Slot' : 'Add Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;
