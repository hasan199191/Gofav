import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProjectRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary-500">
          Loading...
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to campaigns if not a project owner
  if (!user?.isProjectOwner) {
    return <Navigate to="/campaigns\" replace />;
  }

  // Render the protected route for project owners
  return <Outlet />;
};

export default ProjectRoute;