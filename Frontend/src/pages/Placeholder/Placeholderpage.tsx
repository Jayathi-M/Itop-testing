import './Placeholderpage.css'

interface PlaceholderpageProps {
  title: string
}

export default function PlaceholderPage({ title }: PlaceholderpageProps) {
  return (
    <div className="placeholder">
      <div className="placeholder__body">
        <div className="placeholder__icon">⚙</div>
        <div className="placeholder__title">{title}</div>
        <div className="placeholder__desc">
          This page is under construction.<br />
          It will be replaced with the real page soon.
        </div>
      </div>
    </div>
  )
}
