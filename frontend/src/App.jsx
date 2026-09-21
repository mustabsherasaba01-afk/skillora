import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CreateProject from './pages/CreateProject';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './pages/DashboardLayout';
import ExploreProjects from './pages/ExploreProjects';
import FreelancerProfile from './pages/FreelancerProfile';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Messages from './pages/Messages';
import MyProjects from './pages/MyProjects';
import MyProposals from './pages/MyProposals';
import NotFound from './pages/NotFound';
import Notifications from './pages/Notifications';
import Portfolio from './pages/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import ProjectWorkspace from './pages/ProjectWorkspace';
import Register from './pages/Register';
import Reviews from './pages/Reviews';
import SimplePage from './pages/SimplePage';
import SubmitProposal from './pages/SubmitProposal';

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explore" element={<ExploreProjects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/projects/:id/proposal" element={<SubmitProposal />} />
      <Route path="/projects/:id/workspace" element={<ProjectWorkspace />} />
      <Route path="/freelancers/:id" element={<FreelancerProfile />} />
      <Route path="/freelancers" element={<ExploreProjects freelancersOnly />} />
      <Route path="/how-it-works" element={<Landing />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<MyProjects />} />
          <Route path="proposals" element={<MyProposals />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="active" element={<MyProjects activeOnly />} />
          <Route path="freelancers" element={<SimplePage title="People you’ve hired." label="Your talent" />} />
          <Route path="settings" element={<SimplePage title="Make it yours." label="Settings" />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>;
}
