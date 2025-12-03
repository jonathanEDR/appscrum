import React, { useState, useCallback, useMemo } from 'react';
import { 
  FolderTree, 
  Folder, 
  FolderOpen,
  FileCode,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Info,
  FolderPlus,
  FilePlus,
  Check,
  AlertCircle
} from 'lucide-react';

/**
 * DirectoryStructureTab - Visualiza y edita la estructura de directorios del proyecto
 * 
 * @param {Object} props
 * @param {Object} props.architecture - Arquitectura del proyecto
 * @param {Function} props.onSave - Callback para guardar cambios
 * @param {boolean} props.loading - Estado de carga
 */
const DirectoryStructureTab = ({ architecture, onSave, loading = false }) => {
  const [expandedFolders, setExpandedFolders] = useState({
    frontend: true,
    backend: true,
    shared: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [saveMessage, setSaveMessage] = useState(null);
  
  // Estado para agregar nuevo item
  const [addingTo, setAddingTo] = useState(null);
  const [addingType, setAddingType] = useState(null);
  
  // Estado para confirmar eliminación
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Estructura editable local
  const [localStructure, setLocalStructure] = useState(null);

  const directoryStructure = useMemo(() => {
    return localStructure || architecture?.directory_structure || {
      frontend: {},
      backend: {},
      shared: {}
    };
  }, [localStructure, architecture?.directory_structure]);

  // Iniciar modo edición
  const startEditing = useCallback(() => {
    setLocalStructure(JSON.parse(JSON.stringify(
      architecture?.directory_structure || { frontend: {}, backend: {}, shared: {} }
    )));
    setIsEditing(true);
  }, [architecture?.directory_structure]);

  // Cancelar edición
  const cancelEditing = useCallback(() => {
    setLocalStructure(null);
    setIsEditing(false);
    setEditingItem(null);
    setAddingTo(null);
    setAddingType(null);
    setNewItemName('');
    setNewItemDescription('');
  }, []);

  // Guardar cambios
  const handleSave = useCallback(async () => {
    try {
      await onSave({ directory_structure: localStructure });
      setSaveMessage({ type: 'success', text: '✅ Estructura guardada correctamente' });
      setIsEditing(false);
      setLocalStructure(null);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: '❌ Error al guardar la estructura' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  }, [localStructure, onSave]);

  // Toggle folder expansion
  const toggleFolder = useCallback((path) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  }, []);

  // Determinar si un valor es una carpeta (objeto) o archivo (string)
  const isFolder = useCallback((value) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }, []);

  // Obtener objeto por path
  const getByPath = useCallback((obj, path) => {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  }, []);

  // Establecer valor por path
  const setByPath = useCallback((obj, path, value) => {
    const parts = path.split('.');
    const newObj = JSON.parse(JSON.stringify(obj));
    let current = newObj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    
    current[parts[parts.length - 1]] = value;
    return newObj;
  }, []);

  // Eliminar por path
  const deleteByPath = useCallback((obj, path) => {
    const parts = path.split('.');
    const newObj = JSON.parse(JSON.stringify(obj));
    let current = newObj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    
    delete current[parts[parts.length - 1]];
    return newObj;
  }, []);

  // Renombrar por path
  const renameByPath = useCallback((obj, path, newName) => {
    const parts = path.split('.');
    const oldName = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join('.');
    
    const newObj = JSON.parse(JSON.stringify(obj));
    let parent = parentPath ? getByPath(newObj, parentPath) : newObj;
    
    if (parent && oldName in parent) {
      const value = parent[oldName];
      delete parent[oldName];
      parent[newName] = value;
    }
    
    return newObj;
  }, [getByPath]);

  // Agregar carpeta
  const handleAddFolder = useCallback(() => {
    if (!newItemName.trim()) return;
    
    const folderName = newItemName.trim().toLowerCase().replace(/\s+/g, '-');
    const newPath = addingTo ? `${addingTo}.${folderName}` : folderName;
    
    setLocalStructure(prev => setByPath(prev, newPath, {}));
    setAddingTo(null);
    setAddingType(null);
    setNewItemName('');
    
    if (addingTo) {
      setExpandedFolders(prev => ({ ...prev, [addingTo]: true }));
    }
  }, [newItemName, addingTo, setByPath]);

  // Agregar archivo
  const handleAddFile = useCallback(() => {
    if (!newItemName.trim()) return;
    
    const fileName = newItemName.trim();
    const description = newItemDescription.trim() || 'Sin descripción';
    const newPath = addingTo ? `${addingTo}.${fileName}` : fileName;
    
    setLocalStructure(prev => setByPath(prev, newPath, description));
    setAddingTo(null);
    setAddingType(null);
    setNewItemName('');
    setNewItemDescription('');
    
    if (addingTo) {
      setExpandedFolders(prev => ({ ...prev, [addingTo]: true }));
    }
  }, [newItemName, newItemDescription, addingTo, setByPath]);

  // Eliminar item
  const handleDelete = useCallback((path) => {
    setLocalStructure(prev => deleteByPath(prev, path));
    setConfirmDelete(null);
  }, [deleteByPath]);

  // Iniciar edición de nombre
  const startEditingItem = useCallback((path, isFolderType, originalName) => {
    setEditingItem({ path, isFolder: isFolderType, originalName });
    setNewItemName(originalName);
  }, []);

  // Guardar nombre editado
  const handleRename = useCallback(() => {
    if (!newItemName.trim() || !editingItem) return;
    
    const newName = newItemName.trim();
    if (newName !== editingItem.originalName) {
      setLocalStructure(prev => renameByPath(prev, editingItem.path, newName));
    }
    
    setEditingItem(null);
    setNewItemName('');
  }, [newItemName, editingItem, renameByPath]);

  // Renderizar estructura recursivamente
  const renderStructure = useCallback((structure, parentPath = '', level = 0) => {
    if (!structure || typeof structure !== 'object') return null;

    const entries = Object.entries(structure).sort(([, a], [, b]) => {
      const aIsFolder = isFolder(a);
      const bIsFolder = isFolder(b);
      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;
      return 0;
    });

    return entries.map(([key, value]) => {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;
      const isExpanded = expandedFolders[currentPath] !== false;
      const isFolderType = isFolder(value);
      const indent = level * 20;
      const isBeingEdited = editingItem?.path === currentPath;

      return (
        <div key={currentPath}>
          <div 
            className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 group transition-colors ${
              isBeingEdited ? 'bg-blue-50 ring-2 ring-blue-300' : ''
            }`}
            style={{ marginLeft: `${indent}px` }}
          >
            {isFolderType ? (
              <button 
                className="p-0.5 text-gray-400 hover:text-gray-600"
                onClick={() => toggleFolder(currentPath)}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <span className="w-5" />
            )}

            {isFolderType ? (
              isExpanded ? (
                <FolderOpen size={18} className="text-yellow-500 flex-shrink-0" />
              ) : (
                <Folder size={18} className="text-yellow-500 flex-shrink-0" />
              )
            ) : (
              <FileCode size={18} className="text-blue-500 flex-shrink-0" />
            )}

            {isBeingEdited ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') {
                      setEditingItem(null);
                      setNewItemName('');
                    }
                  }}
                  className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button onClick={handleRename} className="p-1 text-green-600 hover:bg-green-100 rounded" title="Guardar">
                  <Check size={16} />
                </button>
                <button onClick={() => { setEditingItem(null); setNewItemName(''); }} className="p-1 text-gray-400 hover:bg-gray-100 rounded" title="Cancelar">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <span className={`font-medium ${isFolderType ? 'text-gray-800' : 'text-gray-600'}`}>
                  {key}{isFolderType ? '/' : ''}
                </span>
                {!isFolderType && typeof value === 'string' && (
                  <span className="text-sm text-gray-400 ml-2 truncate">// {value}</span>
                )}
              </>
            )}

            {isEditing && !isBeingEdited && (
              <div className="ml-auto opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                {isFolderType && (
                  <>
                    <button 
                      onClick={() => {
                        setAddingTo(currentPath);
                        setAddingType('folder');
                        setExpandedFolders(prev => ({ ...prev, [currentPath]: true }));
                      }}
                      className="p-1 text-green-500 hover:bg-green-50 rounded"
                      title="Agregar carpeta"
                    >
                      <FolderPlus size={14} />
                    </button>
                    <button 
                      onClick={() => {
                        setAddingTo(currentPath);
                        setAddingType('file');
                        setExpandedFolders(prev => ({ ...prev, [currentPath]: true }));
                      }}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                      title="Agregar archivo"
                    >
                      <FilePlus size={14} />
                    </button>
                  </>
                )}
                <button 
                  onClick={() => startEditingItem(currentPath, isFolderType, key)}
                  className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                  title="Renombrar"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => setConfirmDelete({ path: currentPath, name: key, isFolder: isFolderType })}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {isFolderType && isExpanded && (
            <div>
              {renderStructure(value, currentPath, level + 1)}
              
              {addingTo === currentPath && (
                <div 
                  className="flex items-center gap-2 py-2 px-3 bg-green-50 rounded-lg border border-green-200 my-1"
                  style={{ marginLeft: `${(level + 1) * 20}px` }}
                >
                  {addingType === 'folder' ? (
                    <FolderPlus size={18} className="text-green-500" />
                  ) : (
                    <FilePlus size={18} className="text-blue-500" />
                  )}
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={addingType === 'folder' ? 'nombre-carpeta' : 'archivo.ext'}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addingType === 'folder' ? handleAddFolder() : handleAddFile();
                      }
                      if (e.key === 'Escape') {
                        setAddingTo(null);
                        setAddingType(null);
                        setNewItemName('');
                        setNewItemDescription('');
                      }
                    }}
                  />
                  {addingType === 'file' && (
                    <input
                      type="text"
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                      placeholder="Descripción"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddFile();
                      }}
                    />
                  )}
                  <button onClick={addingType === 'folder' ? handleAddFolder : handleAddFile} className="p-1 text-green-600 hover:bg-green-100 rounded" title="Agregar">
                    <Check size={16} />
                  </button>
                  <button onClick={() => { setAddingTo(null); setAddingType(null); setNewItemName(''); setNewItemDescription(''); }} className="p-1 text-gray-400 hover:bg-gray-100 rounded" title="Cancelar">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  }, [expandedFolders, isEditing, editingItem, newItemName, newItemDescription, addingTo, addingType, 
      isFolder, toggleFolder, handleRename, handleAddFolder, handleAddFile, startEditingItem]);

  // Estadísticas
  const countItems = useCallback((structure) => {
    if (!structure || typeof structure !== 'object') return { folders: 0, files: 0 };
    
    let folders = 0;
    let files = 0;

    Object.values(structure).forEach(value => {
      if (isFolder(value)) {
        folders++;
        const nested = countItems(value);
        folders += nested.folders;
        files += nested.files;
      } else {
        files++;
      }
    });

    return { folders, files };
  }, [isFolder]);

  const frontendStats = useMemo(() => countItems(directoryStructure.frontend), [directoryStructure.frontend, countItems]);
  const backendStats = useMemo(() => countItems(directoryStructure.backend), [directoryStructure.backend, countItems]);
  const sharedStats = useMemo(() => countItems(directoryStructure.shared), [directoryStructure.shared, countItems]);

  const hasStructure = useMemo(() => {
    return Object.keys(directoryStructure.frontend || {}).length > 0 ||
           Object.keys(directoryStructure.backend || {}).length > 0 ||
           Object.keys(directoryStructure.shared || {}).length > 0;
  }, [directoryStructure]);

  // Renderizar sección de directorio (Frontend/Backend/Shared)
  const renderSection = (sectionKey, stats, colorConfig) => {
    const { bgColor, textColor, iconColor, hoverColor } = colorConfig;
    const sectionName = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
    
    return (
      <div className={sectionKey !== 'shared' ? 'border-b border-gray-100' : ''}>
        <div 
          className={`flex items-center gap-3 p-4 ${bgColor} cursor-pointer ${hoverColor} transition-colors`}
          onClick={() => toggleFolder(sectionKey)}
        >
          {expandedFolders[sectionKey] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <FolderOpen size={22} className={iconColor} />
          <span className={`font-bold ${textColor}`}>{sectionKey}/</span>
          <span className={`text-sm ${textColor.replace('800', '600')} ml-auto`}>
            {stats.folders} carpetas, {stats.files} archivos
          </span>
          {isEditing && (
            <div className="flex gap-1 ml-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setAddingTo(sectionKey);
                  setAddingType('folder');
                  setExpandedFolders(prev => ({ ...prev, [sectionKey]: true }));
                }}
                className="p-1 text-green-600 hover:bg-green-100 rounded"
                title="Agregar carpeta"
              >
                <FolderPlus size={16} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setAddingTo(sectionKey);
                  setAddingType('file');
                  setExpandedFolders(prev => ({ ...prev, [sectionKey]: true }));
                }}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                title="Agregar archivo"
              >
                <FilePlus size={16} />
              </button>
            </div>
          )}
        </div>
        {expandedFolders[sectionKey] && (
          <div className="p-2 bg-white">
            {renderStructure(directoryStructure[sectionKey], sectionKey, 1)}
            {addingTo === sectionKey && (
              <div className="flex items-center gap-2 py-2 px-3 bg-green-50 rounded-lg border border-green-200 my-1 ml-5">
                {addingType === 'folder' ? (
                  <FolderPlus size={18} className="text-green-500" />
                ) : (
                  <FilePlus size={18} className="text-blue-500" />
                )}
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={addingType === 'folder' ? 'nombre-carpeta' : 'archivo.ext'}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addingType === 'folder' ? handleAddFolder() : handleAddFile();
                    }
                    if (e.key === 'Escape') {
                      setAddingTo(null);
                      setAddingType(null);
                      setNewItemName('');
                    }
                  }}
                />
                {addingType === 'file' && (
                  <input
                    type="text"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    placeholder="Descripción"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                )}
                <button onClick={addingType === 'folder' ? handleAddFolder : handleAddFile} className="p-1 text-green-600 hover:bg-green-100 rounded">
                  <Check size={16} />
                </button>
                <button onClick={() => { setAddingTo(null); setAddingType(null); setNewItemName(''); }} className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FolderTree className="text-yellow-500" size={28} />
            Estructura del Proyecto
          </h2>
          <p className="text-gray-500 mt-1">
            Organización de carpetas y archivos del proyecto
          </p>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                Guardar Cambios
              </button>
              <button
                onClick={cancelEditing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X size={18} />
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={startEditing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={18} />
              Editar Estructura
            </button>
          )}
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {saveMessage.text}
        </div>
      )}

      {/* Stats Cards */}
      {hasStructure && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Frontend" folders={frontendStats.folders} files={frontendStats.files} color="blue" />
          <StatCard title="Backend" folders={backendStats.folders} files={backendStats.files} color="green" />
          <StatCard title="Shared" folders={sharedStats.folders} files={sharedStats.files} color="purple" />
        </div>
      )}

      {/* Directory Tree */}
      {hasStructure || isEditing ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {renderSection('frontend', frontendStats, {
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-500',
            hoverColor: 'hover:bg-blue-100'
          })}
          {renderSection('backend', backendStats, {
            bgColor: 'bg-green-50',
            textColor: 'text-green-800',
            iconColor: 'text-green-500',
            hoverColor: 'hover:bg-green-100'
          })}
          {renderSection('shared', sharedStats, {
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-800',
            iconColor: 'text-purple-500',
            hoverColor: 'hover:bg-purple-100'
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FolderTree size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Sin estructura definida
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            La estructura del proyecto aún no ha sido definida. 
            Puedes crearla manualmente o generarla automáticamente con el asistente Scrum AI.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={startEditing}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Crear Estructura Manual
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirmar eliminación</h3>
                <p className="text-gray-500 text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar {confirmDelete.isFolder ? 'la carpeta' : 'el archivo'}{' '}
              <strong>"{confirmDelete.name}"</strong>
              {confirmDelete.isFolder && ' y todo su contenido'}?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.path)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>Tip:</strong> La estructura del proyecto puede ser generada automáticamente 
          por Scrum AI al analizar tu producto. En modo edición puedes agregar carpetas 
          <FolderPlus size={14} className="inline mx-1" /> y archivos 
          <FilePlus size={14} className="inline mx-1" /> usando los botones que aparecen al pasar el cursor.
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, folders, files, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  const iconColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500'
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold">{title}</span>
        <Folder size={20} className={iconColors[color]} />
      </div>
      <div className="mt-2 flex gap-4 text-sm">
        <span><strong>{folders}</strong> carpetas</span>
        <span><strong>{files}</strong> items</span>
      </div>
    </div>
  );
};

export default DirectoryStructureTab;
