import React from 'react';
import TaskCard from './TaskCard';
import { Search, Plus, FilterX } from 'lucide-react';

const TaskList = ({
  tasks,
  filters,
  onFilterChange,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateTask
}) => {

  const handleSearchChange = (e) => {
    onFilterChange('search', e.target.value);
  };

  const handleSelectChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* View Header */}
      <div className="header-section">
        <div>
          <h1 className="header-title">My Tasks</h1>
          <p className="header-subtitle">Manage, edit, and update your task items.</p>
        </div>
        <button className="btn btn-primary" onClick={onAddTask}>
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>

      {/* Search and Filters panel */}
      <div className="glass-card filters-bar" style={{ padding: '0.75rem 1rem' }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="form-input"
            style={{ paddingLeft: '40px' }}
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <select
          name="status"
          className="filter-select"
          value={filters.status}
          onChange={handleSelectChange}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="priority"
          className="filter-select"
          value={filters.priority}
          onChange={handleSelectChange}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select
          name="category"
          className="filter-select"
          value={filters.category}
          onChange={handleSelectChange}
        >
          <option value="all">All Categories</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
          <option value="finance">Finance</option>
          <option value="others">Others</option>
        </select>
      </div>

      {/* Task List Grid Container */}
      <div style={{ flex: 1 }}>
        {tasks.length === 0 ? (
          <div className="glass-card empty-state">
            <FilterX size={48} style={{ color: 'var(--text-muted)' }} />
            <h3>No tasks found</h3>
            <p>Try refining your search query or reset status/priority/category filters.</p>
            <button className="btn btn-secondary btn-sm" onClick={() => {
              onFilterChange('search', '');
              onFilterChange('status', 'all');
              onFilterChange('priority', 'all');
              onFilterChange('category', 'all');
            }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdateTask={onUpdateTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
