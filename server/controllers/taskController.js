const asyncHandler = require('express-async-handler')
const Task = require('../models/Task')

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id })
  res.status(200).json(tasks)
})

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400)
    throw new Error('Please add a title')
  }

  const task = await Task.create({
    user: req.user.id,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status || 'pending'
  })

  res.status(201).json(task)
})

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    res.status(400)
    throw new Error('Task not found')
  }

  // Check for user
  if (task.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })

  res.status(200).json(updatedTask)
})

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    res.status(400)
    throw new Error('Task not found')
  }

  // Check for user
  if (task.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await task.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
}