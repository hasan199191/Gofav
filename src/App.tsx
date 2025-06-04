import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Mindshare from './pages/Mindshare';
import Loyalty from './pages/Loyalty';
import AboutToken from './pages/AboutToken';
import HowItWorks from './pages/HowItWorks';
import ProjectDashboard from './pages/ProjectDashboard';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProjectRoute from './components/auth/ProjectRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="callback" element={<AuthCallback />} />
        <Route path="about-token" element={<AboutToken />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        
        {/* Protected routes for authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/:id" element={<CampaignDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="mindshare" element={<Mindshare />} />
          <Route path="loyalty" element={<Loyalty />} />
        </Route>
        
        {/* Protected routes for project owners */}
        <Route element={<ProjectRoute />}>
          <Route path="project/dashboard" element={<ProjectDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;