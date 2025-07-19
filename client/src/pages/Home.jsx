import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'
import AuthContext from '../context/AuthContext'
import taskService from '../services/tasks'
import TaskStats from '../components/TaskStats'

const Home = () => {
  const { user } = useContext(AuthContext)
  const history = useHistory()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (!user) {
      history.push('/login')
      return
    }

    const fetchTasks = async () => {
      try {
        const tasksData = await taskService.getTasks(user.token)
        setTasks(tasksData)
      } catch (error) {
        toast.error('Failed to fetch tasks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [user, history])

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData, user.token)
      setTasks([...tasks, newTask])
      setIsFormOpen(false)
      toast.success('Task created successfully')
    } catch (error) {
      toast.error('Failed to create task')
    }
  }

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskService.updateTask(currentTask._id, taskData, user.token)
      setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task))
      setCurrentTask(null)
      toast.success('Task updated successfully')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId, user.token)
      setTasks(tasks.filter(task => task._id !== taskId))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      {filteredTasks.length > 0 && <TaskStats tasks={filteredTasks} />}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Tasks</h1>
        <button
          onClick={() => {
            setCurrentTask(null)
            setIsFormOpen(true)
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add New Task
        </button>

      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Tasks
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {isFormOpen && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <TaskForm
            onSubmit={currentTask ? handleUpdateTask : handleCreateTask}
            initialData={currentTask || {}}
            onCancel={() => {
              setIsFormOpen(false)
              setCurrentTask(null)
            }}
          />
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {tasks.length === 0 ? 'You have no tasks yet.' : 'No tasks match your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={(task) => {
                setCurrentTask(task)
                setIsFormOpen(true)
              }}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home