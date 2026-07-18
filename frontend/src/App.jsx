import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { taskAPI } from './services/api';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import AuthCard from './components/AuthCard';
import { Loader2 } from 'lucide-react';
import './styles/App.css';

const AppContent = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  // Fetch tasks whenever the filters change
  const fetchTasks = async () => {
    if (!user) return;
    setTasksLoading(true);
    try {
      const data = await taskAPI.getTasks(filters);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
    } finally {
      setTasksLoading(false);
    }
  };

  // Trigger task fetch on filter changes or user login
  useEffect(() => {
    // Add a small bounce delay for search to prevent excess requests
    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, filters.search ? 300 : 0);

    return () => clearTimeout(delayDebounce);
  }, [user, filters]);

  // Update inline properties (like checkbox status or checklist item checks)
  const handleUpdateTask = async (id, updateData) => {
    // Optimistic UI update
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === id ? { ...task, ...updateData } : task
      )
    );

    try {
      await taskAPI.updateTask(id, updateData);
    } catch (err) {
      console.error('Failed to update task:', err.message);
      // Fallback: fetch original state on failure
      fetchTasks();
    }
  };

  // Open Edit Modal
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    // Optimistic UI update
    setTasks(prevTasks => prevTasks.filter(task => task._id !== id));

    try {
      await taskAPI.deleteTask(id);
    } catch (err) {
      console.error('Failed to delete task:', err.message);
      fetchTasks();
    }
  };

  // Save Task Form Submission (Create or Edit)
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Save edit
        const updated = await taskAPI.updateTask(editingTask._id, taskData);
        setTasks(prevTasks => 
          prevTasks.map(task => task._id === editingTask._id ? updated : task)
        );
      } else {
        // Create new
        const created = await taskAPI.createTask(taskData);
        setTasks(prevTasks => [created, ...prevTasks]);
      }
      setShowModal(false);
      setEditingTask(null);
    } catch (err) {
      alert(`Error saving task: ${err.message}`);
    }
  };

  // Filter change handlers
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Trigger opening add task modal
  const handleAddTaskClick = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  // Auth Loading State
  if (authLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-main)', gap: '1rem' }}>
        <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent-solid)', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Initializing Session...</span>
      </div>
    );
  }

  // Not logged in -> Show Authentication View
  if (!user) {
    return <AuthCard />;
  }

  return (
    <div className="app-wrapper">
      {/* Sidebar Panel */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content Pane */}
      <main className="main-content">
        {activeView === 'dashboard' ? (
          <Dashboard 
            tasks={tasks} 
            setActiveView={setActiveView} 
            onEditTask={handleEditTask}
          />
        ) : (
          <TaskList
            tasks={tasks}
            filters={filters}
            onFilterChange={handleFilterChange}
            onAddTask={handleAddTaskClick}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        )}
      </main>

      {/* Add / Edit Task Modal Overlay */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

// Top-level App wrapper containing AuthContext Provider
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
