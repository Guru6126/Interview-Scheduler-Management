import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auditLogService } from '../services/auditLogService';
import './Dashboard.css';

const ACTION_COLORS = {
  SCHEDULE_INTERVIEW:       { color: '#10b981', bg: '#d1fae5', icon: '📅' },
  CANCEL_INTERVIEW:         { color: '#ef4444', bg: '#fee2e2', icon: '❌' },
  RESCHEDULE_INTERVIEW:     { color: '#f59e0b', bg: '#fef3c7', icon: '🔄' },
  UPDATE_INTERVIEW:         { color: '#3b82f6', bg: '#dbeafe', icon: '✏️' },
  SUBMIT_FEEDBACK:          { color: '#8b5cf6', bg: '#ede9fe', icon: '⭐' },
  APPLY_JOB:                { color: '#06b6d4', bg: '#cffafe', icon: '📝' },
  UPDATE_APPLICATION_STATUS:{ color: '#f59e0b', bg: '#fef3c7', icon: '🔀' },
};

const getActionMeta = (action) => ACTION_COLORS[action] || { color: '#64748b', bg: '#f1f5f9', icon: '📌' };

const AuditLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [expandedLog, setExpandedLog] = useState(null);
  const PER_PAGE = 20;

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await auditLogService.getAllLogs();
      setLogs(data || []);
    } catch (e) {
      console.error('Failed to load audit logs', e);
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueActions = ['ALL', ...new Set(logs.map(l => l.action).filter(Boolean))];

  const filtered = logs.filter(l => {
    const matchSearch = !search ||
      (l.action || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.entityType || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.details || '').toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'ALL' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div style={{ padding: '32px', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-color, #1e293b)' }}>🔐 Audit Trail</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
            System-wide action log for security events, scheduling changes, and data updates. (Admin Only)
          </p>
        </div>
        <button onClick={loadLogs} style={{ padding: '9px 16px', background: 'var(--card-bg, #f8fafc)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-color, #475569)', fontWeight: '600', fontSize: '13px' }}>
          🔄 Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Events', value: logs.length, color: '#3b82f6', icon: '📊' },
          { label: 'Interviews Scheduled', value: logs.filter(l => l.action === 'SCHEDULE_INTERVIEW').length, color: '#10b981', icon: '📅' },
          { label: 'Cancellations', value: logs.filter(l => l.action === 'CANCEL_INTERVIEW').length, color: '#ef4444', icon: '❌' },
          { label: 'Feedback Submitted', value: logs.filter(l => l.action === 'SUBMIT_FEEDBACK').length, color: '#8b5cf6', icon: '⭐' },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: '160px' }}>
            <span style={{ fontSize: '28px' }}>{card.icon}</span>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: card.color }}>{card.value}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="🔍 Search actions, entities, details..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid var(--card-border, #e2e8f0)', background: 'var(--card-bg, #fff)', color: 'var(--text-color, #1e293b)', fontSize: '13px', minWidth: '260px' }}
        />
        <select
          value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(1); }}
          style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid var(--card-border, #e2e8f0)', background: 'var(--card-bg, #fff)', color: 'var(--text-color, #1e293b)', fontSize: '13px' }}
        >
          {uniqueActions.map(a => <option key={a} value={a}>{a === 'ALL' ? 'All Actions' : a.replace(/_/g, ' ')}</option>)}
        </select>
        <span style={{ fontSize: '13px', color: '#64748b' }}>{filtered.length} events</span>
      </div>

      {/* Logs Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '64px', color: '#64748b' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading audit logs...</p>
        </div>
      ) : (
        <>
          <div style={{ background: 'var(--card-bg, #fff)', borderRadius: '12px', border: '1px solid var(--card-border, #e2e8f0)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--table-th-bg, #f8fafc)', borderBottom: '2px solid var(--table-border, #e2e8f0)' }}>
                  {['Timestamp', 'Action', 'Entity', 'Entity ID', 'User ID', 'Details'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--table-th-text, #475569)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? paginated.map((log, idx) => {
                  const meta = getActionMeta(log.action);
                  return (
                    <tr key={log.id || idx}
                      style={{ borderBottom: '1px solid var(--table-border, #f1f5f9)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--row-hover-bg, #f8fafc)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{formatTimestamp(log.timestamp)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: meta.bg, color: meta.color }}>
                          {meta.icon} {(log.action || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--table-td-text, #334155)', fontWeight: '500' }}>{log.entityType || '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>#{log.entityId || '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{log.userId ? `User #${log.userId}` : 'System'}</td>
                      <td
                        onClick={() => log.details && setExpandedLog(log)}
                        title={log.details ? 'Click to expand' : ''}
                        style={{
                          padding: '12px 16px',
                          fontSize: '12px',
                          color: log.details ? 'var(--table-td-text, #334155)' : '#94a3b8',
                          maxWidth: '280px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: log.details ? 'pointer' : 'default',
                          textDecoration: log.details ? 'underline dotted #94a3b8' : 'none'
                        }}
                      >
                        {log.details || '—'}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      No audit events match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--card-border, #e2e8f0)', background: 'var(--card-bg, #fff)', color: 'var(--text-color, #475569)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--card-border, #e2e8f0)', background: page === p ? '#3b82f6' : 'var(--card-bg, #fff)', color: page === p ? '#fff' : 'var(--text-color, #475569)', cursor: 'pointer', fontWeight: page === p ? '700' : '400' }}>
                  {p}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--card-border, #e2e8f0)', background: 'var(--card-bg, #fff)', color: 'var(--text-color, #475569)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
      {/* Detail Expand Modal */}
      {expandedLog && (
        <div
          onClick={() => setExpandedLog(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--card-bg, #fff)',
              border: '1px solid var(--card-border, #e2e8f0)',
              borderRadius: '14px',
              padding: '28px 32px',
              maxWidth: '580px',
              width: '90%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                    background: getActionMeta(expandedLog.action).bg,
                    color: getActionMeta(expandedLog.action).color
                  }}>
                    {getActionMeta(expandedLog.action).icon} {(expandedLog.action || '').replace(/_/g, ' ')}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{formatTimestamp(expandedLog.timestamp)}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {expandedLog.entityType} #{expandedLog.entityId} &nbsp;·&nbsp; {expandedLog.userId ? `User #${expandedLog.userId}` : 'System'}
                </div>
              </div>
              <button
                onClick={() => setExpandedLog(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8', lineHeight: 1, padding: '0 4px' }}
              >✕</button>
            </div>
            {/* Full Details */}
            <div style={{
              background: 'var(--bg-color, #f8fafc)',
              border: '1px solid var(--card-border, #e2e8f0)',
              borderRadius: '8px',
              padding: '14px 16px',
              fontSize: '13px',
              color: 'var(--text-color, #334155)',
              lineHeight: '1.7',
              wordBreak: 'break-word'
            }}>
              {expandedLog.details}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
