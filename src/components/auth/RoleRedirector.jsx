import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext.jsx';

const roleToDashboard = {
  super_admin: '/super-admin/dashboard',
  product_owner: '/product-owner/dashboard',
  scrum_master: '/scrum-master/dashboard',
  developers: '/developers/dashboard',
  user: '/user/dashboard',
};

export default function RoleRedirector() {
  const { role, isLoaded } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;
    if (!role) {
      navigate('/login', { replace: true });
      return;
    }
    const path = roleToDashboard[role] || '/dashboard';
    navigate(path, { replace: true });
  }, [role, isLoaded, navigate]);

  return null;
}
