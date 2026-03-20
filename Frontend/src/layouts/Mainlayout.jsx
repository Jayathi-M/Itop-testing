import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar/Sidebar.jsx';
import Header  from '../components/Layout/Header/Header.jsx';
import './Mainlayout.css';

export default function Mainlayout() {
  return (
    <div className="layout">

      {/* ── Row 1: Full-width header ── */}
      <div className="layout__header">
        <Header />
      </div>

      {/* ── Row 2: Sidebar + page content ── */}
      <div className="layout__body">
        <Sidebar />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}