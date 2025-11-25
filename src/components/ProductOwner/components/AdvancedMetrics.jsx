import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { TrendingUp, TrendingDown, Clock, Target, BarChart3 } from 'lucide-react';

const AdvancedMetrics = ({ releases, sprints }) => {
  const { theme } = useTheme();
  
  // Cálculos de métricas avanzadas
  const calcularVelocidadPromedio = () => {
    // Ajustar filtros para estados reales del backend
    const sprintsCompletados = sprints.filter(s => 
      s.estado === 'completado' || s.estado === 'completed' || s.estado === 'finalizado'
    );
    
    if (sprintsCompletados.length === 0) {
      // Si no hay sprints completados, usar todos los sprints como fallback
      const todosSprints = sprints.filter(s => s.velocidad_planificada || s.velocidad_real);
      if (todosSprints.length === 0) return 0;
      
      const velocidad = Math.round(
        todosSprints.reduce((sum, s) => sum + (s.velocidad_planificada || s.velocidad_real || 0), 0) / 
        todosSprints.length
      );
      return velocidad;
    }
    
    const velocidad = Math.round(
      sprintsCompletados.reduce((sum, s) => sum + (s.velocidad_planificada || 0), 0) / 
      sprintsCompletados.length
    );
    return velocidad;
  };

  const calcularTiempoPromedioRelease = () => {
    // Ajustar filtros para estados reales del backend
    const releasesLanzados = releases.filter(r => 
      (r.estado === 'lanzado' || r.estado === 'released' || r.estado === 'completado') && 
      r.fecha_lanzamiento
    );
    
    if (releasesLanzados.length === 0) {
      // Si no hay releases lanzados, usar todos los releases para estimar tiempo
      if (releases.length === 0) return 0;
      
      const tiempos = releases.map(r => {
        let inicio, fin;
        
        // Determinar fecha de inicio
        if (r.created_at) {
          inicio = new Date(r.created_at);
        } else if (r.fecha_objetivo) {
          inicio = new Date(r.fecha_objetivo);
          inicio.setDate(inicio.getDate() - 30); // 30 días antes como estimación
        } else {
          inicio = new Date();
          inicio.setDate(inicio.getDate() - 30);
        }
        
        // Determinar fecha de fin
        if (r.fecha_lanzamiento) {
          fin = new Date(r.fecha_lanzamiento);
        } else if (r.fecha_objetivo) {
          fin = new Date(r.fecha_objetivo);
        } else {
          fin = new Date();
        }
        
        const dias = Math.ceil(Math.abs(fin - inicio) / (1000 * 60 * 60 * 24));
        const diasFinal = Math.max(dias, 7); // Mínimo 7 días
        
        return diasFinal;
      });
      
      const promedio = Math.round(tiempos.reduce((sum, t) => sum + t, 0) / tiempos.length);
      return promedio;
    }
    
    const tiempos = releasesLanzados.map(r => {
      const inicio = new Date(r.created_at || r.fecha_objetivo);
      const fin = new Date(r.fecha_lanzamiento);
      const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
      return dias;
    });
    
    const promedio = Math.round(tiempos.reduce((sum, t) => sum + t, 0) / tiempos.length);
    return promedio;
  };

  const calcularTasaExito = () => {
    if (releases.length === 0) return 0;
    
    // Para releases lanzados, evaluar si fueron a tiempo o tardíos
    const releasesLanzados = releases.filter(r => 
      r.estado === 'lanzado' || r.estado === 'released' || r.estado === 'completado'
    );
    
    if (releasesLanzados.length > 0) {
      const exitosos = releasesLanzados.filter(r => {
        // Si no tiene fecha_objetivo, considerarlo exitoso
        if (!r.fecha_objetivo) {
          return true;
        }
        
        // Si no tiene fecha_lanzamiento, usar fecha actual
        const fechaLanzamiento = r.fecha_lanzamiento ? new Date(r.fecha_lanzamiento) : new Date();
        const fechaObjetivo = new Date(r.fecha_objetivo);
        
        // Dar margen de 7 días después de la fecha objetivo
        const fechaObjetivoConMargen = new Date(fechaObjetivo);
        fechaObjetivoConMargen.setDate(fechaObjetivoConMargen.getDate() + 7);
        
        const esExitoso = fechaLanzamiento <= fechaObjetivoConMargen;
        return esExitoso;
      });
      
      const tasa = Math.round((exitosos.length / releasesLanzados.length) * 100);
      return tasa;
    }
    
    // Para releases en desarrollo, usar progreso estimado
    const releasesConProgreso = releases.map(r => {
      let progresoReal = r.progreso || 0;
      
      // Si el release ya tiene fecha de lanzamiento pero estado planificado, considerar progreso alto
      if (r.fecha_lanzamiento && (r.estado === 'planificado' || r.estado === 'en_desarrollo')) {
        const fechaLanzamiento = new Date(r.fecha_lanzamiento);
        const ahora = new Date();
        
        if (Math.abs(fechaLanzamiento - ahora) < 24 * 60 * 60 * 1000) { // Menos de 24 horas
          progresoReal = 85; // Muy cerca del lanzamiento
        }
      }
      
      // Si progreso sigue siendo 0, estimar basado en tiempo
      if (progresoReal === 0 && r.fecha_objetivo) {
        const ahora = new Date();
        const fechaObjetivo = new Date(r.fecha_objetivo);
        
        // Usar created_at como fecha de inicio, o 30 días antes de la fecha objetivo como fallback
        let fechaInicio = r.created_at ? new Date(r.created_at) : new Date(fechaObjetivo);
        if (!r.created_at) {
          fechaInicio.setDate(fechaInicio.getDate() - 30); // 30 días antes como estimación
        }
        
        if (fechaInicio < ahora) {
          const tiempoTotal = Math.abs(fechaObjetivo - fechaInicio);
          const tiempoTranscurrido = Math.abs(ahora - fechaInicio);
          
          if (tiempoTotal > 0) {
            progresoReal = Math.round((tiempoTranscurrido / tiempoTotal) * 100);
            
            // Si ya pasó la fecha objetivo, dar progreso alto pero no 100%
            if (ahora > fechaObjetivo) {
              progresoReal = Math.max(progresoReal, 75);
            }
            
            // Asegurar que esté entre 10% y 95% para releases activos
            progresoReal = Math.max(10, Math.min(95, progresoReal));
          }
        }
      }
      
      // Mínimo 15% para releases que no están cancelados
      if (progresoReal === 0 && r.estado !== 'cancelado') {
        progresoReal = 15;
      }
      
      return { ...r, progresoReal };
    });
    
    const exitosos = releasesConProgreso.filter(r => r.progresoReal >= 30);
    const tasa = Math.round((exitosos.length / releases.length) * 100);
    return tasa;
  };

  const calcularTendencia = () => {
    const ultimosMeses = releases.filter(r => {
      const fecha = new Date(r.fecha_objetivo);
      const haceTreesMeses = new Date();
      haceTreesMeses.setMonth(haceTreesMeses.getMonth() - 3);
      return fecha >= haceTreesMeses;
    });
    
    const completados = ultimosMeses.filter(r => r.estado === 'lanzado').length;
    const total = ultimosMeses.length;
    
    return total > 0 ? Math.round((completados / total) * 100) : 0;
  };

  const velocidadPromedio = calcularVelocidadPromedio();
  const tiempoPromedioRelease = calcularTiempoPromedioRelease();
  const tasaExito = calcularTasaExito();
  const tendencia = calcularTendencia();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Velocidad Promedio */}
      <div className={`rounded-lg shadow-sm p-6 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-blue-900/30 text-blue-400' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Velocidad Promedio</p>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{velocidadPromedio}</p>
            </div>
          </div>
        </div>
        <div className={`w-full rounded-full h-2 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(velocidadPromedio * 10, 100)}%` }}
          ></div>
        </div>
        <p className={`text-xs mt-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>Story points por sprint</p>
      </div>

      {/* Tiempo Promedio Release */}
      <div className={`rounded-lg shadow-sm p-6 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-orange-900/30 text-orange-400' 
                : 'bg-orange-100 text-orange-600'
            }`}>
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Tiempo Promedio</p>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{tiempoPromedioRelease}</p>
            </div>
          </div>
        </div>
        <div className={`w-full rounded-full h-2 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div 
            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(tiempoPromedioRelease / 2, 100)}%` }}
          ></div>
        </div>
        <p className={`text-xs mt-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>Días por release</p>
      </div>

      {/* Tasa de Éxito */}
      <div className={`rounded-lg shadow-sm p-6 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-green-900/30 text-green-400' 
                : 'bg-green-100 text-green-600'
            }`}>
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Tasa de Éxito</p>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{tasaExito}%</p>
            </div>
          </div>
        </div>
        <div className={`w-full rounded-full h-2 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${tasaExito}%` }}
          ></div>
        </div>
        <p className={`text-xs mt-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>Releases a tiempo</p>
      </div>

      {/* Tendencia */}
      <div className={`rounded-lg shadow-sm p-6 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-purple-900/30 text-purple-400' 
                : 'bg-purple-100 text-purple-600'
            }`}>
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Tendencia</p>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{tendencia}%</p>
            </div>
          </div>
          {tendencia >= 70 ? (
            <TrendingUp className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div className={`w-full rounded-full h-2 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              tendencia >= 70 ? 'bg-green-600' : tendencia >= 50 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${tendencia}%` }}
          ></div>
        </div>
        <p className={`text-xs mt-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>Últimos 3 meses</p>
      </div>
    </div>
  );
};

export default AdvancedMetrics;
