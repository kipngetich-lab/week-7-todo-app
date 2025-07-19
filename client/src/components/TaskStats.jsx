const TaskStats = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    pending: tasks.filter(task => task.status === 'pending').length
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Task Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} color="bg-blue-100 dark:bg-blue-900" />
        <StatCard label="Completed" value={stats.completed} color="bg-green-100 dark:bg-green-900" />
        <StatCard label="In Progress" value={stats.inProgress} color="bg-yellow-100 dark:bg-yellow-900" />
        <StatCard label="Pending" value={stats.pending} color="bg-red-100 dark:bg-red-900" />
      </div>
    </div>
  )
}

const StatCard = ({ label, value, color }) => (
  <div className={`${color} p-3 rounded-lg text-center`}>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm">{label}</div>
  </div>
)

export default TaskStats