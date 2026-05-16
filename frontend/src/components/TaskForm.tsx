import { useState, ChangeEvent, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { User } from '../types';

interface TaskFormProps {
  users: User[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const TaskForm = ({ users = [], onSubmit, onCancel }: TaskFormProps) => {
  const [form, setForm] = useState({ title: '', description: '', assigneeId: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    try {
      const data: any = { ...form };
      if (!data.assigneeId) delete data.assigneeId;
      await onSubmit(data);
      toast.success('Task created successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="task-title">Title</label>
        <input id="task-title" name="title" className="input-field" placeholder="Task title" value={form.title} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="task-description">Description</label>
        <textarea id="task-description" name="description" className="input-field textarea" placeholder="Task description (optional)" value={form.description} onChange={handleChange} rows={3} />
      </div>
      <div className="form-group">
        <label htmlFor="task-assignee">Assign To</label>
        <select id="task-assignee" name="assigneeId" className="input-field" value={form.assigneeId} onChange={handleChange}>
          <option value="">Unassigned</option>
          {users.map((u) => (<option key={u.identity} value={u.identity}>{u.name} ({u.email})</option>))}
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
