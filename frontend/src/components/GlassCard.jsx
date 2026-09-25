/**
 * Glass-morphism card component.
 * 
 * Props:
 * - children: card content
 * - className: additional classes
 * - variant: 'default' | 'strong' | 'accent'
 * - hover: enable hover glow (default: true)
 * - style: passthrough styles
 */
export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  hover = true,
  style = {},
  ...rest
}) {
  const variants = {
    default: {
      background: 'var(--color-glass-bg)',
      border: '1px solid var(--color-glass-border)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
    },
    strong: {
      background: 'var(--color-glass-bg-strong)',
      border: '1px solid var(--color-glass-border)',
      backdropFilter: 'blur(var(--blur-lg))',
      WebkitBackdropFilter: 'blur(var(--blur-lg))',
    },
    accent: {
      background: 'var(--color-glass-bg)',
      border: '1px solid var(--color-border-accent)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
    },
  }

  return (
    <div
      className={`${className}`}
      style={{
        ...variants[variant],
        borderRadius: 'var(--radius-lg)',
        transition: hover
          ? `box-shadow var(--duration-normal) var(--ease-out-quart), border-color var(--duration-normal) ease`
          : undefined,
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-glow-blue)'
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.15)'
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = variant === 'accent'
          ? 'rgba(59, 130, 246, 0.3)'
          : 'var(--color-glass-border)'
      } : undefined}
      {...rest}
    >
      {children}
    </div>
  )
}
