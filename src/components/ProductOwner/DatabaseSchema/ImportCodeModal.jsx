/**
 * ImportCodeModal Component
 * Modal para importar código de modelos al esquema de base de datos
 * Soporta importación individual y bulk (múltiples archivos)
 * 
 * @module components/ProductOwner/DatabaseSchema/ImportCodeModal
 */

import React, { useState, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  X, 
  Code, 
  Upload, 
  Eye, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  FileCode,
  Copy,
  ChevronDown,
  Plus,
  Trash2,
  FolderOpen,
  Files
} from 'lucide-react';

const ImportCodeModal = ({ 
  isOpen, 
  onClose, 
  onImport,
  importing = false,
  productId
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef(null);
  
  // Modo de importación: 'single' o 'bulk'
  const [importMode, setImportMode] = useState('single');
  
  // Estado del formulario - modo individual
  const [code, setCode] = useState('');
  const [ormType, setOrmType] = useState('mongoose');
  const [overwrite, setOverwrite] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estado del formulario - modo bulk
  const [codeFiles, setCodeFiles] = useState([
    { id: 1, name: 'Modelo 1', code: '', status: 'pending' }
  ]);
  const [activeFileId, setActiveFileId] = useState(1);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, results: [] });

  // Tipos de ORM disponibles
  const ormTypes = [
    { value: 'mongoose', label: 'Mongoose (MongoDB)' },
    { value: 'prisma', label: 'Prisma' },
    { value: 'sequelize', label: 'Sequelize' },
    { value: 'typeorm', label: 'TypeORM' }
  ];

  // Limpiar estado
  const resetState = () => {
    setCode('');
    setOrmType('mongoose');
    setOverwrite(true);
    setShowPreview(false);
    setPreview(null);
    setError(null);
    setSuccess(null);
    setImportMode('single');
    setCodeFiles([{ id: 1, name: 'Modelo 1', code: '', status: 'pending' }]);
    setActiveFileId(1);
    setBulkProgress({ current: 0, total: 0, results: [] });
  };

  // Cerrar modal
  const handleClose = () => {
    if (!importing) {
      resetState();
      onClose();
    }
  };

  // Importar código
  const handleImport = async () => {
    if (!code.trim()) {
      setError('Por favor, ingresa el código del modelo');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const result = await onImport(code, { 
        orm_type: ormType, 
        overwrite 
      });

      if (result?.success) {
        setSuccess(result.message || 'Entidad importada exitosamente');
        setTimeout(() => {
          resetState();
          onClose();
        }, 1500);
      } else {
        setError(result?.error || 'Error al importar el código');
      }
    } catch (err) {
      setError(err.message || 'Error al importar el código');
    }
  };

  // Pegar desde portapapeles
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (importMode === 'single') {
        setCode(text);
      } else {
        updateActiveFileCode(text);
      }
    } catch (err) {
      setError('No se pudo acceder al portapapeles');
    }
  };

  // ============================================
  // FUNCIONES MODO BULK
  // ============================================

  // Agregar nuevo archivo al bulk
  const addCodeFile = () => {
    const newId = Math.max(...codeFiles.map(f => f.id)) + 1;
    setCodeFiles([...codeFiles, { 
      id: newId, 
      name: `Modelo ${newId}`, 
      code: '', 
      status: 'pending' 
    }]);
    setActiveFileId(newId);
  };

  // Eliminar archivo del bulk
  const removeCodeFile = (fileId) => {
    if (codeFiles.length <= 1) return;
    const newFiles = codeFiles.filter(f => f.id !== fileId);
    setCodeFiles(newFiles);
    if (activeFileId === fileId) {
      setActiveFileId(newFiles[0].id);
    }
  };

  // Actualizar código del archivo activo
  const updateActiveFileCode = (newCode) => {
    setCodeFiles(files => files.map(f => 
      f.id === activeFileId ? { ...f, code: newCode } : f
    ));
    setError(null);
  };

  // Actualizar nombre del archivo
  const updateFileName = (fileId, newName) => {
    setCodeFiles(files => files.map(f => 
      f.id === fileId ? { ...f, name: newName } : f
    ));
  };

  // Manejar archivos desde input file
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newCodeFiles = [];
    const baseId = Math.max(...codeFiles.map(f => f.id), 0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const content = await file.text();
        newCodeFiles.push({
          id: baseId + i + 1,
          name: file.name.replace(/\.(js|ts|mjs)$/, ''),
          code: content,
          status: 'pending'
        });
      } catch (err) {
        console.error(`Error leyendo ${file.name}:`, err);
      }
    }

    if (newCodeFiles.length > 0) {
      // Reemplazar el primer archivo vacío o agregar nuevos
      const existingEmpty = codeFiles.filter(f => !f.code.trim());
      if (existingEmpty.length === codeFiles.length) {
        setCodeFiles(newCodeFiles);
      } else {
        setCodeFiles([...codeFiles.filter(f => f.code.trim()), ...newCodeFiles]);
      }
      setActiveFileId(newCodeFiles[0].id);
      setImportMode('bulk');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Importar todos los archivos (bulk)
  const handleBulkImport = async () => {
    const filesToImport = codeFiles.filter(f => f.code.trim());
    if (!filesToImport.length) {
      setError('No hay código para importar');
      return;
    }

    setError(null);
    setBulkProgress({ current: 0, total: filesToImport.length, results: [] });

    const results = [];
    
    for (let i = 0; i < filesToImport.length; i++) {
      const file = filesToImport[i];
      setBulkProgress(prev => ({ ...prev, current: i + 1 }));
      
      // Actualizar estado visual
      setCodeFiles(files => files.map(f => 
        f.id === file.id ? { ...f, status: 'importing' } : f
      ));

      try {
        const result = await onImport(file.code, { 
          orm_type: ormType, 
          overwrite 
        });

        const status = result?.success ? 'success' : 'error';
        results.push({ 
          id: file.id, 
          name: file.name, 
          status,
          message: result?.message || result?.error 
        });

        setCodeFiles(files => files.map(f => 
          f.id === file.id ? { ...f, status } : f
        ));
      } catch (err) {
        results.push({ 
          id: file.id, 
          name: file.name, 
          status: 'error',
          message: err.message 
        });
        
        setCodeFiles(files => files.map(f => 
          f.id === file.id ? { ...f, status: 'error' } : f
        ));
      }
    }

    setBulkProgress(prev => ({ ...prev, results }));
    
    const successCount = results.filter(r => r.status === 'success').length;
    if (successCount === results.length) {
      setSuccess(`${successCount} entidades importadas exitosamente`);
      setTimeout(() => {
        resetState();
        onClose();
      }, 2000);
    } else if (successCount > 0) {
      setSuccess(`${successCount}/${results.length} entidades importadas`);
    } else {
      setError('No se pudo importar ninguna entidad');
    }
  };

  // Archivo activo actual
  const activeFile = codeFiles.find(f => f.id === activeFileId) || codeFiles[0];

  // Ejemplo de código
  const exampleCode = `const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'user', 'guest'],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);`;

  const loadExample = () => {
    setCode(exampleCode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-100'
            }`}>
              <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Importar {importMode === 'bulk' ? 'Múltiples Entidades' : 'Entidad'} desde Código
              </h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {importMode === 'bulk' 
                  ? `${codeFiles.length} archivo(s) - ${codeFiles.filter(f => f.code.trim()).length} con código`
                  : 'Pega el código de tu modelo para importarlo'}
              </p>
            </div>
          </div>
          
          {/* Modo Toggle */}
          <div className="flex items-center gap-3">
            <div className={`flex rounded-lg p-1 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => setImportMode('single')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  importMode === 'single'
                    ? 'bg-indigo-600 text-white'
                    : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code size={16} />
                Individual
              </button>
              <button
                onClick={() => setImportMode('bulk')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  importMode === 'bulk'
                    ? 'bg-indigo-600 text-white'
                    : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Files size={16} />
                Múltiple
              </button>
            </div>
            
            <button
              onClick={handleClose}
              disabled={importing}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Opciones compartidas */}
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Selector de ORM */}
            <div className="flex-1 min-w-[200px]">
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tipo de ORM/ODM
              </label>
              <div className="relative">
                <select
                  value={ormType}
                  onChange={(e) => setOrmType(e.target.value)}
                  className={`w-full appearance-none pl-3 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {ormTypes.map(orm => (
                    <option key={orm.value} value={orm.value}>
                      {orm.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </div>

            {/* Checkbox sobrescribir */}
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overwrite}
                  onChange={(e) => setOverwrite(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Sobrescribir si existe
                </span>
              </label>
            </div>

            {/* Botón subir archivos (solo en bulk) */}
            {importMode === 'bulk' && (
              <div className="flex items-end pb-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".js,.ts,.mjs,.cjs"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FolderOpen size={18} />
                  Subir Archivos
                </button>
              </div>
            )}
          </div>

          {/* =================================
              MODO INDIVIDUAL
          ================================= */}
          {importMode === 'single' && (
            <>
              {/* Área de código */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Código del Modelo
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePaste}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Copy size={14} />
                      Pegar
                    </button>
                    <button
                      onClick={loadExample}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FileCode size={14} />
                      Ejemplo
                    </button>
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(null);
                  }}
                  placeholder={`// Pega aquí el código de tu modelo ${ormType}...\n\nconst mongoose = require('mongoose');\n\nconst YourSchema = new mongoose.Schema({\n  // ...\n});`}
                  className={`w-full h-64 p-4 font-mono text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-600'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  spellCheck={false}
                />
              </div>
            </>
          )}

          {/* =================================
              MODO BULK
          ================================= */}
          {importMode === 'bulk' && (
            <div className="flex gap-4 mb-4">
              {/* Sidebar de archivos */}
              <div className={`w-48 flex-shrink-0 rounded-lg border overflow-hidden ${
                theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`p-2 border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <button
                    onClick={addCodeFile}
                    className={`w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Plus size={14} />
                    Agregar
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {codeFiles.map(file => (
                    <div
                      key={file.id}
                      onClick={() => setActiveFileId(file.id)}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                        activeFileId === file.id
                          ? theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-50'
                          : theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      {/* Indicador de estado */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        file.status === 'success' ? 'bg-green-500' :
                        file.status === 'error' ? 'bg-red-500' :
                        file.status === 'importing' ? 'bg-yellow-500 animate-pulse' :
                        file.code.trim() ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                      
                      {/* Nombre editable */}
                      <input
                        type="text"
                        value={file.name}
                        onChange={(e) => updateFileName(file.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 bg-transparent text-sm truncate focus:outline-none ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      />
                      
                      {/* Botón eliminar */}
                      {codeFiles.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCodeFile(file.id);
                          }}
                          className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                            theme === 'dark' ? 'hover:bg-gray-700 text-gray-500' : 'hover:bg-gray-200 text-gray-400'
                          }`}
                          style={{ opacity: activeFileId === file.id ? 1 : undefined }}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor de código */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {activeFile?.name || 'Código del Modelo'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePaste}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Copy size={14} />
                      Pegar
                    </button>
                  </div>
                </div>
                <textarea
                  value={activeFile?.code || ''}
                  onChange={(e) => updateActiveFileCode(e.target.value)}
                  placeholder={`// Pega aquí el código de tu modelo ${ormType}...\n\nconst mongoose = require('mongoose');\n\nconst YourSchema = new mongoose.Schema({\n  // ...\n});`}
                  className={`w-full h-56 p-4 font-mono text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-600'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* Progreso de bulk import */}
          {importMode === 'bulk' && bulkProgress.total > 0 && (
            <div className={`mb-4 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Progreso: {bulkProgress.current} / {bulkProgress.total}
                </span>
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {Math.round((bulkProgress.current / bulkProgress.total) * 100)}%
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Mensajes de error/éxito */}
          {error && (
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
              theme === 'dark'
                ? 'bg-red-900/30 text-red-400 border border-red-800'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
              theme === 'dark'
                ? 'bg-green-900/30 text-green-400 border border-green-800'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <CheckCircle size={18} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Preview (si está habilitado) */}
          {showPreview && preview && (
            <div className={`p-4 rounded-lg mb-4 ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            }`}>
              <h4 className={`font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Preview: {preview.entity?.entity}
              </h4>
              <pre className={`text-xs overflow-auto ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {JSON.stringify(preview.entity, null, 2)}
              </pre>
            </div>
          )}

          {/* Info */}
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              <strong>Tip:</strong> El sistema detectará automáticamente el nombre de la entidad, 
              campos, tipos, validaciones y relaciones a partir del código.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-4 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={handleClose}
            disabled={importing}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cancelar
          </button>
          
          {importMode === 'single' ? (
            <button
              onClick={handleImport}
              disabled={importing || !code.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                importing || !code.trim()
                  ? 'bg-indigo-400 cursor-not-allowed text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {importing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Importar Entidad
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleBulkImport}
              disabled={importing || !codeFiles.some(f => f.code.trim())}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                importing || !codeFiles.some(f => f.code.trim())
                  ? 'bg-indigo-400 cursor-not-allowed text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {importing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Importando {bulkProgress.current}/{bulkProgress.total}...
                </>
              ) : (
                <>
                  <Files size={18} />
                  Importar {codeFiles.filter(f => f.code.trim()).length} Entidad(es)
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportCodeModal;
