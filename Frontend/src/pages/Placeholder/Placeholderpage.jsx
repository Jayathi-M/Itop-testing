
import Topbar from "../../layouts/Mainlayout.jsx";
import './Placeholderpage.css';

export default function PlaceholderPage({ title }) {
  return (
    <div className="placeholder">
      <Topbar />
      <div className="placeholder__body">
        <div className="placeholder__icon">⚙</div>
        <div className="placeholder__title">{title}</div>
        <div className="placeholder__desc">
          This page is under construction.<br />
          It will be replaced with the real page soon.
        </div>
      </div>
    </div>
  );
}