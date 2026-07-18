const Task = require('../models/Task');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '../../data');
const taskFilePath = path.join(dataDir, 'tasks.json');

// Ensure data folder and file exists for JSON fallback
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(taskFilePath)) {
  fs.writeFileSync(taskFilePath, JSON.stringify([]));
}

class MongoTaskRepository {
  async create(taskData) {
    const task = new Task(taskData);
    const saved = await task.save();
    return saved.toObject();
  }

  async findById(id) {
    const task = await Task.findById(id);
    return task ? task.toObject() : null;
  }

  async findByUser(userId, filters = {}) {
    const query = { user: userId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.priority) {
      query.priority = filters.priority;
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    return tasks.map(t => t.toObject());
  }

  async update(id, userId, updateData) {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updateData },
      { new: true }
    );
    return task ? task.toObject() : null;
  }

  async delete(id, userId) {
    const result = await Task.deleteOne({ _id: id, user: userId });
    return result.deletedCount > 0;
  }
}

class JsonTaskRepository {
  constructor() {
    this.filePath = taskFilePath;
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async create(taskData) {
    const tasks = this._read();
    
    const newTask = {
      _id: crypto.randomUUID(),
      user: String(taskData.user),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      category: taskData.category || 'work',
      dueDate: taskData.dueDate || null,
      subtasks: (taskData.subtasks || []).map(st => ({
        _id: crypto.randomUUID(),
        text: st.text,
        completed: st.completed || false
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    tasks.push(newTask);
    this._write(tasks);
    return newTask;
  }

  async findById(id) {
    const tasks = this._read();
    return tasks.find(t => String(t._id) === String(id)) || null;
  }

  async findByUser(userId, filters = {}) {
    let tasks = this._read();
    
    // Filter by user ID
    tasks = tasks.filter(t => String(t.user) === String(userId));
    
    // Apply status filter
    if (filters.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    // Apply priority filter
    if (filters.priority) {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }
    // Apply category filter
    if (filters.category) {
      tasks = tasks.filter(t => t.category === filters.category);
    }
    // Apply search filter (title or description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tasks = tasks.filter(t => 
        (t.title && t.title.toLowerCase().includes(searchLower)) || 
        (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }

    // Sort by createdAt descending
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return tasks;
  }

  async update(id, userId, updateData) {
    const tasks = this._read();
    const index = tasks.findIndex(t => String(t._id) === String(id) && String(t.user) === String(userId));
    if (index === -1) return null;

    const currentTask = tasks[index];
    
    // Normalize subtasks
    let updatedSubtasks = undefined;
    if (updateData.subtasks) {
      updatedSubtasks = updateData.subtasks.map(st => ({
        _id: st._id || crypto.randomUUID(),
        text: st.text,
        completed: st.completed || false
      }));
    }

    const updatedTask = {
      ...currentTask,
      ...updateData,
      subtasks: updatedSubtasks !== undefined ? updatedSubtasks : currentTask.subtasks,
      updatedAt: new Date()
    };

    tasks[index] = updatedTask;
    this._write(tasks);
    return updatedTask;
  }

  async delete(id, userId) {
    const tasks = this._read();
    const index = tasks.findIndex(t => String(t._id) === String(id) && String(t.user) === String(userId));
    if (index === -1) return false;

    tasks.splice(index, 1);
    this._write(tasks);
    return true;
  }
}

module.exports = { MongoTaskRepository, JsonTaskRepository };
