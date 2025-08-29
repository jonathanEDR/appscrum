import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { signOut } = useClerk();  // Clerk hook para cerrar sesión
  const navigate = useNavigate();   // React Router hook para redirigir

  const handleLogout = () => {
    signOut();  // Llama al método signOut de Clerk para cerrar la sesión
    navigate('/sign-in');  // Redirige al usuario a la página de login después de cerrar sesión
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-red-300 rounded-lg hover:bg-red-500/20 transition-all duration-300 font-medium border border-white/10 hover:border-red-400/50 w-full"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;
