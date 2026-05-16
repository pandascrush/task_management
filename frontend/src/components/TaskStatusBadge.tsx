const TaskStatusBadge = ({ status }: { status: string }) => {
  return (
    <span className={`status-badge ${status.toLowerCase().replace('_', '-')}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default TaskStatusBadge;
