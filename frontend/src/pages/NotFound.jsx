import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function NotFound() { return <div className="not-found"><div className="not-found-mark"><Compass size={34} /></div><span className="eyebrow">404 / off the map</span><h1>This page took<br /><em>a different route.</em></h1><p>Let’s get you back somewhere good.</p><Link className="btn btn-primary" to="/"><ArrowLeft size={16} /> Back home</Link></div>; }
