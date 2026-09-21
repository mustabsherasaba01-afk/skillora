export default function Loader({ fullPage = false }) { return <div className={`loader-wrap ${fullPage ? 'loader-full' : ''}`}><span className="loader" /></div>; }
