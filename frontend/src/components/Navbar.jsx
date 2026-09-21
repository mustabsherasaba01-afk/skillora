import { Bell, BriefcaseBusiness, ChevronDown, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { initials } from '../utils/formatters';

export default function Navbar() {
  const { user, logout } = useAuth(); const { theme, toggleTheme } = useTheme(); const navigate = useNavigate(); const [open, setOpen] = useState(false);
  return <header className="navbar"><div className="nav-inner"><Link className="brand" to="/"><span className="brand-mark"><BriefcaseBusiness size={18} /></span><span>skillora<span className="brand-dot">.</span></span></Link><nav className={`nav-links ${open ? 'nav-open' : ''}`}><NavLink to="/explore">Explore work</NavLink><NavLink to="/freelancers">Find talent</NavLink><NavLink to="/how-it-works">How it works</NavLink></nav><div className="nav-actions"><button className="icon-btn search-toggle" aria-label="Search" onClick={() => navigate('/explore')}><Search size={18} /></button><button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>{user ? <><button className="icon-btn notification-toggle" aria-label="Notifications" onClick={() => navigate('/notifications')}><Bell size={18} /><i /></button><button className="profile-chip" onClick={() => navigate('/app')}><span className="avatar avatar-sm">{initials(user.name)}</span><span className="profile-chip-name">{user.name?.split(' ')[0]}</span><ChevronDown size={14} /></button></> : <><Link className="nav-login" to="/login">Log in</Link><Link className="btn btn-primary nav-cta" to="/register">Join free <span>↗</span></Link></>}<button className="icon-btn menu-toggle" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={20} /> : <Menu size={20} />}</button></div></div></header>;
}
