import { IconType } from 'react-icons';

interface StatsCardProps {
  icon: IconType;
  label: string;
  count: number | string;
  colorClass: string;
}

const StatsCard = ({ icon: Icon, label, count, colorClass }: StatsCardProps) => {
  return (
    <div className={`glass-card stats-card ${colorClass} animate-in`}>
      <div className="stats-icon">
        <Icon size={24} />
      </div>
      <div className="stats-info">
        <span className="stats-count">{count}</span>
        <span className="stats-label">{label}</span>
      </div>
    </div>
  );
};

export default StatsCard;
