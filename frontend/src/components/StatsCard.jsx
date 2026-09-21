import { ArrowUpRight } from 'lucide-react';
export default function StatsCard({ label, value, icon: Icon, trend, tone = 'violet' }) { return <div className={`stat-card stat-${tone}`}><div className="stat-icon"><Icon size={19} /></div><div><p>{label}</p><strong>{value}</strong><span className="stat-trend"><ArrowUpRight size={13} /> {trend || 'Live overview'}</span></div></div>; }
