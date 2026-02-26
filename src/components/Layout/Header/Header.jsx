import logoImg from '../../../assets/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Header.css';

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar__logo">
        <img src={logoImg} alt="Logo" className="topbar__logo-img" />
      </div>
      <button className="topbar__profile" title="Profile">
        <i className="fa-solid fa-user" />
      </button>
    </header>
  );
}