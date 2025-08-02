import React from 'react';

const MetricsTestData = () => {
  const generateTestData = () => {
    // Datos de ejemplo para testing
    const sampleReleases = [
      {
        _id: '1',
        nombre: 'Release 1.0',
        version: '1.0.0',
        descripcion: 'Primera versión estable',
        fecha_objetivo: '2025-08-15T00:00:00.000Z',
        fecha_lanzamiento: '2025-08-10T00:00:00.000Z', // Exitoso: a tiempo
        estado: 'lanzado',
        progreso: 100,
        created_at: '2025-07-01T00:00:00.000Z'
      },
      {
        _id: '2',
        nombre: 'Release 1.1',
        version: '1.1.0',
        descripcion: 'Mejoras y correcciones',
        fecha_objetivo: '2025-09-01T00:00:00.000Z',
        fecha_lanzamiento: '2025-09-05T00:00:00.000Z', // Tardío
        estado: 'lanzado',
        progreso: 100,
        created_at: '2025-08-01T00:00:00.000Z'
      },
      {
        _id: '3',
        nombre: 'Release 2.0',
        version: '2.0.0',
        descripcion: 'Nueva funcionalidad mayor',
        fecha_objetivo: '2025-10-01T00:00:00.000Z',
        estado: 'en_desarrollo',
        progreso: 45,
        created_at: '2025-08-15T00:00:00.000Z'
      }
    ];

    const sampleSprints = [
      {
        _id: '1',
        nombre: 'Sprint 1',
        objetivo: 'Setup inicial del proyecto',
        fecha_inicio: '2025-07-01T00:00:00.000Z',
        fecha_fin: '2025-07-14T00:00:00.000Z',
        estado: 'completado',
        velocidad_planificada: 20,
        velocidad_real: 18
      },
      {
        _id: '2',
        nombre: 'Sprint 2',
        objetivo: 'Funcionalidades básicas',
        fecha_inicio: '2025-07-15T00:00:00.000Z',
        fecha_fin: '2025-07-28T00:00:00.000Z',
        estado: 'completado',
        velocidad_planificada: 25,
        velocidad_real: 23
      },
      {
        _id: '3',
        nombre: 'Sprint 3',
        objetivo: 'Mejoras UX',
        fecha_inicio: '2025-07-29T00:00:00.000Z',
        fecha_fin: '2025-08-11T00:00:00.000Z',
        estado: 'completado',
        velocidad_planificada: 22,
        velocidad_real: 20
      },
      {
        _id: '4',
        nombre: 'Sprint 4',
        objetivo: 'Testing y refinamiento',
        fecha_inicio: '2025-08-12T00:00:00.000Z',
        fecha_fin: '2025-08-25T00:00:00.000Z',
        estado: 'activo',
        velocidad_planificada: 24,
        velocidad_real: 0
      }
    ];

    console.log('=== DATOS DE EJEMPLO GENERADOS ===');
    console.log('Sample Releases:', sampleReleases);
    console.log('Sample Sprints:', sampleSprints);

    return { sampleReleases, sampleSprints };
  };

  const testMetrics = () => {
    const { sampleReleases, sampleSprints } = generateTestData();
    
    // Test de velocidad promedio
    const sprintsCompletados = sampleSprints.filter(s => s.estado === 'completado');
    const velocidadPromedio = sprintsCompletados.length > 0 
      ? Math.round(sprintsCompletados.reduce((sum, s) => sum + s.velocidad_planificada, 0) / sprintsCompletados.length)
      : 0;

    // Test de tiempo promedio release
    const releasesLanzados = sampleReleases.filter(r => r.estado === 'lanzado' && r.fecha_lanzamiento);
    const tiempoPromedio = releasesLanzados.length > 0
      ? Math.round(releasesLanzados.reduce((sum, r) => {
          const inicio = new Date(r.created_at);
          const fin = new Date(r.fecha_lanzamiento);
          return sum + Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
        }, 0) / releasesLanzados.length)
      : 0;

    // Test de tasa de éxito
    const releasesExitosos = releasesLanzados.filter(r => {
      const fechaObjetivo = new Date(r.fecha_objetivo);
      const fechaLanzamiento = new Date(r.fecha_lanzamiento);
      return fechaLanzamiento <= fechaObjetivo;
    });
    const tasaExito = releasesLanzados.length > 0 
      ? Math.round((releasesExitosos.length / releasesLanzados.length) * 100)
      : 0;

    console.log('=== RESULTADOS ESPERADOS ===');
    console.log('Velocidad Promedio:', velocidadPromedio, 'story points');
    console.log('Tiempo Promedio Release:', tiempoPromedio, 'días');
    console.log('Tasa de Éxito:', tasaExito + '%');
    console.log('Sprints Completados:', sprintsCompletados.length);
    console.log('Releases Lanzados:', releasesLanzados.length);
    console.log('Releases Exitosos:', releasesExitosos.length);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">🧪 Testing de Métricas</h3>
      <p className="text-sm text-gray-600 mb-4">
        Usa este botón para generar datos de ejemplo y probar las métricas
      </p>
      <button
        onClick={testMetrics}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generar y Probar Datos de Ejemplo
      </button>
    </div>
  );
};

export default MetricsTestData;
