import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
export default function DashboardLayout() { const [open, setOpen] = useState(false); const { user } = useAuth(); return <div className="workspace"><Sidebar open={open} onClose={() => setOpen(false)} /><div className="workspace-main"><header className="workspace-topbar"><button className="icon-btn mobile-only" onClick={() => setOpen(true)}><Menu size={20} /></button><div><span className="workspace-kicker">{user?.role === 'freelancer' ? 'Freelancer workspace' : 'Client workspace'}</span><h1>Good morning, {user?.name?.split(' ')[0] || 'friend'} <span className="wave">✦</span></h1></div><div className="workspace-actions"><button className="topbar-search"><span>⌕</span> Search workspace <kbd>⌘ K</kbd></button><span className="avatar avatar-sm">{user?.name?.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span></div></header><div className="workspace-content"><Outlet /></div></div></div>; }
