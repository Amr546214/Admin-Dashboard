import styles from './Button.module.css';

export function Button({
  children,
  variant = 'primary',
  size,
  type = 'button',
  disabled,
  className = '',
  fullWidth,
  ...props
}) {
  const classNames = [
    styles.btn,
    styles[variant],
    size && styles[size],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classNames} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
