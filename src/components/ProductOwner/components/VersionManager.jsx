import React, { useState } from 'react';
import { Tag, Plus, GitCommit, Calendar, CheckCircle, Hash } from 'lucide-react';

const VersionManager = ({ release, onVersionChange, onClose }) => {
  const [nuevaVersion, setNuevaVersion] = useState('');
  const [tipoVersion, setTipoVersion] = useState('minor'); // major, minor, patch
  const [notasVersion, setNotasVersion] = useState('');

  // Función para sugerir próxima versión
  const sugerirProximaVersion = () => {
  const versionActual = release && release.version ? String(release.version) : '1.0.0';
  const partes = (versionActual && versionActual.split) ? versionActual.split('.').map(num => Number(num) || 0) : [1,0,0];
    
    switch (tipoVersion) {
      case 'major':
        return `${partes[0] + 1}.0.0`;
      case 'minor':
        return `${partes[0]}.${partes[1] + 1}.0`;
      case 'patch':
        return `${partes[0]}.${partes[1]}.${(partes[2] || 0) + 1}`;
      default:
        return versionActual;
    }
  };

  const handleSugerirVersion = () => {
    setNuevaVersion(sugerirProximaVersion());
  };

  const handleCrearVersion = () => {
    const versionFinal = nuevaVersion || sugerirProximaVersion();
    
    const datosVersion = {
      version: versionFinal,
      tipo: tipoVersion,
      notas: notasVersion,
      fecha_creacion: new Date().toISOString(),
      release_padre: release._id
    };

    onVersionChange(datosVersion);
  };

  const tiposVersion = [
    { 
      value: 'major', 
      label: 'Major', 
      description: 'Cambios incompatibles (ej: 1.0.0 → 2.0.0)',
      color: 'text-red-600' 
    },
    { 
      value: 'minor', 
      label: 'Minor', 
      description: 'Nuevas funcionalidades (ej: 1.0.0 → 1.1.0)',
      color: 'text-yellow-600' 
    },
    { 
      value: 'patch', 
      label: 'Patch', 
      description: 'Correcciones de errores (ej: 1.0.0 → 1.0.1)',
      color: 'text-green-600' 
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-6">
          {Tag ? <Tag className="h-6 w-6 text-purple-600" /> : <Hash className="h-6 w-6 text-purple-600" />}
          <h2 className="text-xl font-semibold text-gray-900">
            Gestionar Versión: {release.nombre}
          </h2>
        </div>

        {/* Información del Release Actual */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <GitCommit className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Versión Actual</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{release.version}</p>
          <p className="text-sm text-gray-600">Estado: {release.estado}</p>
        </div>

        {/* Selección de Tipo de Versión */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Versión
          </label>
          <div className="space-y-3">
            {tiposVersion.map(tipo => (
              <label key={tipo.value} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="tipoVersion"
                  value={tipo.value}
                  checked={tipoVersion === tipo.value}
                  onChange={(e) => setTipoVersion(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${tipo.color}`}>{tipo.label}</span>
                    <span className="text-sm text-gray-600">
                      → {tipo.value === tipoVersion ? sugerirProximaVersion() : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{tipo.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Versión Personalizada */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Versión Personalizada (opcional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nuevaVersion}
              onChange={(e) => setNuevaVersion(e.target.value)}
              placeholder={sugerirProximaVersion()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleSugerirVersion}
              className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200"
            >
              Sugerir
            </button>
          </div>
        </div>

        {/* Notas de Versión */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas de Versión
          </label>
          <textarea
            value={notasVersion}
            onChange={(e) => setNotasVersion(e.target.value)}
            rows={3}
            placeholder="Descripción de los cambios en esta versión..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleCrearVersion}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Crear Versión
          </button>
        </div>
      </div>
    </div>
  );
};

export default VersionManager;
