import { useState } from 'react'

const TaskItem = ({ task, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{task.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ')}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
      {task.description && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400 hover:underline"
          >
            {isExpanded ? 'Hide description' : 'Show description'}
          </button>
          {isExpanded && (
            <p className="mt-2 text-gray-600 dark:text-gray-300">{task.description}</p>
          )}
        </>
      )}
    </div>
  )
}

export default TaskItem