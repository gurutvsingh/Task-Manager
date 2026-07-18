import React from 'react';
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, Calendar, ArrowRight } from 'lucide-react';

const Dashboard = ({ tasks, setActiveView, onEditTask }) => {
  // Statistics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter for high priority pending tasks (Limit to 5)
  const urgentTasks = tasks
    .filter(t => t.priority === 'high' && t.status !== 'completed')
    .slice(0, 5);

  // Priority counts
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const medCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;

  const getPriorityPercentage = (count) => {
    return totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
  };

  const getDueDateLabel = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date.getTime() < today.getTime();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="header-section">
        <div>
          <h1 className="header-title">Dashboard Overview</h1>
          <p className="header-subtitle">Track, analyze, and keep up with your workflow.</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon primary">
            <ClipboardList size={22} />
          </div>
          <div>
            <div className="stat-value">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon pending">
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-value">{pendingTasks}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-value">{completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon high">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-value">{highPriorityTasks}</div>
            <div className="stat-label">High Priority</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout split */}
      <div className="dashboard-sections">
        {/* Left Side: Completion and Priority Analytics */}
        <div className="glass-card dash-panel">
          <h2 className="panel-title">Task Metrics & Analytics</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, justifyContent: 'center' }}>
            {/* Completion Ratio Circle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                <svg width="100%" height="100%" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#progress-gradient)"
                    strokeDasharray={`${completionPercentage}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-title)' }}>{completionPercentage}%</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Done</span>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Project Completion</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                  You have completed {completedTasks} out of {totalTasks} total tasks allocated to your workspace. Keep going!
                </p>
              </div>
            </div>

            {/* Priority Progress Bars */}
            <div className="analytics-list">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Priority Distribution
              </h4>
              
              <div className="analytics-item">
                <div className="analytics-header">
                  <span>High Priority</span>
                  <span>{highCount} ({getPriorityPercentage(highCount)}%)</span>
                </div>
                <div className="analytics-bar-bg">
                  <div 
                    className="analytics-bar-fill" 
                    style={{ width: `${getPriorityPercentage(highCount)}%`, background: 'var(--priority-high-gradient)' }}
                  />
                </div>
              </div>

              <div className="analytics-item">
                <div className="analytics-header">
                  <span>Medium Priority</span>
                  <span>{medCount} ({getPriorityPercentage(medCount)}%)</span>
                </div>
                <div className="analytics-bar-bg">
                  <div 
                    className="analytics-bar-fill" 
                    style={{ width: `${getPriorityPercentage(medCount)}%`, background: 'var(--priority-medium-gradient)' }}
                  />
                </div>
              </div>

              <div className="analytics-item">
                <div className="analytics-header">
                  <span>Low Priority</span>
                  <span>{lowCount} ({getPriorityPercentage(lowCount)}%)</span>
                </div>
                <div className="analytics-bar-bg">
                  <div 
                    className="analytics-bar-fill" 
                    style={{ width: `${getPriorityPercentage(lowCount)}%`, background: 'var(--priority-low-gradient)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: High Priority Overdue Task Feed */}
        <div className="glass-card dash-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 className="panel-title" style={{ margin: 0 }}>
              <AlertTriangle size={18} style={{ color: '#ef4444' }} />
              <span>Urgent Actions</span>
            </h2>
            <button 
              onClick={() => setActiveView('tasks')}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-solid)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
            {urgentTasks.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', fontSize: '0.9rem', gap: '0.5rem', textAlign: 'center', padding: '1rem' }}>
                <CheckCircle2 size={32} style={{ color: '#10b981' }} />
                <p>Awesome! You have no pending high-priority tasks.</p>
              </div>
            ) : (
              urgentTasks.map(task => (
                <div 
                  key={task._id} 
                  className="glass-card" 
                  onClick={() => onEditTask(task)}
                  style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderLeft: '4px solid #ef4444', transition: 'transform var(--transition-fast)' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0, paddingRight: '0.5rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      Category: {task.category}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', whiteSpace: 'nowrap', color: isOverdue(task.dueDate) ? '#fca5a5' : 'var(--text-secondary)' }}>
                    <Calendar size={12} />
                    <span>{getDueDateLabel(task.dueDate)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
