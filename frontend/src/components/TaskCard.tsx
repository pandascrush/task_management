import TaskStatusBadge from './TaskStatusBadge';
import { TASK_STATUSES } from '../utils/constants';
import { LuUser, LuCalendar } from 'react-icons/lu';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  showAssignee?: boolean;
  onStatusChange?: (id: string, status: string) => void;
  onAssign?: (task: Task) => void;
}

const TaskCard = ({ task, showAssignee = true, onStatusChange, onAssign }: TaskCardProps) => {
  return (
    <div className="task-card glass-card animate-in">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <TaskStatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-meta">
        {showAssignee && (
          <div className="task-meta-item">
            <LuUser size={14} />
            <span>{task.assignee ? task.assignee.name : 'Unassigned'}</span>
          </div>
        )}
        <div className="task-meta-item">
          <LuCalendar size={14} />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="task-card-actions">
        {onStatusChange && (
          <select
            className="status-select"
            value={task.status}
            onChange={(e) => onStatusChange(task.identity, e.target.value)}
            id={`status-select-${task.identity}`}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        )}
        {onAssign && !task.assignee && (
          <button
            className="btn-sm btn-outline"
            onClick={() => onAssign(task)}
            id={`assign-btn-${task.identity}`}
          >
            Assign
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
