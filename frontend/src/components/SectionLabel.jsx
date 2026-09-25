import { useScrollAnimation } from '../hooks/useScrollAnimation'

/**
 * Section label with number + title.
 * Example: 01 / ABOUT
 * 
 * Props:
 * - number: section number (e.g. "01")
 * - title: section label (e.g. "ABOUT")
 */
export default function SectionLabel({ number, title }) {
  const ref = useScrollAnimation({ opacity: 0, x: -20 })

  return (
    <div
      ref={ref}
      className="flex items-center gap-3 mb-12"
    >
      <span
        className="text-micro"
        style={{ color: 'var(--color-accent-blue)' }}
      >
        {number}
      </span>
      <span
        style={{
          width: '40px',
          height: '1px',
          background: 'var(--color-border-medium)',
          display: 'block',
        }}
      />
      <span className="text-micro">
        {title}
      </span>
    </div>
  )
}
