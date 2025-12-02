import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  userRole: string | undefined;
  allowedRoles: string[];
  children: JSX.Element;
}

const ProtectedRoute = ({ userRole, allowedRoles, children }: ProtectedRouteProps) => {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
