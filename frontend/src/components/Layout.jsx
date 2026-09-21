import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
export default function Layout({ footer = true }) { return <><Navbar /><main><Outlet /></main>{footer && <Footer />}</>; }
