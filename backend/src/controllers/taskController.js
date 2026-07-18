const { TaskRepository } = require('../repositories/dbSwitcher');

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Extract query parameters for filtering
    const { status, priority, category, search } = req.query;
    const filters = { status, priority, category, search };

    const tasks = await TaskRepository.findByUser(userId, filters);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ message: 'Error occurred while retrieving tasks' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await TaskRepository.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (String(task.user) !== String(userId)) {
      return res.status(403).json({ message: 'Access denied: Unauthorized task owner' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Fetch task details error:', error);
    res.status(500).json({ message: 'Error occurred while retrieving task details' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, category, dueDate, subtasks } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const newTask = await TaskRepository.create({
      user: userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      category: category || 'work',
      dueDate: dueDate || null,
      subtasks: subtasks || [],
      status: 'pending' // default status for new tasks
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: error.message || 'Error occurred while creating task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    // Verify task exists and is owned by the user
    const task = await TaskRepository.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (String(task.user) !== String(userId)) {
      return res.status(403).json({ message: 'Access denied: Unauthorized task owner' });
    }

    const updatedTask = await TaskRepository.update(taskId, userId, updateData);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error occurred while updating task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Verify task exists and is owned by the user
    const task = await TaskRepository.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (String(task.user) !== String(userId)) {
      return res.status(403).json({ message: 'Access denied: Unauthorized task owner' });
    }

    const deleted = await TaskRepository.delete(taskId, userId);
    if (deleted) {
      res.status(200).json({ message: 'Task deleted successfully' });
    } else {
      res.status(400).json({ message: 'Task could not be deleted' });
    }
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error occurred while deleting task' });
  }
};
