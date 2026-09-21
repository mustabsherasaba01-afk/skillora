import { Bell, CheckCircle2, FileText, MessageCircle, Star, WalletCards } from 'lucide-react';
import { timeAgo } from '../utils/formatters';
const icons = { proposal: FileText, proposalAccepted: CheckCircle2, message: MessageCircle, review: Star, projectCompleted: WalletCards };
export default function NotificationItem({ notification }) { const Icon = icons[notification.type] || Bell; return <div className={`notification-item ${notification.isRead ? '' : 'unread'}`}><div className="notification-icon"><Icon size={17} /></div><div><p>{notification.message}</p><small>{timeAgo(notification.createdAt)}</small></div><span className="notification-dot" /></div>; }
