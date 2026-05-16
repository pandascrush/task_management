import { LuInbox } from 'react-icons/lu';
import { IconType } from 'react-icons';

interface EmptyStateProps {
  message?: string;
  icon?: IconType;
}

const EmptyState = ({ message = 'No data available', icon: Icon = LuInbox }: EmptyStateProps) => (
  <div className="empty-state">
    <Icon size={48} />
    <p>{message}</p>
  </div>
);

export default EmptyState;
