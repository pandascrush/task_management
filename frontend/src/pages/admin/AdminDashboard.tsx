import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { 
  LuListTodo, LuClock, LuLoader, LuCircleCheck, LuPlus, LuUsers, 
  LuLayoutGrid, LuLayoutList, LuFilter, LuSearch, LuChevronLeft, LuChevronRight
} from 'react-icons/lu';
import Header from '../../components/layout/Header';
import StatsCard from '../../components/common/StatsCard';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import TaskCard from '../../components/TaskCard';
import UserForm from '../../components/UserForm';
import TaskForm from '../../components/TaskForm';
import AssignTaskModal from '../../components/AssignTaskModal';
import { getTasksAPI, createTaskAPI, assignTaskAPI, updateTaskStatusAPI } from '../../api/task.api';
import { getUsersAPI, createUserAPI } from '../../api/user.api';
import { TASK_STATUSES } from '../../utils/constants';
import { Task, User, TaskStatus } from '../../types';
import './AdminDashboard.css';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdminDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'TASKS' | 'USERS'>('TASKS');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [userFilter, setUserFilter] = useState<string>('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [assigningTask, setAssigningTask] = useState<Task | null>(null);

  // Pagination states
  const [taskPage, setTaskPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [taskMeta, setTaskMeta] = useState<Partial<PaginationMeta>>({});
  const [userMeta, setUserMeta] = useState<Partial<PaginationMeta>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, usersRes] = await Promise.all([
        getTasksAPI({ page: taskPage, limit: 12 }),
        getUsersAPI({ page: userPage, limit: 10, excludeAdmins: true })
      ]);
      
      if (tasksRes.data.status) {
        setTasks(tasksRes.data.data);
        setTaskMeta(tasksRes.data.pagination || {});
      }
      if (usersRes.data.status) {
        setUsers(usersRes.data.data);
        setUserMeta(usersRes.data.pagination || {});
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [taskPage, userPage]);

  const stats = {
    total: taskMeta.total || 0,
    users: userMeta.total || 0,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  const filteredTasks = tasks.filter((t) => {
    const statusMatch = activeFilter === 'ALL' || t.status === activeFilter;
    const userMatch = userFilter === 'ALL' || t.assigneeId === userFilter;
    
    const searchLower = taskSearch.toLowerCase();
    const titleMatch = t.title.toLowerCase().includes(searchLower);
    const assigneeMatch = t.assignee?.name.toLowerCase().includes(searchLower);
    
    return statusMatch && userMatch && (titleMatch || assigneeMatch);
  });

  const searchableUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  const handleCreateUser = async (data: any) => {
    await createUserAPI(data);
    setShowUserModal(false);
    fetchData();
  };

  const handleCreateTask = async (data: any) => {
    await createTaskAPI(data);
    setShowTaskModal(false);
    fetchData();
  };

  const handleAssign = async (taskId: string, data: any) => {
    await assignTaskAPI(taskId, data);
    setAssigningTask(null);
    fetchData();
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTaskStatusAPI(taskId, { status });
      toast.success('Status updated');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const Pagination = ({ meta, onPageChange }: { meta: Partial<PaginationMeta>, onPageChange: (p: number) => void }) => (
    <div className="pagination-wrap">
      <button 
        disabled={!meta.page || meta.page <= 1} 
        onClick={() => onPageChange((meta.page || 1) - 1)}
        className="btn-icon"
      >
        <LuChevronLeft size={20} />
      </button>
      <span className="page-info">Page {meta.page || 1} of {meta.totalPages || 1}</span>
      <button 
        disabled={!meta.page || !meta.totalPages || meta.page >= meta.totalPages} 
        onClick={() => onPageChange((meta.page || 1) + 1)}
        className="btn-icon"
      >
        <LuChevronRight size={20} />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Header title="Admin Dashboard" />

      {/* Stats - 4 Columns */}
      <section className="stats-grid stats-4-cols">
        <div 
          className={`stat-card-wrapper ${activeSection === 'TASKS' ? 'active-section' : ''}`}
          onClick={() => setActiveSection('TASKS')}
        >
          <StatsCard icon={LuListTodo} label="Tasks" count={stats.total} colorClass="stats-total" />
        </div>
        <div 
          className={`stat-card-wrapper ${activeSection === 'USERS' ? 'active-section' : ''}`}
          onClick={() => setActiveSection('USERS')}
        >
          <StatsCard icon={LuUsers} label="Users" count={stats.users} colorClass="stats-total" />
        </div>
        <div className="stat-card-wrapper no-click">
          <StatsCard icon={LuLoader} label="In Progress" count={stats.inProgress} colorClass="stats-progress" />
        </div>
        <div className="stat-card-wrapper no-click">
          <StatsCard icon={LuCircleCheck} label="Completed" count={stats.completed} colorClass="stats-completed" />
        </div>
      </section>

      {/* Conditional Sections */}
      {activeSection === 'USERS' && (
        <section className="dashboard-section animate-in">
          <div className="section-header">
            <h3><LuUsers size={20} /> Users ({userMeta.total || 0})</h3>
            <button className="btn-primary" onClick={() => setShowUserModal(true)} id="btn-create-user">
              <LuPlus size={16} /> Create User
            </button>
          </div>
          <div className="users-table-wrap glass-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.identity}>
                    <td className="cell-name">{u.name}</td>
                    <td className="cell-email">{u.email}</td>
                    <td><span className="role-badge user">USER</span></td>
                    <td className="cell-date">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <EmptyState message="No users found" />}
          </div>
          <Pagination meta={userMeta} onPageChange={setUserPage} />
        </section>
      )}

      {activeSection === 'TASKS' && (
        <section className="dashboard-section animate-in">
          <div className="section-header">
            <h3><LuListTodo size={20} /> Tasks ({taskMeta.total || 0})</h3>
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
              <button className="btn-primary" onClick={() => setShowTaskModal(true)} id="btn-create-task">
                <LuPlus size={16} /> Create Task
              </button>
            </div>
          </div>

          <div className="filters-bar">
            <div className="filter-group">
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
            </div>

            <div className="filter-group search-filter-wrap">
              <div className="search-box glass-card">
                <LuSearch size={14} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search tasks or users..." 
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                />
              </div>
              <div className="user-select-wrap">
                <select 
                  className="status-select" 
                  value={userFilter} 
                  onChange={(e) => setUserFilter(e.target.value)}
                >
                  <option value="ALL">All Users</option>
                  {searchableUsers.map(u => (
                    <option key={u.identity} value={u.identity}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.identity}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onAssign={(t) => setAssigningTask(t)}
                />
              ))}
            </div>
          ) : (
            <div className="users-table-wrap glass-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Assignee</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.identity}>
                      <td className="cell-name">{task.title}</td>
                      <td className="cell-email">{task.assignee?.name || 'Unassigned'}</td>
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
                      <td>
                        {!task.assignee && (
                          <button className="btn-sm btn-outline" onClick={() => setAssigningTask(task)}>Assign</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {filteredTasks.length === 0 && <EmptyState message="No tasks matching filters" />}
          
          <Pagination meta={taskMeta} onPageChange={setTaskPage} />
        </section>
      )}

      {/* Modals */}
      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title="Create User">
        <UserForm onSubmit={handleCreateUser} onCancel={() => setShowUserModal(false)} />
      </Modal>

      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Create Task">
        <TaskForm users={users} onSubmit={handleCreateTask} onCancel={() => setShowTaskModal(false)} />
      </Modal>

      <Modal isOpen={!!assigningTask} onClose={() => setAssigningTask(null)} title="Assign Task">
        {assigningTask && (
          <AssignTaskModal
            task={assigningTask}
            users={users}
            onSubmit={(taskId, data) => handleAssign(taskId, data)}
            onCancel={() => setAssigningTask(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
