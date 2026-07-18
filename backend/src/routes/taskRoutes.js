const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Secure all task routes with JWT authentication middleware
router.use(authMiddleware);

// @route   GET api/tasks
// @desc    Get all tasks for logged in user (supports status, priority, category, search filters)
router.get('/', taskController.getTasks);

// @route   GET api/tasks/:id
// @desc    Get a single task by ID
router.get('/:id', taskController.getTaskById);

// @route   POST api/tasks
// @desc    Create a new task
router.post('/', taskController.createTask);

// @route   PUT api/tasks/:id
// @desc    Update an existing task
router.put('/:id', taskController.updateTask);

// @route   DELETE api/tasks/:id
// @desc    Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
