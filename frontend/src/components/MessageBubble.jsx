import { CheckCheck } from 'lucide-react';
export default function MessageBubble({ message, own = false }) { return <div className={`message-line ${own ? 'message-own' : ''}`}><div className="message-bubble"><p>{message.text}</p><small>{new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {own && <CheckCheck size={13} />}</small></div></div>; }
