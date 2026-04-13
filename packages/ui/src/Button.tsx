interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({
  label,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} data-variant={variant}>
      {label}
    </button>
  );
};

export default Button;
