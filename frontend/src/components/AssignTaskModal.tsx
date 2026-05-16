import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Task, User } from '../types';

interface AssignTaskModalProps {
  task: Task;
  users: User[];
  onSubmit: (taskId: string, data: { assigneeId: string }) => Promise<void>;
  onCancel: () => void;
}

const AssignTaskModal = ({ task, users = [], onSubmit, onCancel }: AssignTaskModalProps) => {
  const [assigneeId, setAssigneeId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!assigneeId) {
      toast.error('Please select a user');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(task.identity, { assigneeId });
      toast.success('Task assigned successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <p className="form-info">Assign "<strong>{task?.title}</strong>" to a user:</p>
      <div className="form-group">
        <label htmlFor="assign-user">Select User</label>
        <select id="assign-user" className="input-field" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} required>
          <option value="">Choose a user...</option>
          {users.map((u) => (<option key={u.identity} value={u.identity}>{u.name} ({u.email})</option>))}
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Assign'}
        </button>
      </div>
    </form>
  );
};

export default AssignTaskModal;
