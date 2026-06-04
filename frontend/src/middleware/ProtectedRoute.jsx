import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const roleLoginMap = {
  admin: '/auth/admin',
  agent: '/auth/agent',
  debtor: '/auth/debtor',
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const location = useLocation();

  //not logged in send to correct login page
  if (!isAuthenticated) {
    const loginPath = roleLoginMap[allowedRoles[0]] || '/start';

    return (
      <Navigate
        to={loginPath}
        replace
        state={{ from: location }}
      />
    );
  }

  // logged in but wrong role
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    const loginPath = roleLoginMap[role] || '/start';

    return <Navigate to={loginPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
