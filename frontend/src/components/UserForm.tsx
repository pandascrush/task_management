import { useState, ChangeEvent, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { ROLES } from '../utils/constants';

interface UserFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const UserForm = ({ onSubmit, onCancel }: UserFormProps) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
      toast.success('User created successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="user-name">Name</label>
        <input id="user-name" name="name" className="input-field" placeholder="Full name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="user-email">Email</label>
        <input id="user-email" name="email" type="email" className="input-field" placeholder="Email address" value={form.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="user-password">Password</label>
        <input id="user-password" name="password" type="password" className="input-field" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
      </div>
      <div className="form-group">
        <label htmlFor="user-role">Role</label>
        <select id="user-role" name="role" className="input-field" value={form.role} onChange={handleChange}>
          {ROLES.map((r) => (<option key={r} value={r}>{r}</option>))}
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
