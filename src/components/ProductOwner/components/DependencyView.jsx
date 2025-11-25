import React from 'react';
import { ArrowRight, Link, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const DependencyView = ({ releases, sprints }) => {
  const { theme } = useTheme();
  // Detectar dependencias automáticamente basadas en fechas y releases
  const detectarDependencias = () => {
    const dependencias = [];
    
    // NUEVA LÓGICA: Detectar dependencias entre sprints basándose en fechas
    // En lugar de usar release.sprints, agrupar sprints por proximidad temporal
    const sprintsOrdenados = sprints
      .filter(s => s.fecha_inicio && s.fecha_fin)
      .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));
    
    // Crear dependencias secuenciales entre sprints
    for (let i = 0; i < sprintsOrdenados.length - 1; i++) {
      const sprintActual = sprintsOrdenados[i];
      const sprintSiguiente = sprintsOrdenados[i + 1];
      
      // Solo crear dependencia si hay overlap temporal o secuencia lógica
      const finActual = new Date(sprintActual.fecha_fin);
      const inicioSiguiente = new Date(sprintSiguiente.fecha_inicio);
      const diasEntre = Math.ceil((inicioSiguiente - finActual) / (1000 * 60 * 60 * 24));
      
      // Si hay menos de 30 días entre sprints, considerarlos dependientes
      if (Math.abs(diasEntre) <= 30) {
        const dep = {
          id: `${sprintActual._id}-${sprintSiguiente._id}`,
          from: sprintActual,
          to: sprintSiguiente,
          type: 'sprint-sequence',
          diasEntre: diasEntre
        };
        dependencias.push(dep);
      }
    }
    
    // Detectar dependencias entre releases (mantener lógica original pero mejorada)
    const releasesParaDependencias = releases
      .filter(r => r.fecha_objetivo) // Asegurar que tenga fecha objetivo
      .sort((a, b) => new Date(a.fecha_objetivo) - new Date(b.fecha_objetivo));
    
    for (let i = 0; i < releasesParaDependencias.length - 1; i++) {
      const releaseActual = releasesParaDependencias[i];
      const releaseSiguiente = releasesParaDependencias[i + 1];
      
      const dep = {
        id: `${releaseActual._id}-${releaseSiguiente._id}`,
        from: releaseActual,
        to: releaseSiguiente,
        type: 'release-sequence'
      };
      dependencias.push(dep);
    }
    
    // NUEVA FUNCIONALIDAD: Dependencias release-sprint
    // Conectar releases con sprints basándose en fechas
    releases.forEach(release => {
      const fechaObjetivo = new Date(release.fecha_objetivo);
      
      // Encontrar sprints que terminen cerca de la fecha objetivo del release
      const sprintsRelacionados = sprints.filter(sprint => {
        const finSprint = new Date(sprint.fecha_fin);
        const diasDiferencia = Math.abs((fechaObjetivo - finSprint) / (1000 * 60 * 60 * 24));
        return diasDiferencia <= 14; // Sprints que terminan dentro de 2 semanas del release
      });
      
      if (sprintsRelacionados.length > 0) {
        sprintsRelacionados.forEach(sprint => {
          const dep = {
            id: `${sprint._id}-${release._id}`,
            from: sprint,
            to: release,
            type: 'sprint-to-release'
          };
          dependencias.push(dep);
        });
      }
    });
    
    return dependencias;
  };

  const dependencias = detectarDependencias();

  return (
    <div className={`rounded-lg shadow-sm p-6 ${
      theme === 'dark' 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-6">
        <Link className={`h-5 w-5 ${
          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
        }`} />
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Mapa de Dependencias</h3>
      </div>
      
      {dependencias.length === 0 ? (
        <div className="text-center py-8">
          <Link className={`h-12 w-12 mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            No hay dependencias detectadas
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dependencias de Releases */}
          <div>
            <h4 className={`font-medium mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Dependencias entre Releases</h4>
            <div className="space-y-3">
              {dependencias
                .filter(d => d.type === 'release-sequence')
                .map(dep => (
                  <div key={dep.id} className={`flex items-center gap-4 p-3 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-purple-900/30 border border-purple-800' 
                      : 'bg-purple-50 border border-purple-200'
                  }`}>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{dep.from.nombre}</p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>v{dep.from.version}</p>
                    </div>
                    
                    <ArrowRight className={`h-5 w-5 flex-shrink-0 ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                    
                    <div className="flex-1">
                      <p className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{dep.to.nombre}</p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>v{dep.to.version}</p>
                    </div>
                    
                    {/* Indicador de riesgo */}
                    {(() => {
                      const fechaFromObjetivo = new Date(dep.from.fecha_objetivo);
                      const fechaToObjetivo = new Date(dep.to.fecha_objetivo);
                      const diasEntre = Math.ceil((fechaToObjetivo - fechaFromObjetivo) / (1000 * 60 * 60 * 24));
                      
                      if (diasEntre < 7) {
                        return (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-xs">Riesgo alto</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                ))}
            </div>
          </div>

          {/* Dependencias de Sprints */}
          <div>
            <h4 className={`font-medium mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Secuencia de Sprints</h4>
            <div className="space-y-3">
              {dependencias
                .filter(d => d.type === 'sprint-sequence')
                .map(dep => (
                  <div key={dep.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border border-blue-800' 
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {dep.from.nombre}
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(dep.from.fecha_inicio).toLocaleDateString()} - 
                        {new Date(dep.from.fecha_fin).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <ArrowRight className={`h-4 w-4 flex-shrink-0 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {dep.to.nombre}
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(dep.to.fecha_inicio).toLocaleDateString()} - 
                        {new Date(dep.to.fecha_fin).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {dep.diasEntre !== undefined && (
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {dep.diasEntre > 0 ? `+${dep.diasEntre}d` : `${dep.diasEntre}d`}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Dependencias Sprint → Release */}
          <div>
            <h4 className={`font-medium mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Sprint → Release</h4>
            <div className="space-y-3">
              {dependencias
                .filter(d => d.type === 'sprint-to-release')
                .map(dep => (
                  <div key={dep.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-green-900/30 border border-green-800' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {dep.from.nombre}
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Sprint: {new Date(dep.from.fecha_fin).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <ArrowRight className={`h-4 w-4 flex-shrink-0 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {dep.to.nombre}
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Release: {new Date(dep.to.fecha_objetivo).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DependencyView;
