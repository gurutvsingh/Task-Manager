import React, { useState } from 'react';
import { Calendar, CheckSquare, Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const TaskCard = ({ task, onUpdateTask, onEditTask, onDeleteTask }) => {
  const [expanded, setExpanded] = useState(false);

  // Due date assessment and calculations
  const getDueDateStatus = () => {
    if (!task.dueDate) return { label: 'No deadline', isOverdue: false };
    const date = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });

    if (task.status === 'completed') {
      return { label: `Due ${formattedDate}`, isOverdue: false };
    }

    if (diffDays < 0) {
      return { label: `Overdue (${formattedDate})`, isOverdue: true };
    }
    if (diffDays === 0) {
      return { label: 'Due Today', isOverdue: true };
    }
    if (diffDays === 1) {
      return { label: 'Due Tomorrow', isOverdue: false };
    }
    return { label: `Due ${formattedDate}`, isOverdue: false };
  };

  const { label: dueDateLabel, isOverdue } = getDueDateStatus();

  // Checklist counts
  const subtasksCount = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasksCount = task.subtasks 
    ? task.subtasks.filter(st => st.completed).length 
    : 0;
  const subtaskProgress = subtasksCount > 0 
    ? Math.round((completedSubtasksCount / subtasksCount) * 100) 
    : 0;

  // Subtask checkbox toggle
  const handleSubtaskToggle = (subtaskId, e) => {
    e.stopPropagation(); // prevent card toggle
    const updatedSubtasks = task.subtasks.map(st => {
      if (st._id === subtaskId) {
        return { ...st, completed: !st.completed };
      }
      return st;
    });

    onUpdateTask(task._id, { subtasks: updatedSubtasks });
  };

  // Main task checkbox toggle
  const handleStatusToggle = (e) => {
    e.stopPropagation(); // prevent card toggle
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    onUpdateTask(task._id, { status: newStatus });
  };

  // Edit task details modal opener
  const handleEditClick = (e) => {
    e.stopPropagation();
    onEditTask(task);
  };

  // Delete task execution
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDeleteTask(task._id);
    }
  };

  // Priority color accents
  const getPriorityStyle = () => {
    switch (task.priority) {
      case 'high':
        return { borderLeft: '4px solid #f43f5e' };
      case 'medium':
        return { borderLeft: '4px solid #f59e0b' };
      case 'low':
      default:
        return { borderLeft: '4px solid #10b981' };
    }
  };

  return (
    <div 
      className={`glass-card task-card ${isOverdue ? 'overdue-card' : ''}`}
      onClick={() => setExpanded(!expanded)}
      style={getPriorityStyle()}
    >
      <div className="task-card-header">
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flex: 1, minWidth: 0 }}>
          {/* Custom Checkbox */}
          <div 
            className={`checkbox-container ${task.status === 'completed' ? 'checked' : ''}`}
            onClick={handleStatusToggle}
          >
            <div className="custom-checkbox">
              {task.status === 'completed' && <CheckSquare size={13} style={{ strokeWidth: 3 }} />}
            </div>
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 className={`task-card-title ${task.status === 'completed' ? 'completed' : ''}`}>
              {task.title}
            </h3>
          </div>
        </div>

        <div className="task-actions">
          <button className="task-action-btn" onClick={handleEditClick} title="Edit Task">
            <Edit3 size={14} />
          </button>
          <button className="task-action-btn delete" onClick={handleDeleteClick} title="Delete Task">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description text */}
      {task.description && (
        <p className={`task-card-desc ${expanded ? 'expanded' : ''}`} style={{ transition: 'all 0.3s ease' }}>
          {task.description}
        </p>
      )}

      {/* Subtasks Progress Bar */}
      {subtasksCount > 0 && (
        <div className="task-card-subtasks-summary" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>Checklist Progress</span>
            <span>{completedSubtasksCount}/{subtasksCount} ({subtaskProgress}%)</span>
          </div>
          <div className="analytics-bar-bg" style={{ height: '6px' }}>
            <div 
              className="analytics-bar-fill" 
              style={{ 
                width: `${subtaskProgress}%`, 
                background: 'var(--accent-gradient)' 
              }}
            />
          </div>
        </div>
      )}

      {/* Expanded subtask checkboxes */}
      {expanded && subtasksCount > 0 && (
        <div className="subtasks-list" style={{ animation: 'slideDown 0.25s ease' }}>
          {task.subtasks.map(st => (
            <div 
              key={st._id} 
              className={`subtask-item ${st.completed ? 'completed' : ''}`}
              onClick={(e) => handleSubtaskToggle(st._id, e)}
            >
              <div className={`checkbox-container ${st.completed ? 'checked' : ''}`}>
                <div className="custom-checkbox" style={{ width: '18px', height: '18px', borderRadius: '5px' }}>
                  {st.completed && <CheckSquare size={10} style={{ strokeWidth: 3 }} />}
                </div>
              </div>
              <span style={{ fontSize: '0.85rem' }}>{st.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="task-card-footer">
        <div className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
          <Calendar size={13} />
          <span>{dueDateLabel}</span>
        </div>

        <div className="task-badges">
          <span className={`badge badge-${task.priority}`}>
            {task.priority}
          </span>
          <span className={`badge badge-${task.category}`}>
            {task.category}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-0.5rem', color: 'var(--text-muted)' }}>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>
    </div>
  );
};

export default TaskCard;
