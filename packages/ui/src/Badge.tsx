interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Badge = ({ label, variant = 'default' }: BadgeProps) => {
  return <span data-variant={variant}>{label}</span>;
};

export default Badge;
