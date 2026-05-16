import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  LuClock, LuLoader, LuCircleCheck, LuSearch, LuListTodo, 
  LuLayoutGrid, LuLayoutList, LuChevronLeft, LuChevronRight 
} from 'react-icons/lu';
import Header from '../../components/layout/Header';
import StatsCard from '../../components/common/StatsCard';
import EmptyState from '../../components/common/EmptyState';
import TaskCard from '../../components/TaskCard';
import { getTasksAPI, updateTaskStatusAPI } from '../../api/task.api';
import { TASK_STATUSES } from '../../utils/constants';
import { Task } from '../../types';
import './UserDashboard.css';

const UserDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasksAPI({ page, limit: 12 });
      if (res.data.status) {
        setTasks(res.data.data);
        setMeta(res.data.pagination || {});
      }
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [page]);

  const stats = {
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  const filteredTasks = tasks.filter((t) => {
    const statusMatch = activeFilter === 'ALL' || t.status === activeFilter;
    const titleMatch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && titleMatch;
  });

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTaskStatusAPI(taskId, { status });
      toast.success('Status updated');
      fetchTasks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <Header title="My Dashboard" />

      {/* Stats */}
      <section className="stats-grid stats-4-cols">
        <StatsCard icon={LuListTodo} label="Total Tasks" count={tasks.length} colorClass="stats-total" />
        <StatsCard icon={LuClock} label="Pending" count={stats.pending} colorClass="stats-pending" />
        <StatsCard icon={LuLoader} label="In Progress" count={stats.inProgress} colorClass="stats-progress" />
        <StatsCard icon={LuCircleCheck} label="Completed" count={stats.completed} colorClass="stats-completed" />
      </section>

      {/* My Tasks */}
      <section className="dashboard-section">
        <div className="section-header">
          <h3>My Tasks ({tasks.length})</h3>
          <div className="header-actions">
            <div className="view-toggle glass-card">
              <button 
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LuLayoutGrid size={18} />
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <LuLayoutList size={18} />
              </button>
            </div>
            <div className="search-box glass-card" style={{ maxWidth: '300px' }}>
              <LuSearch size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by task title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="filter-tabs">
          {['ALL', ...TASK_STATUSES].map((f) => (
            <button
              key={f}
              className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'ALL' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {viewMode === 'grid' ? (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.identity}
                task={task}
                showAssignee={false}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="users-table-wrap glass-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.identity}>
                    <td className="cell-name">{task.title}</td>
                    <td>
                      <select 
                        className="status-select"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.identity, e.target.value)}
                      >
                        {TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="cell-date">{new Date(task.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filteredTasks.length === 0 && (
          <EmptyState message="No tasks assigned to you yet" />
        )}

        {/* Pagination */}
        <div className="pagination-wrap">
          <button 
            disabled={meta.page <= 1} 
            onClick={() => setPage(meta.page - 1)}
            className="btn-icon"
          >
            <LuChevronLeft size={20} />
          </button>
          <span className="page-info">Page {meta.page || 1} of {meta.totalPages || 1}</span>
          <button 
            disabled={meta.page >= meta.totalPages} 
            onClick={() => setPage(meta.page + 1)}
            className="btn-icon"
          >
            <LuChevronRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
