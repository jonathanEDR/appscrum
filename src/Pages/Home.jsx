import React, { useEffect } from 'react'; 
import { useUser } from '@clerk/clerk-react';  
import { useNavigate } from 'react-router-dom';  
import { Link } from 'react-router-dom';

function Home() {
  const { user } = useUser(); 
  const navigate = useNavigate();  

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]); 

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8 bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              Bienvenido a AppScrum
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tu plataforma integral para la gestión ágil de proyectos y equipos de desarrollo
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            {[
              {
                title: "Gestión de Sprints",
                description: "Planifica y organiza tus sprints de manera eficiente",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                )
              },
              {
                title: "Colaboración en Equipo",
                description: "Trabaja de manera efectiva con tu equipo en tiempo real",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                )
              },
              {
                title: "Seguimiento de Progreso",
                description: "Monitorea el avance de tus proyectos en tiempo real",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                )
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/sign-in"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/sign-up"
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-200"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;  
}

export default Home;
