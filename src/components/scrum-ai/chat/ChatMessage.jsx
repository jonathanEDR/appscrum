/**
 * ChatMessage - Mensaje individual con diseño premium
 */

import ReactMarkdown from 'react-markdown';
import { Bot, User, Copy, Check, Sparkles, LayoutGrid, ExternalLink, CheckCircle, FolderTree, Database, Globe, Layers, Plus, Pencil, Trash2, Send, FileText, Tag, Box, Zap, Link2, ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';

// Componente para opciones de menú de sección (Estructura, API, Módulos) - 3 opciones
const SectionMenuOption = ({ number, title, description, onClick }) => {
  const icons = {
    '1': FolderTree,
    '2': Globe,
    '3': Layers
  };
  
  const colors = {
    '1': 'from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700',
    '2': 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    '3': 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
  };
  
  const Icon = icons[number] || Layers;
  const colorClass = colors[number] || colors['3'];
  
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        bg-gradient-to-r ${colorClass}
        text-white text-left text-sm
        transform transition-all duration-200
        hover:scale-[1.02] hover:shadow-md
        active:scale-[0.98]
      `}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium truncate">{title}</span>
    </button>
  );
};

// Componente para botones de confirmación (Sí/No)
const ConfirmationButtons = ({ onConfirm, onCancel, confirmText = '✅ Sí, guardar', cancelText = '❌ No, modificar' }) => {
  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={onConfirm}
        className="
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-gradient-to-r from-emerald-500 to-green-600
          hover:from-emerald-600 hover:to-green-700
          text-white text-sm font-medium
          shadow-md hover:shadow-lg
          transform hover:scale-105 active:scale-95
          transition-all duration-200
        "
      >
        <CheckCircle className="w-4 h-4" />
        <span>{confirmText}</span>
      </button>
      <button
        onClick={onCancel}
        className="
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-gray-100 dark:bg-gray-800
          hover:bg-gray-200 dark:hover:bg-gray-700
          text-gray-700 dark:text-gray-300 text-sm font-medium
          shadow-sm hover:shadow-md
          transform hover:scale-105 active:scale-95
          transition-all duration-200
        "
      >
        <Pencil className="w-4 h-4" />
        <span>{cancelText}</span>
      </button>
    </div>
  );
};

// Componente para opciones de acción (Agregar, Modificar, Eliminar)
const ActionMenuOption = ({ type, context, onClick }) => {
  const config = {
    'agregar': { 
      icon: Plus, 
      label: 'Agregar',
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      message: (ctx) => `Agregar: ${ctx}`
    },
    'modificar': { 
      icon: Pencil, 
      label: 'Modificar',
      color: 'bg-amber-500 hover:bg-amber-600 text-white',
      message: (ctx) => `Modificar: ${ctx}`
    },
    'eliminar': { 
      icon: Trash2, 
      label: 'Eliminar',
      color: 'bg-red-500 hover:bg-red-600 text-white',
      message: (ctx) => `Eliminar: ${ctx}`
    }
  };
  
  const { icon: Icon, label, color, message } = config[type] || config['agregar'];
  
  return (
    <button
      onClick={() => onClick(message(context))}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg
        ${color}
        text-sm font-medium
        transform transition-all duration-200
        hover:scale-[1.02] hover:shadow-md
        active:scale-[0.98]
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};

// Componente para formulario de campos interactivo
const InputFieldsForm = ({ fields, onSubmit, context }) => {
  const [values, setValues] = useState({});
  const [isExpanded, setIsExpanded] = useState(true);

  // Íconos por tipo de campo
  const fieldIcons = {
    'nombre': FileText,
    'descripción': FileText,
    'tipo': Tag,
    'aplicación': Layers,
    'escala': Zap,
    'requisitos': Box,
    'frontend': Layers,
    'backend': Box,
    'base': Database,
    'database': Database,
    'devops': Zap,
    'complejidad': Zap,
    'funcionalidades': Box,
    'dependencias': Link2,
    'default': FileText
  };

  // Opciones predefinidas para cada tipo de campo
  const predefinedOptions = {
    'frontend': ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'HTML/CSS/JS'],
    'backend': ['Node.js', 'Python', 'Java', 'C#/.NET', 'Go', 'PHP'],
    'database': ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Redis', 'Firebase'],
    'devops': ['Docker', 'AWS', 'Vercel', 'Render', 'Azure', 'GitHub Actions', 'Kubernetes', 'Netlify'],
    'tipo': ['Web', 'Móvil', 'Desktop', 'API', 'Microservicios', 'Fullstack'],
    'escala': ['Pequeña', 'Mediana', 'Grande', 'Enterprise'],
    'complejidad': ['Baja', 'Media', 'Alta', 'Muy Alta']
  };

  // Campos que permiten selección múltiple
  const multiSelectFields = ['devops'];

  // Colores por tipo de campo
  const fieldColors = {
    'frontend': { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', light: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-400' },
    'backend': { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', light: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-400' },
    'database': { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', light: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-400' },
    'devops': { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', light: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-400' },
    'tipo': { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', light: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-400' },
    'escala': { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', light: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-400' },
    'default': { bg: 'bg-gray-500', hover: 'hover:bg-gray-600', light: 'bg-gray-100 dark:bg-gray-900/30', border: 'border-gray-400' }
  };

  const getIcon = (fieldName) => {
    const lowerName = fieldName.toLowerCase();
    for (const [key, Icon] of Object.entries(fieldIcons)) {
      if (key !== 'default' && lowerName.includes(key)) return Icon;
    }
    return fieldIcons.default;
  };

  const getOptions = (field) => {
    // Si el field ya tiene opciones, usarlas
    if (field.options && field.options.length > 0) return field.options;
    // Buscar opciones predefinidas
    const lowerId = field.id.toLowerCase();
    for (const [key, options] of Object.entries(predefinedOptions)) {
      if (lowerId.includes(key)) return options;
    }
    return null;
  };

  const getColors = (fieldId) => {
    const lowerId = fieldId.toLowerCase();
    for (const [key, colors] of Object.entries(fieldColors)) {
      if (key !== 'default' && lowerId.includes(key)) return colors;
    }
    return fieldColors.default;
  };

  // Verificar si un campo es de selección múltiple
  const isMultiSelect = (fieldId) => {
    const lowerId = fieldId.toLowerCase();
    return multiSelectFields.some(key => lowerId.includes(key));
  };

  // Obtener valor como array para campos múltiples
  const getValueArray = (fieldId) => {
    const val = values[fieldId];
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.split(', ').filter(Boolean);
  };

  const handleChange = (fieldId, value) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
  };

  // Manejar toggle para campos de selección múltiple
  const handleMultiToggle = (fieldId, option) => {
    const current = getValueArray(fieldId);
    const isSelected = current.includes(option);
    let newValue;
    if (isSelected) {
      newValue = current.filter(v => v !== option);
    } else {
      newValue = [...current, option];
    }
    setValues(prev => ({ ...prev, [fieldId]: newValue.join(', ') }));
  };

  const handleSubmit = () => {
    // Construir mensaje con los valores
    const filledFields = fields
      .map(f => {
        const value = values[f.id]?.trim();
        if (value) return `${f.label}: ${value}`;
        return null;
      })
      .filter(Boolean);
    
    if (filledFields.length > 0) {
      const message = filledFields.join('\n');
      onSubmit(message);
    }
  };

  const hasValues = Object.values(values).some(v => v?.trim());

  return (
    <div className="mt-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">
            {context || '✨ Configura tu arquitectura'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Form fields */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {fields.map((field) => {
            const Icon = getIcon(field.label);
            const options = getOptions(field);
            const colors = getColors(field.id);
            const currentValue = values[field.id];
            
            return (
              <div key={field.id} className="space-y-2">
                {/* Field header */}
                <div className="flex items-center gap-2">
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg ${colors.light} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${colors.bg.replace('bg-', 'text-')}`} />
                  </div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  {currentValue && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      ✓ {currentValue}
                    </span>
                  )}
                </div>
                
                {/* Options grid */}
                {options ? (
                  <div>
                    {/* Multi-select indicator */}
                    {isMultiSelect(field.id) && (
                      <div className="flex items-center gap-1 mb-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                          Selección múltiple
                        </span>
                        <span>- Puedes elegir varias opciones</span>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      {options.map((opt, i) => {
                        const isMulti = isMultiSelect(field.id);
                        const isSelected = isMulti 
                          ? getValueArray(field.id).includes(opt)
                          : currentValue === opt;
                        return (
                          <button
                            key={i}
                            onClick={() => isMulti 
                              ? handleMultiToggle(field.id, opt)
                              : handleChange(field.id, isSelected ? '' : opt)
                            }
                            className={`
                              relative px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200
                              ${isSelected
                                ? `${colors.bg} text-white shadow-md scale-[1.02]`
                                : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:${colors.border} hover:shadow-sm`
                              }
                            `}
                          >
                            {isSelected && (
                              <CheckCircle className="absolute top-1 right-1 w-3 h-3" />
                            )}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={currentValue || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={field.placeholder || `Ingresa ${field.label.toLowerCase()}`}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                )}
              </div>
            );
          })}

          {/* Progress indicator */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Progreso</span>
              <span>{Object.values(values).filter(v => v?.trim()).length} de {fields.length}</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                style={{ width: `${(Object.values(values).filter(v => v?.trim()).length / fields.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!hasValues}
            className={`
              w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
              text-sm font-medium transition-all duration-200
              ${hasValues
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg hover:scale-[1.02]'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Send className="w-4 h-4" />
            <span>Enviar configuración</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Función para detectar campos de entrada solicitados
const parseInputFields = (text) => {
  const fields = [];
  const lines = text.split('\n');
  
  // NO mostrar formulario si es un menú de selección de área (flujo edición)
  const isAreaSelectionMenu = lines.some(line => 
    /¿?en\s+qué\s+área\s+deseas\s+trabajar/i.test(line) ||
    /responde\s+con\s+(el\s+)?número\s+o\s+nombre/i.test(line) ||
    /selecciona\s+(una\s+)?opción/i.test(line) ||
    /elige\s+(una\s+)?(sección|área|opción)/i.test(line)
  );
  
  if (isAreaSelectionMenu) return fields;
  
  // NO mostrar formulario si hay acciones Agregar/Modificar/Eliminar (es menú de acciones)
  const hasActionMenu = lines.some(line => 
    /^[-•]?\s*\*?\*?Agregar\*?\*?\s*:/i.test(line.trim()) ||
    /^[-•]?\s*\*?\*?Modificar\*?\*?\s*:/i.test(line.trim()) ||
    /^[-•]?\s*\*?\*?Eliminar\*?\*?\s*:/i.test(line.trim()) ||
    /¿?qué\s+deseas\s+hacer\??/i.test(line)
  );
  
  if (hasActionMenu) return fields;
  
  // NO mostrar formulario si es un resumen de estado actual
  const isStatusSummary = lines.some(line =>
    /aquí\s+está\s+el\s+estado\s+actual/i.test(line) ||
    /estado\s+actual\s+de\s+(la\s+)?sección/i.test(line)
  );
  
  if (isStatusSummary) return fields;
  
  // Detectar si es flujo de AGREGAR ENDPOINT
  const isAddEndpointFlow = lines.some(line =>
    /agregar\s+(nuevos?\s+)?endpoints?/i.test(line) ||
    /para\s+agregar\s+(un\s+)?nuevo\s+endpoint/i.test(line) ||
    /crear\s+(un\s+)?nuevo\s+endpoint/i.test(line)
  );
  
  if (isAddEndpointFlow) {
    return [
      { id: 'ruta', label: 'Ruta del Endpoint', placeholder: 'Ej: /api/users, /api/products/:id...' },
      { id: 'metodo', label: 'Método HTTP', options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
      { id: 'descripcion', label: 'Descripción', placeholder: '¿Qué hace este endpoint?' },
      { id: 'autenticacion', label: 'Autenticación', options: ['Requerida', 'Opcional', 'Pública'] },
      { id: 'parametros', label: 'Parámetros', placeholder: 'Ej: id, page, limit, filter...' }
    ];
  }
  
  // Detectar si es flujo de AGREGAR MÓDULO
  const isAddModuleFlow = lines.some(line =>
    /agregar\s+(nuevos?\s+)?módulos?/i.test(line) ||
    /para\s+agregar\s+(un\s+)?nuevo\s+módulo/i.test(line) ||
    /crear\s+(un\s+)?nuevo\s+módulo/i.test(line)
  );
  
  if (isAddModuleFlow) {
    return [
      { id: 'nombre_modulo', label: 'Nombre del Módulo', placeholder: 'Ej: Auth, Dashboard, Reports...' },
      { id: 'tipo_modulo', label: 'Tipo', options: ['Core', 'Feature', 'Shared', 'Utils'] },
      { id: 'funcionalidades', label: 'Funcionalidades', placeholder: 'Lista las funcionalidades principales...' },
      { id: 'dependencias', label: 'Dependencias', placeholder: 'Ej: Auth, Database, API...' },
      { id: 'complejidad', label: 'Complejidad', options: ['Baja', 'Media', 'Alta'] }
    ];
  }
  
  // Detectar si es flujo de AGREGAR CARPETA/ESTRUCTURA
  const isAddFolderFlow = lines.some(line =>
    /agregar\s+(nuevas?\s+)?(carpetas?|directorios?)/i.test(line) ||
    /para\s+agregar\s+(una\s+)?nueva\s+carpeta/i.test(line) ||
    /crear\s+(una\s+)?nueva\s+(carpeta|estructura)/i.test(line)
  );
  
  if (isAddFolderFlow) {
    return [
      { id: 'nombre_carpeta', label: 'Nombre de la Carpeta', placeholder: 'Ej: components, utils, hooks...' },
      { id: 'ubicacion', label: 'Ubicación', placeholder: 'Ej: src/, lib/, app/...' },
      { id: 'proposito', label: 'Propósito', placeholder: '¿Para qué servirá esta carpeta?' },
      { id: 'archivos', label: 'Archivos iniciales', placeholder: 'Ej: index.js, types.ts...' }
    ];
  }
  
  // Solo procesar si parece que la IA está pidiendo información (contiene preguntas)
  const hasQuestions = lines.some(line => 
    line.includes('¿') || 
    /necesito\s+(estos\s+)?detalles/i.test(line) ||
    /proporciona\s+(los\s+)?detalles/i.test(line) ||
    /podrías\s+proporcionarme/i.test(line) ||
    /especificar\s+(las\s+)?tecnologías/i.test(line)
  );
  
  if (!hasQuestions) return fields;
  
  // Patrones de campos - detectar preguntas y campos solicitados
  const fieldPatterns = [
    // Campos de arquitectura - preguntas iniciales
    { pattern: /¿?tipo\s*(de)?\s*(aplicación|app)\??\s*\(([^)]+)\)/i, id: 'tipo_app', label: 'Tipo de Aplicación', extractOptions: true, optionGroup: 3 },
    { pattern: /¿?escala\s*(esperada)?\??\s*\(([^)]+)\)/i, id: 'escala', label: 'Escala Esperada', extractOptions: true, optionGroup: 2 },
    { pattern: /¿?requisitos\s*(especiales)?\??\s*\(([^)]+)\)/i, id: 'requisitos', label: 'Requisitos Especiales', extractOptions: true, optionGroup: 2 },
    
    // Campos de tecnologías - segunda ronda de preguntas
    { pattern: /frontend/i, id: 'frontend', label: 'Frontend', placeholder: 'Ej: React, Vue, Angular...' },
    { pattern: /backend/i, id: 'backend', label: 'Backend', placeholder: 'Ej: Node.js, Python, Java...' },
    { pattern: /base\s*de\s*datos|database/i, id: 'database', label: 'Base de Datos', placeholder: 'Ej: PostgreSQL, MongoDB, MySQL...' },
    { pattern: /devops|infraestructura|deploy/i, id: 'devops', label: 'DevOps', placeholder: 'Ej: Docker, AWS, Vercel...' },
    
    // Campos de módulos
    { pattern: /^-?\s*nombre\s*(del|de la)?\s*(módulo|tabla|endpoint|entidad)?$/i, id: 'nombre', label: 'Nombre' },
    { pattern: /^-?\s*descripción\s*(del|de la)?\s*(módulo|tabla|endpoint)?$/i, id: 'descripcion', label: 'Descripción' },
    { pattern: /^-?\s*tipo\s*\(([^)]+)\)$/i, id: 'tipo', label: 'Tipo', extractOptions: true },
    { pattern: /^-?\s*complejidad\s*(estimada)?\s*\(([^)]+)\)$/i, id: 'complejidad', label: 'Complejidad', extractOptions: true, optionGroup: 2 },
    { pattern: /^-?\s*funcionalidades|características\s*(principales)?$/i, id: 'funcionalidades', label: 'Funcionalidades' },
    { pattern: /^-?\s*dependencias\s*(si las hay)?$/i, id: 'dependencias', label: 'Dependencias' },
  ];
  
  lines.forEach((line) => {
    const trimmed = line.trim();
    
    // Ignorar líneas muy cortas o que no parecen campos
    if (trimmed.length < 3) return;
    
    // Ignorar líneas que son claramente texto narrativo (no campos)
    if (/^(perfecto|vamos|espero|necesito|proporciona|para\s+(crear|continuar)|parece\s+que|podrías)/i.test(trimmed)) return;
    
    fieldPatterns.forEach(({ pattern, id, label, extractOptions, optionGroup = 1, placeholder }) => {
      if (pattern.test(trimmed) && !fields.find(f => f.id === id)) {
        const field = { id, label };
        
        if (placeholder) {
          field.placeholder = placeholder;
        }
        
        if (extractOptions) {
          const match = trimmed.match(pattern);
          if (match && match[optionGroup]) {
            field.options = match[optionGroup].split(',').map(o => o.trim());
          }
        }
        
        fields.push(field);
      }
    });
  });
  
  return fields;
};
// Función para detectar opciones de sección (1-4) - Solo en menús de selección explícitos
const parseSectionOptions = (text) => {
  const options = [];
  const lines = text.split('\n');
  
  // Verificar si es un menú de selección de área (flujo edición arquitectura)
  const isAreaSelectionMenu = lines.some(line => 
    /¿?en\s+qué\s+área\s+deseas\s+trabajar/i.test(line) ||
    /responde\s+con\s+(el\s+)?número\s+o\s+nombre/i.test(line) ||
    /selecciona\s+(una\s+)?opción/i.test(line)
  );
  
  // Si es menú de selección de área, mostrar las 3 opciones (sin Base de Datos - se maneja en Canvas)
  if (isAreaSelectionMenu) {
    return [
      { number: '1', title: 'Estructura del Proyecto', message: '1️⃣ Estructura del Proyecto - Carpetas y organización de archivos' },
      { number: '2', title: 'API Endpoints', message: '2️⃣ API Endpoints - Rutas y métodos HTTP' },
      { number: '3', title: 'Módulos del Sistema', message: '3️⃣ Módulos del Sistema - Componentes y funcionalidades' }
    ];
  }
  
  // Verificar si es un contexto de preguntas/formulario (NO mostrar botones de sección)
  const isQuestionContext = lines.some(line => 
    /necesito\s+(estos\s+)?detalles/i.test(line) ||
    /proporciona\s+(los\s+)?detalles/i.test(line) ||
    /podrías\s+proporcionarme/i.test(line) ||
    /especificar\s+(las\s+)?tecnologías/i.test(line)
  );
  
  if (isQuestionContext) return options;
  
  // Solo procesar si parece un menú de selección (tiene múltiples opciones numeradas con emojis)
  const menuLines = lines.filter(line => 
    /[1️⃣2️⃣3️⃣]/.test(line) && 
    (
      /estructura/i.test(line) ||
      /api|endpoints/i.test(line) ||
      /módulos/i.test(line)
    )
  );
  
  if (menuLines.length < 2) return options;
  
  lines.forEach((line) => {
    // Opción 1 - Estructura (debe tener el emoji Y la palabra)
    if (/[1️⃣①]/.test(line) && /estructura/i.test(line)) {
      if (!options.find(o => o.number === '1')) {
        options.push({
          number: '1',
          title: 'Estructura del Proyecto',
          message: '1️⃣ Estructura del Proyecto - Carpetas y organización de archivos'
        });
      }
    }
    // Opción 2 - API Endpoints
    else if (/[2️⃣②]/.test(line) && /api|endpoints/i.test(line)) {
      if (!options.find(o => o.number === '2')) {
        options.push({
          number: '2',
          title: 'API Endpoints',
          message: '2️⃣ API Endpoints - Rutas y métodos HTTP'
        });
      }
    }
    // Opción 3 - Módulos
    else if (/[3️⃣③]/.test(line) && /módulos/i.test(line)) {
      if (!options.find(o => o.number === '3')) {
        options.push({
          number: '3',
          title: 'Módulos del Sistema',
          message: '3️⃣ Módulos del Sistema - Componentes y funcionalidades'
        });
      }
    }
  });
  
  return options;
};

// Función para detectar opciones de acción (Agregar, Modificar, Eliminar)
const parseActionOptions = (text) => {
  const actions = [];
  const lines = text.split('\n');
  
  // Verificar si es contexto de acciones ("¿Qué deseas hacer?" o similar)
  const isActionContext = lines.some(line => 
    /¿qué\s+deseas\s+hacer\??/i.test(line) ||
    /puedes\s+(agregar|modificar|eliminar)/i.test(line) ||
    /describe\s+los\s+cambios/i.test(line)
  );
  
  if (!isActionContext) return actions;
  
  // Detectar el contexto (qué se está editando: módulos, endpoints, estructura)
  let context = 'elementos';
  if (/módulos/i.test(text)) context = 'nuevos módulos';
  else if (/endpoints/i.test(text)) context = 'nuevos endpoints';
  else if (/estructura|carpetas/i.test(text)) context = 'nuevas carpetas';
  
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // Detectar "Agregar: ..." o "**Agregar**: ..." o "- **Agregar**: ..."
    if (/^[-•]?\s*\*?\*?Agregar\*?\*?\s*:/i.test(trimmedLine)) {
      const desc = trimmedLine.match(/:\s*(.+)$/)?.[1]?.replace(/\*+/g, '').trim() || context;
      actions.push({
        type: 'agregar',
        context: desc
      });
    }
    // Detectar "Modificar: ..." o "**Modificar**: ..."
    else if (/^[-•]?\s*\*?\*?Modificar\*?\*?\s*:/i.test(trimmedLine)) {
      const desc = trimmedLine.match(/:\s*(.+)$/)?.[1]?.replace(/\*+/g, '').trim() || 'elementos existentes';
      actions.push({
        type: 'modificar',
        context: desc
      });
    }
    // Detectar "Eliminar: ..." o "**Eliminar**: ..."
    else if (/^[-•]?\s*\*?\*?Eliminar\*?\*?\s*:/i.test(trimmedLine)) {
      const desc = trimmedLine.match(/:\s*(.+)$/)?.[1]?.replace(/\*+/g, '').trim() || 'elementos que ya no necesitas';
      actions.push({
        type: 'eliminar',
        context: desc
      });
    }
  });
  
  // Si detectamos contexto de acciones pero no encontramos las opciones específicas,
  // agregar las 3 opciones por defecto
  if (actions.length === 0 && isActionContext) {
    actions.push(
      { type: 'agregar', context: context },
      { type: 'modificar', context: 'elementos existentes' },
      { type: 'eliminar', context: 'elementos que ya no necesitas' }
    );
  }
  
  return actions;
};

// Función para limpiar el texto de las opciones e inputs
const cleanTextFromOptions = (text, sectionOptions, actionOptions, inputFields) => {
  const lines = text.split('\n');
  const cleanedLines = lines.filter(line => {
    const trimmed = line.trim();
    
    // Limpiar opciones de sección (3 opciones: Estructura, Endpoints, Módulos)
    const isSectionLine = (
      (/[1️⃣①]|^\*?\*?1\*?\*?\s/.test(line) && /estructura/i.test(line)) ||
      (/[2️⃣②]|^\*?\*?2\*?\*?\s/.test(line) && /api|endpoints/i.test(line)) ||
      (/[3️⃣③]|^\*?\*?3\*?\*?\s/.test(line) && /módulos/i.test(line))
    );
    
    // Limpiar opciones de acción - detectar con o sin bullets/dashes
    const isActionLine = (
      /[-•*]\s*\*?\*?Agregar\*?\*?\s*:/i.test(trimmed) ||
      /[-•*]\s*\*?\*?Modificar\*?\*?\s*:/i.test(trimmed) ||
      /[-•*]\s*\*?\*?Eliminar\*?\*?\s*:/i.test(trimmed) ||
      /^\*?\*?Agregar\*?\*?\s*:/i.test(trimmed) ||
      /^\*?\*?Modificar\*?\*?\s*:/i.test(trimmed) ||
      /^\*?\*?Eliminar\*?\*?\s*:/i.test(trimmed)
    );

    // Limpiar campos de entrada si hay formulario
    const isInputFieldLine = inputFields.length > 0 && (
      /nombre\s*(del|de la)?\s*(módulo|tabla|endpoint|entidad)?$/i.test(trimmed) ||
      /descripción\s*(del|de la)?\s*(módulo|tabla|endpoint)?$/i.test(trimmed) ||
      /tipo\s*\([^)]+\)$/i.test(trimmed) ||
      /complejidad\s*(estimada)?\s*\([^)]+\)$/i.test(trimmed) ||
      /funcionalidades|características\s*(principales)?$/i.test(trimmed) ||
      /dependencias\s*(si las hay)?$/i.test(trimmed) ||
      /método\s*http\s*\([^)]+\)$/i.test(trimmed) ||
      /ruta|path|endpoint$/i.test(trimmed)
    );
    
    return !isSectionLine && !isActionLine && !isInputFieldLine;
  });
  return cleanedLines.join('\n');
};

// Detectar contexto de formulario
const detectFormContext = (text) => {
  // Flujos de agregar (sin Base de Datos - se maneja en Canvas)
  if (/agregar\s+(nuevos?\s+)?endpoints?/i.test(text)) return '🌐 Nuevo Endpoint';
  if (/agregar\s+(nuevos?\s+)?módulos?/i.test(text)) return '📦 Nuevo Módulo';
  if (/agregar\s+(nuevas?\s+)?(carpetas?|estructura)/i.test(text)) return '📁 Nueva Carpeta';
  
  // Flujos de tecnologías
  if (/especificar\s+(las\s+)?tecnologías/i.test(text) || /frontend|backend|devops/i.test(text)) return '⚙️ Configuración de Tecnologías';
  
  // Flujo de creación de arquitectura
  if (/tipo\s*(de)?\s*(aplicación|app)/i.test(text)) return '🏗️ Nueva Arquitectura';
  
  return '✨ Completa los datos';
};

// Función para detectar si el mensaje contiene una historia de usuario generada
const detectUserStory = (messageText) => {
  // PRIMERO: Verificar que NO sea una tarea técnica, bug o mejora
  const isTechnicalItem = /(?:🔧\s*\*\*Tarea\s*T[eé]cnica\*\*|🐛\s*\*\*Bug\*\*|✨\s*\*\*Mejora\*\*|Tarea\s*T[eé]cnica|tarea\s+creada|resumen\s+de\s+la\s+tarea)/i.test(messageText);
  if (isTechnicalItem) {
    return false;
  }
  
  // Detectar patrones de historia de usuario (escapar asteriscos correctamente)
  const hasStoryPattern = /(?:T[ií]tulo de la historia|Historia de Usuario|📋\s*\*\*Historia|\*\*Como\*\*|Como\s+\[?\w+.*quiero)/i.test(messageText);
  const hasCriteria = /(?:Criterios de aceptaci[oó]n|Criterios:)/i.test(messageText);
  const hasStoryPoints = /Story Points:|puntos de historia/i.test(messageText);
  const hasPriority = /Must Have|Should Have|Could Have|Won't Have/i.test(messageText);
  
  // Una historia debe tener el patrón de historia Y criterios o story points específicos de historias
  return hasStoryPattern && (hasCriteria || hasStoryPoints || hasPriority);
};

// Función para extraer datos de la historia del mensaje
const extractStoryData = (messageText, selectedProduct) => {
  const story = { producto: selectedProduct?._id };
  
  // Extraer título
  const titleMatch = messageText.match(/\*\*T[ií]tulo\*\*:?\s*(.+?)(?:\n|$)/i) || 
                    messageText.match(/T[ií]tulo de la historia:?\s*(.+?)(?:\n|$)/i) ||
                    messageText.match(/T[ií]tulo:?\s*(.+?)(?:\n|$)/i);
  if (titleMatch) story.titulo = titleMatch[1].replace(/\*\*/g, '').trim();
  
  // Extraer descripción (historia de usuario)
  const descMatch = messageText.match(/\*\*Como\*\*\s+(.+?)\s*\*\*[Qq]uiero\*\*\s+(.+?)\s*\*\*[Pp]ara\*\*\s+(.+?)(?:\n|$)/i) ||
                   messageText.match(/Como\s+(.+?),?\s*[Qq]uiero\s+(.+?)\s*[Pp]ara\s+(.+?)(?:\n|$)/i);
  if (descMatch) {
    story.descripcion = `Como ${descMatch[1].trim()}, quiero ${descMatch[2].trim()} para ${descMatch[3].trim()}`;
  } else {
    // Buscar descripción simple
    const simpleDescMatch = messageText.match(/\*\*Descripci[oó]n\*\*:?\s*(.+?)(?:\n\*\*|$)/is);
    if (simpleDescMatch) story.descripcion = simpleDescMatch[1].trim();
  }
  
  // Extraer criterios de aceptación (formato que espera el backend)
  const criteriaSection = messageText.match(/Criterios de aceptaci[oó]n:?([\s\S]+?)(?:\n\*\*|Story Points|Prioridad|Estimaci[oó]n|$)/i);
  if (criteriaSection) {
    const criteriaLines = criteriaSection[1]
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[\d✓.\-\s]+/, '').trim())
      .filter(line => line.length > 0);
    // El backend espera un array de objetos con { descripcion, completado }
    story.criterios_aceptacion = criteriaLines.map(desc => ({
      descripcion: desc,
      completado: false
    }));
  }
  
  // Extraer story points (el backend usa puntos_historia)
  const pointsMatch = messageText.match(/Story Points:?\s*(\d+)/i) ||
                     messageText.match(/Estimaci[oó]n:?\s*(\d+)\s*(?:puntos|d[ií]as)/i);
  if (pointsMatch) story.puntos_historia = parseInt(pointsMatch[1]);
  
  // Extraer prioridad (el backend usa: muy_alta, alta, media, baja)
  const priorityMatch = messageText.match(/Prioridad:?\s*(Must Have|Should Have|Could Have|Won't Have|Muy Alta|Alta|Media|Baja)/i);
  if (priorityMatch) {
    const priorityMap = {
      'must have': 'muy_alta',
      'should have': 'alta',
      'could have': 'media',
      "won't have": 'baja',
      'muy alta': 'muy_alta',
      'alta': 'alta',
      'media': 'media',
      'baja': 'baja'
    };
    story.prioridad = priorityMap[priorityMatch[1].toLowerCase()] || 'media';
  } else {
    story.prioridad = 'media'; // Valor por defecto
  }
  
  // Tipo: el backend usa 'historia', 'tarea', 'bug', 'mejora'
  story.tipo = 'historia';
  // Estado: el backend usa 'pendiente', 'en_progreso', 'en_revision', 'en_pruebas', 'completado'
  story.estado = 'pendiente';
  
  return story;
};

// Función para detectar si el mensaje contiene un sprint generado
const detectSprint = (messageText) => {
  // Detectar patrones de sprint
  const hasSprintPattern = /(?:Sprint\s*\d*|Nombre del Sprint|\*\*Nombre\*\*:|\*\*Sprint\*\*)/i.test(messageText);
  const hasObjective = /(?:Objetivo|Meta|Goal):/i.test(messageText);
  const hasDates = /(?:Fecha\s*de?\s*inicio|Fecha\s*de?\s*fin|Duraci[oó]n|Inicio:|Fin:)/i.test(messageText);
  const hasVelocity = /(?:Velocidad|Capacidad|Story\s*Points?\s*planificados?)/i.test(messageText);
  
  // Debe tener patrón de sprint + (objetivo O fechas)
  return hasSprintPattern && (hasObjective || hasDates || hasVelocity);
};

// Función para extraer datos del sprint del mensaje
const extractSprintData = (messageText, selectedProduct) => {
  const sprint = { producto: selectedProduct?._id };
  
  // Extraer nombre
  const nombreMatch = messageText.match(/\*\*Nombre\*\*:?\s*(.+?)(?:\n|$)/i) ||
                     messageText.match(/\*\*Sprint\*\*:?\s*(.+?)(?:\n|$)/i) ||
                     messageText.match(/Nombre del Sprint:?\s*(.+?)(?:\n|$)/i) ||
                     messageText.match(/Sprint\s*(\d+):?\s*(.+?)(?:\n|$)/i);
  if (nombreMatch) {
    sprint.nombre = nombreMatch[1].replace(/\*\*/g, '').trim();
    // Si el patrón fue "Sprint X: nombre", usar el grupo 2
    if (nombreMatch[2]) sprint.nombre = `Sprint ${nombreMatch[1]}: ${nombreMatch[2].trim()}`;
  }
  
  // Extraer objetivo
  const objetivoMatch = messageText.match(/\*\*Objetivo\*\*:?\s*(.+?)(?:\n\*\*|$)/is) ||
                       messageText.match(/Objetivo:?\s*(.+?)(?:\n\*\*|\nFecha|$)/is) ||
                       messageText.match(/\*\*Meta\*\*:?\s*(.+?)(?:\n|$)/i) ||
                       messageText.match(/Goal:?\s*(.+?)(?:\n|$)/i);
  if (objetivoMatch) sprint.objetivo = objetivoMatch[1].replace(/\*\*/g, '').trim();
  
  // Extraer fechas
  const fechaInicioMatch = messageText.match(/\*\*(?:Fecha\s*de?\s*)?Inicio\*\*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i) ||
                          messageText.match(/Fecha\s*de?\s*inicio:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i) ||
                          messageText.match(/Inicio:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i);
  if (fechaInicioMatch) {
    sprint.fecha_inicio = parseSprintDate(fechaInicioMatch[1]);
  }
  
  const fechaFinMatch = messageText.match(/\*\*(?:Fecha\s*de?\s*)?Fin\*\*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i) ||
                       messageText.match(/Fecha\s*de?\s*fin:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i) ||
                       messageText.match(/Fin:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i);
  if (fechaFinMatch) {
    sprint.fecha_fin = parseSprintDate(fechaFinMatch[1]);
  }
  
  // Si no hay fechas específicas, usar fechas por defecto (hoy + 2 semanas)
  if (!sprint.fecha_inicio) {
    const today = new Date();
    sprint.fecha_inicio = today.toISOString().split('T')[0];
  }
  if (!sprint.fecha_fin) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 2 semanas por defecto
    sprint.fecha_fin = endDate.toISOString().split('T')[0];
  }
  
  // Extraer velocidad planificada
  const velocidadMatch = messageText.match(/\*\*Velocidad(?:\s*Planificada)?\*\*:?\s*(\d+)/i) ||
                        messageText.match(/Velocidad(?:\s*planificada)?:?\s*(\d+)/i) ||
                        messageText.match(/Story\s*Points?\s*planificados?:?\s*(\d+)/i) ||
                        messageText.match(/Capacidad:?\s*(\d+)/i);
  if (velocidadMatch) sprint.velocidad_planificada = parseInt(velocidadMatch[1]);
  
  // Extraer prioridad (el backend usa: baja, media, alta, critica)
  const prioridadMatch = messageText.match(/\*\*Prioridad\*\*:?\s*(Cr[ií]tica|Alta|Media|Baja)/i) ||
                        messageText.match(/Prioridad:?\s*(Cr[ií]tica|Alta|Media|Baja)/i);
  if (prioridadMatch) {
    const prioridadMap = {
      'critica': 'critica',
      'crítica': 'critica',
      'alta': 'alta',
      'media': 'media',
      'baja': 'baja'
    };
    sprint.prioridad = prioridadMap[prioridadMatch[1].toLowerCase()] || 'media';
  } else {
    sprint.prioridad = 'media';
  }
  
  // Estado por defecto
  sprint.estado = 'planificado';
  
  return sprint;
};

// Función auxiliar para parsear fechas en varios formatos
const parseSprintDate = (dateStr) => {
  // Formato: DD/MM/YYYY o DD-MM-YYYY
  const dmyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (dmyMatch) {
    let year = parseInt(dmyMatch[3]);
    if (year < 100) year += 2000; // Convertir 25 -> 2025
    const month = parseInt(dmyMatch[2]) - 1;
    const day = parseInt(dmyMatch[1]);
    return new Date(year, month, day).toISOString().split('T')[0];
  }
  
  // Formato: YYYY-MM-DD o YYYY/MM/DD
  const ymdMatch = dateStr.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (ymdMatch) {
    return `${ymdMatch[1]}-${ymdMatch[2].padStart(2, '0')}-${ymdMatch[3].padStart(2, '0')}`;
  }
  
  return dateStr;
};

// Función para detectar si el mensaje contiene MÚLTIPLES elementos técnicos
const detectMultipleTechnicalItems = (messageText) => {
  // Patrón 1: "🔧 **Tareas Técnicas (N)**"
  const multiplePattern = /🔧\s*\*\*Tareas\s*T[eé]cnicas?\s*\((\d+)\)\*\*/i;
  const match = messageText.match(multiplePattern);
  
  if (match) {
    const expectedCount = parseInt(match[1]);
    return {
      isMultiple: true,
      expectedCount,
      actualCount: expectedCount
    };
  }
  
  // Patrón 2: Detectar "Tarea X de N:" múltiples veces
  const taskHeaderPattern = /(?:Tarea|Task)\s+(\d+)\s+de\s+(\d+):?/gi;
  const taskHeaders = [...messageText.matchAll(taskHeaderPattern)];
  
  if (taskHeaders.length >= 2) {
    const totalFromHeaders = taskHeaders[0] ? parseInt(taskHeaders[0][2]) : taskHeaders.length;
    return {
      isMultiple: true,
      expectedCount: totalFromHeaders,
      actualCount: taskHeaders.length
    };
  }
  
  // Patrón 3: Múltiples secciones con título y descripción separadas por ---
  const sections = messageText.split(/\n---\n|\n---/).filter(s => s.trim());
  const tasksFound = sections.filter(section => 
    /\*\*T[ií]tulo\*\*:?/i.test(section) && 
    /\*\*Descripci[oó]n\*\*:?/i.test(section)
  );
  
  if (tasksFound.length >= 2) {
    return {
      isMultiple: true,
      expectedCount: tasksFound.length,
      actualCount: tasksFound.length
    };
  }
  
  // Patrón 4: Múltiples bloques "**Título:**" en el mensaje
  const titleMatches = messageText.match(/\*\*T[ií]tulo:?\*\*/gi) || [];
  if (titleMatches.length >= 2) {
    return {
      isMultiple: true,
      expectedCount: titleMatches.length,
      actualCount: titleMatches.length
    };
  }
  
  // Patrón 5: Detectar "Título:" sin asteriscos múltiples veces
  const simpleTitleMatches = messageText.match(/T[ií]tulo:?\s+\S+/gi) || [];
  if (simpleTitleMatches.length >= 2) {
    return {
      isMultiple: true,
      expectedCount: simpleTitleMatches.length,
      actualCount: simpleTitleMatches.length
    };
  }
  
  return { isMultiple: false };
};

// Función para extraer MÚLTIPLES elementos técnicos del mensaje
const extractMultipleTechnicalItems = (messageText, selectedProduct, selectedSprint) => {
  const items = [];
  
  // Obtener IDs de producto y sprint
  let productoId = null;
  if (selectedProduct) {
    if (typeof selectedProduct === 'string' && isValidObjectId(selectedProduct)) {
      productoId = selectedProduct;
    } else if (selectedProduct._id && isValidObjectId(selectedProduct._id)) {
      productoId = selectedProduct._id;
    }
  }
  
  let sprintId = null;
  if (selectedSprint) {
    if (typeof selectedSprint === 'string' && isValidObjectId(selectedSprint)) {
      sprintId = selectedSprint;
    } else if (selectedSprint._id && isValidObjectId(selectedSprint._id)) {
      sprintId = selectedSprint._id;
    }
  }
  
  // Si no hay producto pero hay sprint con producto, obtenerlo
  if (!productoId && selectedSprint?.producto) {
    const sprintProducto = selectedSprint.producto;
    if (typeof sprintProducto === 'string' && isValidObjectId(sprintProducto)) {
      productoId = sprintProducto;
    } else if (sprintProducto._id && isValidObjectId(sprintProducto._id)) {
      productoId = sprintProducto._id;
    }
  }
  
  // MÉTODO 1: Buscar patrón "Tarea X de N:" y extraer bloques
  // Este patrón captura todo desde "Tarea X de N:" hasta la siguiente tarea o fin
  const tareaRegex = /(?:Tarea|Task)\s+(\d+)\s+de\s+(\d+):?\s*([\s\S]*?)(?=(?:Tarea|Task)\s+\d+\s+de\s+\d+:|$)/gi;
  let match;
  let sections = [];
  
  while ((match = tareaRegex.exec(messageText)) !== null) {
    const tareaContent = match[3].trim();
    if (tareaContent) {
      sections.push(tareaContent);
    }
  }
  
  // Si no encontramos el patrón "Tarea X de N", intentar con separador ---
  if (sections.length === 0) {
    sections = messageText.split(/\n---\n|\n---/).filter(s => s.trim());
  }
  
  // Si aún no hay secciones, intentar dividir por "**Título:**" precedido de salto de línea
  if (sections.length <= 1) {
    // Buscar cada bloque que empieza con Título
    const titleSplitPattern = /(?=\*\*T[ií]tulo:?\*\*)/gi;
    sections = messageText.split(titleSplitPattern).filter(s => s.trim() && /\*\*T[ií]tulo/i.test(s));
  }
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    
    // Verificar que esta sección tiene contenido útil
    // Puede tener "Título:" explícito O puede empezar directamente con el texto
    const hasExplicitTitle = /T[ií]tulo:?\s*.+/i.test(section);
    const hasContent = section.trim().length > 10; // Al menos algo de contenido
    
    if (!hasExplicitTitle && !hasContent) {
      continue;
    }
    
    const item = {
      producto: productoId,
      tipo: 'tarea',
      estado: 'pendiente'
    };
    
    if (sprintId) {
      item.sprint = sprintId;
    }
    
    // Detectar tipo (tarea, bug, mejora)
    if (/🐛|bug/i.test(section)) {
      item.tipo = 'bug';
    } else if (/✨|mejora/i.test(section)) {
      item.tipo = 'mejora';
    }
    
    // Extraer título - múltiples patrones (con y sin **)
    let tituloMatch = section.match(/\*\*T[ií]tulo:?\*\*:?\s*(.+)/i) ||
                      section.match(/T[ií]tulo:?\s*(.+)/i);
    
    // Si no hay match explícito de "Título:", tomar la primera línea como título
    if (!tituloMatch) {
      const firstLine = section.trim().split('\n')[0];
      if (firstLine && firstLine.length > 3) {
        tituloMatch = [null, firstLine];
      }
    }
    
    if (tituloMatch) {
      item.titulo = tituloMatch[1].split('\n')[0].replace(/\*\*/g, '').trim();
    }
    
    // Extraer descripción (con y sin **)
    const descMatch = section.match(/\*\*Descripci[oó]n:?\*\*:?\s*([\s\S]+?)(?=\n\*?\*?Prioridad|\n\*?\*?Estimaci[oó]n|\n\*?\*?Etiquetas|Tarea\s+\d+|$)/i) ||
                     section.match(/Descripci[oó]n:?\s*([\s\S]+?)(?=\n\*?\*?Prioridad|\n\*?\*?Estimaci[oó]n|\n\*?\*?Etiquetas|Tarea\s+\d+|$)/i);
    if (descMatch) {
      item.descripcion = descMatch[1].replace(/\*\*/g, '').trim();
    }
    
    // Extraer prioridad (con y sin **)
    const prioridadMatch = section.match(/\*?\*?Prioridad:?\*?\*?:?\s*(Muy\s*Alta|Cr[ií]tica|Alta|Media|Baja)/i);
    if (prioridadMatch) {
      const prioridadMap = {
        'muy alta': 'muy_alta', 'critica': 'muy_alta', 'crítica': 'muy_alta',
        'alta': 'alta', 'media': 'media', 'baja': 'baja'
      };
      item.prioridad = prioridadMap[prioridadMatch[1].toLowerCase()] || 'media';
    } else {
      item.prioridad = 'media';
    }
    
    // Extraer estimación (con y sin **)
    const puntosMatch = section.match(/\*?\*?Estimaci[oó]n:?\*?\*?:?\s*(\d+)/i) ||
                       section.match(/(\d+)\s*(?:horas?|puntos?)/i);
    if (puntosMatch) {
      item.puntos_historia = parseInt(puntosMatch[1]);
    }
    
    // Extraer etiquetas
    const etiquetasMatch = section.match(/\*?\*?Etiquetas?:?\*?\*?:?\s*(.+?)(?:\n|$)/i);
    if (etiquetasMatch) {
      item.etiquetas = etiquetasMatch[1].split(/[,;]/).map(e => e.trim()).filter(e => e.length > 0);
    }
    
    // Solo agregar si tiene título
    if (item.titulo) {
      // Si no tiene descripción, usar una genérica
      if (!item.descripcion) {
        item.descripcion = `Tarea técnica: ${item.titulo}`;
      }
      items.push(item);
    }
  }
  
  return items;
};

// Función para detectar si el mensaje contiene un elemento técnico (tarea, bug, mejora)
const detectTechnicalItem = (messageText) => {
  // PRIMERO verificar si son múltiples tareas - en ese caso no detectar como individual
  const multipleCheck = detectMultipleTechnicalItems(messageText);
  if (multipleCheck.isMultiple) {
    return null; // No detectar como individual si son múltiples
  }
  
  // Patrones para tarea técnica (incluyendo emoji)
  const hasTareaPattern = /(?:🔧\s*\*\*Tarea\s*T[eé]cnica\*\*|🔧\s*Tarea\s*T[eé]cnica|Tarea\s*T[eé]cnica|Nueva\s*Tarea|\*\*Tarea\*\*:?|resumen\s+de\s+la\s+tarea\s+creada|tarea\s+para|propuesta\s+de\s+tarea|crear[eé]?\s+(?:la\s+)?(?:siguiente\s+)?tarea|una\s+tarea\s+técnica|he\s+preparado\s+(?:la\s+)?(?:siguiente\s+)?tarea|aquí\s+(?:está|tienes)\s+(?:un\s+resumen|la\s+tarea))/i.test(messageText);
  
  // Patrones para bug (incluyendo emoji)
  const hasBugPattern = /(?:🐛\s*\*\*Bug\*\*|🐛\s*Bug|Bug\s*Reportado|Nuevo\s*Bug|Reporte\s*de\s*Bug|\*\*Bug\*\*:?|bug\s+para|propuesta\s+de\s+bug|crear[eé]?\s+(?:el\s+)?(?:siguiente\s+)?bug|reportar[eé]?\s+(?:el\s+)?(?:siguiente\s+)?bug|he\s+preparado\s+(?:el\s+)?(?:siguiente\s+)?bug|aquí\s+(?:está|tienes)\s+el\s+bug)/i.test(messageText);
  
  // Patrones para mejora (incluyendo emoji)
  const hasMejoraPattern = /(?:✨\s*\*\*Mejora\*\*|✨\s*Mejora|Mejora\s*T[eé]cnica|Nueva\s*Mejora|\*\*Mejora\*\*:?|mejora\s+para|propuesta\s+de\s+mejora|crear[eé]?\s+(?:la\s+)?(?:siguiente\s+)?mejora|he\s+preparado\s+(?:la\s+)?(?:siguiente\s+)?mejora|aquí\s+(?:está|tienes)\s+la\s+mejora)/i.test(messageText);
  
  // Campos comunes que indican un elemento técnico
  const hasTitle = /(?:\*\*T[ií]tulo\*\*:?|\*\*Nombre\*\*:?|T[ií]tulo:)/i.test(messageText);
  const hasDescription = /(?:\*\*Descripci[oó]n\*\*:?|Descripci[oó]n:)/i.test(messageText);
  const hasPriority = /(?:\*\*Prioridad\*\*:?|Prioridad:)/i.test(messageText);
  const hasEstimation = /(?:\*\*Estimaci[oó]n\*\*:?|Estimaci[oó]n:|\*\*Horas\*\*:?|Horas:|\*\*Puntos\*\*:?|Puntos:|\d+\s*horas)/i.test(messageText);
  const hasEtiquetas = /(?:\*\*Etiquetas?\*\*:?|Etiquetas?:)/i.test(messageText);
  
  // Verificar que tenga estructura de tarea (título + descripción o prioridad o estimación o etiquetas)
  const hasStructure = hasTitle && (hasDescription || hasPriority || hasEstimation || hasEtiquetas);
  
  // También detectar si tiene el formato típico de una propuesta técnica
  const hasTechnicalProposal = /(?:propongo\s+(?:la\s+siguiente|el\s+siguiente|crear)|aquí\s+(?:está|tienes|te\s+presento)|he\s+preparado|te\s+propongo|resumen\s+de\s+la\s+tarea)/i.test(messageText) && 
                               /(?:tarea|bug|mejora)/i.test(messageText);
  
  // NO detectar como item técnico si el mensaje está preguntando a qué historia asociar
  const isAskingForSelection = /¿A cuál quieres asociar|O puedo crearla de manera independiente|tienes.*esta historia/i.test(messageText);
  if (isAskingForSelection) {
    return null;
  }
  
  // Determinar el tipo y si es válido
  const isTarea = (hasTareaPattern && hasStructure) || (hasTechnicalProposal && /tarea/i.test(messageText) && !/bug|mejora/i.test(messageText));
  const isBug = (hasBugPattern && hasStructure) || (hasTechnicalProposal && /bug/i.test(messageText));
  const isMejora = (hasMejoraPattern && hasStructure) || (hasTechnicalProposal && /mejora/i.test(messageText) && !/tarea|bug/i.test(messageText));
  
  if (isTarea) return 'tarea';
  if (isBug) return 'bug';
  if (isMejora) return 'mejora';
  
  return null;
};

// Función auxiliar para validar si un string es un ObjectId válido de MongoDB
const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return /^[a-f\d]{24}$/i.test(id);
};

// Función para extraer datos del elemento técnico del mensaje
const extractTechnicalItemData = (messageText, tipo, selectedProduct, selectedSprint) => {
  // Obtener ID del producto (puede venir como objeto o como string)
  let productoId = null;
  if (selectedProduct) {
    if (typeof selectedProduct === 'string') {
      // Solo usar si es un ObjectId válido
      if (isValidObjectId(selectedProduct)) {
        productoId = selectedProduct;
      }
    } else if (selectedProduct._id && isValidObjectId(selectedProduct._id)) {
      productoId = selectedProduct._id;
    } else if (selectedProduct.id && isValidObjectId(selectedProduct.id)) {
      productoId = selectedProduct.id;
    }
  }
  
  // Obtener ID del sprint
  let sprintId = null;
  if (selectedSprint) {
    if (typeof selectedSprint === 'string') {
      if (isValidObjectId(selectedSprint)) {
        sprintId = selectedSprint;
      }
    } else if (selectedSprint._id && isValidObjectId(selectedSprint._id)) {
      sprintId = selectedSprint._id;
    } else if (selectedSprint.id && isValidObjectId(selectedSprint.id)) {
      sprintId = selectedSprint.id;
    }
  }
  
  const item = { 
    producto: productoId,
    tipo: tipo,
    estado: 'pendiente'
  };
  
  // Si hay sprint seleccionado, asociarlo
  if (sprintId) {
    item.sprint = sprintId;
  }
  
  // Si tenemos sprint pero no producto, intentar obtener el producto del sprint
  if (!item.producto && selectedSprint?.producto) {
    const sprintProducto = selectedSprint.producto;
    if (typeof sprintProducto === 'string' && isValidObjectId(sprintProducto)) {
      item.producto = sprintProducto;
    } else if (sprintProducto._id && isValidObjectId(sprintProducto._id)) {
      item.producto = sprintProducto._id;
    }
  }
  
  // Extraer título - patrones más flexibles (usar .+ greedy hasta el fin de línea)
  const tituloMatch = messageText.match(/\*\*T[ií]tulo:?\*\*\s*(.+)/i) ||
                     messageText.match(/\*\*T[ií]tulo\*\*:?\s*(.+)/i) ||
                     messageText.match(/\*\*Nombre:?\*\*\s*(.+)/i) ||
                     messageText.match(/\*\*Nombre\*\*:?\s*(.+)/i) ||
                     messageText.match(/T[ií]tulo:\s*(.+)/i) ||
                     messageText.match(/Nombre:\s*(.+)/i);
  
  if (tituloMatch) {
    // Limpiar el título: remover asteriscos, saltos de línea al final, y trim
    item.titulo = tituloMatch[1]
      .split('\n')[0]  // Solo tomar la primera línea
      .replace(/\*\*/g, '')
      .trim();
  }
  
  // Extraer descripción - patrones más flexibles
  const descMatch = messageText.match(/\*\*Descripci[oó]n:?\*\*\s*([\s\S]+?)(?=\n\*\*|\nPrioridad|\nEstimaci[oó]n|\nHoras|\nPuntos|\nEtiquetas|$)/i) ||
                   messageText.match(/\*\*Descripci[oó]n\*\*:?\s*([\s\S]+?)(?=\n\*\*|\nPrioridad|\nEstimaci[oó]n|\nHoras|\nPuntos|\nEtiquetas|$)/i) ||
                   messageText.match(/Descripci[oó]n:\s*([\s\S]+?)(?=\n\*\*|\nPrioridad|\nEstimaci[oó]n|\nHoras|\nPuntos|\nEtiquetas|$)/i);
  
  if (descMatch) {
    item.descripcion = descMatch[1].replace(/\*\*/g, '').trim();
  }
  
  // Extraer prioridad
  const prioridadMatch = messageText.match(/\*\*Prioridad:?\*\*\s*(Muy\s*Alta|Cr[ií]tica|Alta|Media|Baja)/i) ||
                        messageText.match(/\*\*Prioridad\*\*:?\s*(Muy\s*Alta|Cr[ií]tica|Alta|Media|Baja)/i) ||
                        messageText.match(/Prioridad:\s*(Muy\s*Alta|Cr[ií]tica|Alta|Media|Baja)/i);
  if (prioridadMatch) {
    const prioridadMap = {
      'muy alta': 'muy_alta',
      'critica': 'muy_alta',
      'crítica': 'muy_alta',
      'alta': 'alta',
      'media': 'media',
      'baja': 'baja'
    };
    item.prioridad = prioridadMap[prioridadMatch[1].toLowerCase()] || 'media';
  } else {
    item.prioridad = 'media';
  }
  
  // Extraer puntos/estimación - más patrones
  const puntosMatch = messageText.match(/\*\*Estimaci[oó]n\*\*:?\s*(\d+)/i) ||
                     messageText.match(/Estimaci[oó]n:?\s*(\d+)/i) ||
                     messageText.match(/\*\*Horas\*\*:?\s*(\d+)/i) ||
                     messageText.match(/Horas:?\s*(\d+)/i) ||
                     messageText.match(/\*\*Puntos\*\*:?\s*(\d+)/i) ||
                     messageText.match(/Puntos:?\s*(\d+)/i) ||
                     messageText.match(/(\d+)\s*(?:horas?|puntos?|story\s*points?)/i);
  if (puntosMatch) item.puntos_historia = parseInt(puntosMatch[1]);
  
  // Extraer etiquetas si las hay
  const etiquetasMatch = messageText.match(/\*\*Etiquetas?\*\*:?\s*(.+?)(?:\n|$)/i) ||
                        messageText.match(/Etiquetas?:?\s*(.+?)(?:\n|$)/i) ||
                        messageText.match(/Tags?:?\s*(.+?)(?:\n|$)/i);
  if (etiquetasMatch) {
    item.etiquetas = etiquetasMatch[1].split(/[,;]/).map(e => e.trim()).filter(e => e.length > 0);
  }
  
  // Extraer historia padre si se menciona
  const historiaMatch = messageText.match(/historia[:\s]+["']?([^"'\n]+)["']?/i) ||
                       messageText.match(/asociada?\s+a\s+(?:la\s+)?historia[:\s]+["']?([^"'\n]+)["']?/i);
  if (historiaMatch) {
    item.historia_referencia = historiaMatch[1].trim();
  }
  
  return item;
};

// Función para detectar historias mencionadas en el mensaje (para selección)
const detectStoriesInMessage = (messageText) => {
  const stories = [];
  let match;
  
  // Patrón 1: "Título de Historia" (ID: 123abc)
  const pattern1 = /"([^"]+)"\s*\(ID:\s*([a-f0-9]+)\)/gi;
  while ((match = pattern1.exec(messageText)) !== null) {
    stories.push({
      titulo: match[1].trim(),
      id: match[2].trim()
    });
  }
  
  // Patrón 2: Título sin comillas seguido de (ID: xxx)
  const pattern2 = /([A-ZÁÉÍÓÚÑa-záéíóúñ][^:\n]*?)\s*\(ID:\s*([a-f0-9]+)\)/gi;
  while ((match = pattern2.exec(messageText)) !== null) {
    const titulo = match[1].trim().replace(/^["'\s]+|["'\s]+$/g, '');
    const id = match[2].trim();
    if (titulo.length > 3 && !stories.find(s => s.id === id)) {
      stories.push({ titulo, id });
    }
  }
  
  // Patrón 3: N. "Título" (ID: xxx) - Estado
  const pattern3 = /\d+\.\s*"([^"]+)"\s*\(ID:\s*([a-f0-9]+)\)/gi;
  while ((match = pattern3.exec(messageText)) !== null) {
    if (!stories.find(s => s.id === match[2].trim())) {
      stories.push({
        titulo: match[1].trim(),
        id: match[2].trim()
      });
    }
  }
  
  // Patrón 5: **Historia:** Título o Historia: Título (formato común de la IA)
  // Este formato es usado cuando la IA lista las historias del sprint
  const pattern5 = /\*?\*?Historia\*?\*?:\s*(.+?)(?:\n|$)/gi;
  while ((match = pattern5.exec(messageText)) !== null) {
    const titulo = match[1].trim().replace(/\*\*/g, '');
    if (titulo.length > 5 && !stories.find(s => s.titulo === titulo)) {
      stories.push({ 
        titulo, 
        id: null // Sin ID explícito, usaremos el título para buscar
      });
    }
  }
  
  // Patrón 6: - Historia: "Título" o viñeta con historia
  const pattern6 = /[-•]\s*(?:Historia:?\s*)?["']([^"']+)["']/gi;
  while ((match = pattern6.exec(messageText)) !== null) {
    const titulo = match[1].trim();
    if (titulo.length > 5 && !stories.find(s => s.titulo === titulo)) {
      stories.push({ titulo, id: null });
    }
  }
  
  // Patrón 4: "Título" entre comillas cuando se pregunta por asociar (sin ID explícito)
  // Solo si el mensaje pide seleccionar historia y no encontramos con otros patrones
  if (stories.length === 0 && /¿A cuál.*asociar|historia.*asociar|tienes.*historia/i.test(messageText)) {
    const pattern4 = /"([^"]{5,})"/g;
    while ((match = pattern4.exec(messageText)) !== null) {
      const titulo = match[1].trim();
      // Evitar textos que claramente no son títulos de historias
      if (titulo.length > 5 && 
          !titulo.includes('?') && 
          !/^(Sí|No|OK|Crear|Guardar|Cancelar)/i.test(titulo) &&
          !stories.find(s => s.titulo === titulo)) {
        stories.push({ 
          titulo, 
          id: null // Sin ID, usaremos el título para buscar
        });
      }
    }
  }
  
  return stories;
};

// Detectar si el mensaje pide seleccionar una historia
const isAskingForStorySelection = (messageText) => {
  const patterns = [
    /¿A cuál quieres asociar/i,
    /selecciona.*historia/i,
    /elige.*historia/i,
    /cuál.*historia.*asociar/i,
    /asociar.*tarea.*historia/i,
    /puedo crearla de manera independiente/i,
    /O puedo crearla/i,
    /crearla de manera independiente/i,
    /tienes.*(?:esta|la siguiente) historia/i
  ];
  return patterns.some(p => p.test(messageText));
};

// Componente para botones de selección de historia
const StorySelectionButtons = ({ stories, onSelect, onIndependent }) => {
  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
        📚 Selecciona una historia o crea sin asociar:
      </p>
      <div className="flex flex-wrap gap-2">
        {stories.map((story, index) => (
          <button
            key={story.id || `story-${index}`}
            onClick={() => onSelect(story)}
            className="
              flex items-center gap-2 px-3 py-2 rounded-lg
              bg-gradient-to-r from-blue-500 to-indigo-600
              hover:from-blue-600 hover:to-indigo-700
              text-white text-sm font-medium
              shadow-md hover:shadow-lg
              transform hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
              max-w-full
            "
            title={story.titulo}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-[200px]">{story.titulo}</span>
          </button>
        ))}
        <button
          onClick={onIndependent}
          className="
            flex items-center gap-2 px-3 py-2 rounded-lg
            bg-gray-100 dark:bg-gray-700
            hover:bg-gray-200 dark:hover:bg-gray-600
            text-gray-700 dark:text-gray-300 text-sm font-medium
            shadow-sm hover:shadow-md
            transform hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-200
          "
        >
          <Plus className="w-4 h-4" />
          <span>Sin historia (independiente)</span>
        </button>
      </div>
    </div>
  );
};

export const ChatMessage = ({ message, onOpenCanvas, onSendMessage, selectedProduct, selectedSprint }) => {
  const [copied, setCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Detectar opciones de sección (1-4) en el mensaje
  const sectionOptions = useMemo(() => {
    if (message.isUser) return [];
    return parseSectionOptions(message.message);
  }, [message.message, message.isUser]);

  // Detectar opciones de acción (Agregar, Modificar, Eliminar)
  const actionOptions = useMemo(() => {
    if (message.isUser) return [];
    return parseActionOptions(message.message);
  }, [message.message, message.isUser]);

  // Detectar campos de entrada (formulario)
  const inputFields = useMemo(() => {
    if (message.isUser) return [];
    return parseInputFields(message.message);
  }, [message.message, message.isUser]);

  // Contexto del formulario
  const formContext = useMemo(() => {
    return detectFormContext(message.message);
  }, [message.message]);

  // Texto limpio sin las opciones (si hay opciones)
  const cleanedMessage = useMemo(() => {
    if (sectionOptions.length === 0 && actionOptions.length === 0 && inputFields.length === 0) {
      return message.message;
    }
    return cleanTextFromOptions(message.message, sectionOptions, actionOptions, inputFields);
  }, [message.message, sectionOptions, actionOptions, inputFields]);

  // Detectar si es una historia generada
  const isGeneratedStory = !message.isUser && detectUserStory(message.message);
  
  // Detectar si es un sprint generado
  const isGeneratedSprint = !message.isUser && detectSprint(message.message);

  // Detectar historias mencionadas para selección (cuando la IA pregunta a cuál asociar)
  const storiesInMessage = useMemo(() => {
    if (message.isUser) return [];
    return detectStoriesInMessage(message.message);
  }, [message.message, message.isUser]);

  // Detectar si el mensaje pide seleccionar una historia
  const showStorySelection = useMemo(() => {
    if (message.isUser) return false;
    return storiesInMessage.length > 0 && isAskingForStorySelection(message.message);
  }, [message.isUser, storiesInMessage, message.message]);

  // Handler para cuando se selecciona una historia
  const handleStorySelect = (story) => {
    if (story.id) {
      onSendMessage?.(`Asociar a la historia "${story.titulo}" (ID: ${story.id})`);
    } else {
      // Si no hay ID, solo enviar el título
      onSendMessage?.(`Asociar a la historia "${story.titulo}"`);
    }
  };

  // Handler para crear sin historia (independiente)
  const handleCreateIndependent = () => {
    onSendMessage?.('Crear de manera independiente (sin asociar a una historia)');
  };

  // Función para guardar historia
  const handleSaveStory = async () => {
    try {
      setIsSaving(true);
      
      const selectedProduct = JSON.parse(localStorage.getItem('scrum_ai_selected_product') || 'null');
      const storyData = extractStoryData(message.message, selectedProduct);
      
      if (!storyData.titulo || !storyData.producto) {
        onSendMessage?.('No pude extraer todos los datos necesarios. Por favor, proporciona más detalles.');
        setIsSaving(false);
        return;
      }
      
      const token = await window.Clerk?.session?.getToken();
      // VITE_API_URL ya incluye /api (ej: http://localhost:5000/api)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/backlog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(storyData)
      });
      
      if (response.ok) {
        onSendMessage?.('✅ ¡Historia guardada exitosamente en el backlog!');
        setShowConfirmation(true); // Marcar como confirmado
      } else {
        const error = await response.json();
        onSendMessage?.(`❌ Error al guardar: ${error.message || 'Error desconocido'}`);
      }
    } catch (error) {
      onSendMessage?.('❌ Error al guardar la historia. Por favor, intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Función para guardar sprint
  const handleSaveSprint = async () => {
    try {
      setIsSaving(true);
      
      const selectedProduct = JSON.parse(localStorage.getItem('scrum_ai_selected_product') || 'null');
      const sprintData = extractSprintData(message.message, selectedProduct);
      
      if (!sprintData.nombre || !sprintData.objetivo || !sprintData.producto) {
        onSendMessage?.('No pude extraer todos los datos necesarios del sprint. Por favor, proporciona: nombre, objetivo y asegúrate de tener un producto seleccionado.');
        setIsSaving(false);
        return;
      }
      
      const token = await window.Clerk?.session?.getToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/sprints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sprintData)
      });
      
      if (response.ok) {
        const result = await response.json();
        onSendMessage?.(`✅ ¡Sprint "${sprintData.nombre}" creado exitosamente!`);
        setShowConfirmation(true);
      } else {
        const error = await response.json();
        console.error('❌ Error del servidor:', error);
        onSendMessage?.(`❌ Error al crear sprint: ${error.error || error.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error guardando sprint:', error);
      onSendMessage?.('❌ Error al crear el sprint. Por favor, intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Detectar si es un elemento técnico (tarea, bug, mejora)
  const technicalItemType = !message.isUser ? detectTechnicalItem(message.message) : null;
  const isGeneratedTechnicalItem = !!technicalItemType;

  // Detectar si son MÚLTIPLES elementos técnicos
  const multipleTechnicalItems = useMemo(() => {
    if (message.isUser) return { isMultiple: false };
    return detectMultipleTechnicalItems(message.message);
  }, [message.message, message.isUser]);
  
  const isGeneratedMultipleTechnicalItems = multipleTechnicalItems.isMultiple;

  // Extraer datos de múltiples tareas si aplica
  const extractedMultipleItems = useMemo(() => {
    if (!isGeneratedMultipleTechnicalItems) return [];
    const storedProduct = JSON.parse(localStorage.getItem('scrum_ai_selected_product') || 'null');
    const storedSprint = JSON.parse(localStorage.getItem('scrum_ai_selected_sprint') || 'null');
    return extractMultipleTechnicalItems(
      message.message, 
      selectedProduct || storedProduct, 
      selectedSprint || storedSprint
    );
  }, [message.message, isGeneratedMultipleTechnicalItems, selectedProduct, selectedSprint]);

  // Función para guardar MÚLTIPLES elementos técnicos en batch
  const handleSaveMultipleTechnicalItems = async () => {
    try {
      setIsSaving(true);
      
      const storedProduct = JSON.parse(localStorage.getItem('scrum_ai_selected_product') || 'null');
      const storedSprint = JSON.parse(localStorage.getItem('scrum_ai_selected_sprint') || 'null');
      
      const items = extractMultipleTechnicalItems(
        message.message,
        selectedProduct || storedProduct,
        selectedSprint || storedSprint
      );
      
      if (items.length === 0) {
        onSendMessage?.('❌ No pude extraer las tareas del mensaje. Verifica el formato.');
        setIsSaving(false);
        return;
      }
      
      // Validar que todas tengan producto
      const sinProducto = items.filter(item => !item.producto);
      if (sinProducto.length > 0) {
        onSendMessage?.('❌ No hay producto seleccionado. Por favor, selecciona un producto primero.');
        setIsSaving(false);
        return;
      }
      
      const token = await window.Clerk?.session?.getToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/backlog/technical/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });
      
      if (response.ok) {
        const result = await response.json();
        const sprintInfo = items[0]?.sprint ? ' y asociadas al sprint' : '';
        
        if (result.failed_count > 0) {
          onSendMessage?.(`⚠️ ${result.created_count} tareas creadas exitosamente${sprintInfo}. ${result.failed_count} fallaron.`);
        } else {
          onSendMessage?.(`✅ ¡${result.created_count} tareas creadas exitosamente${sprintInfo}!`);
        }
        setShowConfirmation(true);
      } else {
        const error = await response.json();
        console.error('❌ Error del servidor:', error);
        if (error.message?.includes('Scrum Master') || error.message?.includes('permisos')) {
          onSendMessage?.('❌ No tienes permisos para crear tareas. Se requiere rol de Scrum Master o superior.');
        } else {
          onSendMessage?.(`❌ Error al crear tareas: ${error.message || 'Error desconocido'}`);
        }
      }
    } catch (error) {
      console.error('Error guardando múltiples tareas:', error);
      onSendMessage?.('❌ Error al guardar las tareas. Por favor, intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Función para guardar elemento técnico (tarea, bug, mejora)
  const handleSaveTechnicalItem = async () => {
    try {
      setIsSaving(true);
      
      // Intentar obtener producto de múltiples fuentes
      const storedProductRaw = localStorage.getItem('scrum_ai_selected_product');
      const storedSprintRaw = localStorage.getItem('scrum_ai_selected_sprint');
      
      let storedProduct = null;
      let storedSprint = null;
      
      try {
        storedProduct = storedProductRaw ? JSON.parse(storedProductRaw) : null;
        storedSprint = storedSprintRaw ? JSON.parse(storedSprintRaw) : null;
      } catch (e) {
        console.error('Error parsing localStorage:', e);
      }
      
      // Obtener el producto correcto (puede venir como objeto o necesitar extraerse)
      const effectiveProduct = selectedProduct || storedProduct;
      const effectiveSprint = selectedSprint || storedSprint;
      
      // Si aún no tenemos producto pero tenemos sprint, intentar obtenerlo del sprint
      let finalProduct = effectiveProduct;
      if (!finalProduct && effectiveSprint?.producto) {
        finalProduct = effectiveSprint.producto;
      }
      
      const itemData = extractTechnicalItemData(
        message.message, 
        technicalItemType, 
        finalProduct, 
        effectiveSprint
      );
      
      const tipoLabels = { 'tarea': 'Tarea', 'bug': 'Bug', 'mejora': 'Mejora' };
      
      // Verificar datos obligatorios
      if (!itemData.titulo) {
        onSendMessage?.(`No pude extraer el título de la tarea. Por favor, verifica el formato.`);
        setIsSaving(false);
        return;
      }
      
      if (!itemData.descripcion) {
        onSendMessage?.(`No pude extraer la descripción de la tarea. Por favor, verifica el formato.`);
        setIsSaving(false);
        return;
      }
      
      if (!itemData.producto) {
        onSendMessage?.(`No hay producto seleccionado. Por favor, selecciona un producto primero.`);
        setIsSaving(false);
        return;
      }
      
      const token = await window.Clerk?.session?.getToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Usar endpoint técnico para tareas, bugs y mejoras
      const response = await fetch(`${apiUrl}/backlog/technical`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });
      
      if (response.ok) {
        const result = await response.json();
        const sprintInfo = itemData.sprint ? ' y asociada al sprint' : '';
        onSendMessage?.(`✅ ¡${tipoLabels[technicalItemType]} "${itemData.titulo}" creada exitosamente${sprintInfo}!`);
        setShowConfirmation(true);
      } else {
        const error = await response.json();
        console.error('❌ Error del servidor:', error);
        // Mostrar mensaje de error más descriptivo
        if (error.message?.includes('Scrum Master') || error.message?.includes('permisos')) {
          onSendMessage?.(`❌ No tienes permisos para crear ${tipoLabels[technicalItemType].toLowerCase()}s. Se requiere rol de Scrum Master o superior.`);
        } else {
          onSendMessage?.(`❌ Error al crear ${tipoLabels[technicalItemType].toLowerCase()}: ${error.message || 'Error desconocido'}`);
        }
      }
    } catch (error) {
      console.error('Error guardando elemento técnico:', error);
      onSendMessage?.(`❌ Error al guardar. Por favor, intenta nuevamente.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSave = () => {
    setShowConfirmation(false);
    onSendMessage?.('De acuerdo, ¿qué modificaciones quieres hacer?');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptionClick = (msg) => {
    if (onSendMessage) {
      onSendMessage(msg);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  if (message.isUser) {
    // Mensaje del usuario - alineado a la derecha
    return (
      <div className="flex justify-end gap-3">
        <div className="max-w-[75%] md:max-w-[65%]">
          <div className="flex items-center justify-end gap-2 mb-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tú
            </span>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl rounded-tr-md px-5 py-3 shadow-md shadow-indigo-500/20">
            <p className="whitespace-pre-wrap leading-relaxed">{message.message}</p>
          </div>
        </div>

        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    );
  }

  // Mensaje de SCRUM AI - alineado a la izquierda
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20">
        <Sparkles className="w-5 h-5 text-white" />
      </div>

      <div className="max-w-[75%] md:max-w-[70%] flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            SCRUM AI
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div
          className={`
            rounded-2xl rounded-tl-md px-5 py-4 shadow-sm
            ${message.status === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : 'bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50'
            }
          `}
        >
          <div className={`prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-headings:mt-4 prose-headings:mb-2 
            ${message.status === 'error' 
              ? 'text-red-700 dark:text-red-300' 
              : 'text-gray-800 dark:text-gray-100 [&_strong]:text-gray-900 dark:[&_strong]:text-white [&_a]:text-indigo-600 dark:[&_a]:text-indigo-400 [&_code]:text-pink-600 dark:[&_code]:text-pink-400 [&_code]:bg-gray-100 dark:[&_code]:bg-gray-700 [&_li]:text-gray-700 dark:[&_li]:text-gray-200 [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_blockquote]:text-gray-600 dark:[&_blockquote]:text-gray-300 [&_blockquote]:border-gray-300 dark:[&_blockquote]:border-gray-600'
            }`}>
            <ReactMarkdown>{(sectionOptions.length > 0 || actionOptions.length > 0 || inputFields.length > 0) ? cleanedMessage : message.message}</ReactMarkdown>
          </div>

          {/* Section Options - Botones de sección (1-4) */}
          {sectionOptions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {sectionOptions.map((option) => (
                <SectionMenuOption
                  key={option.number}
                  number={option.number}
                  title={option.title}
                  onClick={() => handleOptionClick(option.message)}
                />
              ))}
            </div>
          )}

          {/* Action Options - Botones de acción (Agregar, Modificar, Eliminar) */}
          {actionOptions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actionOptions.map((action, idx) => (
                <ActionMenuOption
                  key={idx}
                  type={action.type}
                  context={action.context}
                  onClick={handleOptionClick}
                />
              ))}
            </div>
          )}

          {/* Input Fields Form - Formulario interactivo */}
          {inputFields.length > 0 && (
            <InputFieldsForm
              fields={inputFields}
              context={formContext}
              onSubmit={handleOptionClick}
            />
          )}

          {/* Story Selection Buttons - Cuando la IA pide seleccionar historia */}
          {showStorySelection && (
            <StorySelectionButtons
              stories={storiesInMessage}
              onSelect={handleStorySelect}
              onIndependent={handleCreateIndependent}
            />
          )}

          {/* Needs More Context Indicator */}
          {message.needs_more_context && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span className="text-base">💡</span>
                Necesito más información para ayudarte mejor
              </p>
            </div>
          )}
        </div>

        {/* Confirmation Buttons for User Stories - Solo si NO es un item técnico */}
        {isGeneratedStory && !isGeneratedTechnicalItem && !showConfirmation && !isSaving && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              💡 ¿Quieres que guarde esta historia en el backlog?
            </p>
            <ConfirmationButtons
              onConfirm={() => {
                setShowConfirmation(true);
                handleSaveStory();
              }}
              onCancel={handleCancelSave}
              confirmText="✅ Sí, guardar historia"
              cancelText="✏️ No, modificar"
            />
          </div>
        )}

        {/* Confirmation Buttons for Sprints */}
        {isGeneratedSprint && !isGeneratedStory && !isGeneratedTechnicalItem && !showConfirmation && !isSaving && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              🏃 ¿Quieres crear este sprint?
            </p>
            <ConfirmationButtons
              onConfirm={() => {
                setShowConfirmation(true);
                handleSaveSprint();
              }}
              onCancel={handleCancelSave}
              confirmText="✅ Sí, crear sprint"
              cancelText="✏️ No, modificar"
            />
          </div>
        )}

        {/* Confirmation Buttons for MULTIPLE Technical Items (Tareas en batch) */}
        {isGeneratedMultipleTechnicalItems && !isGeneratedStory && !isGeneratedSprint && !showConfirmation && !isSaving && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔧 Se detectaron {extractedMultipleItems.length} tareas para crear:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                {extractedMultipleItems.slice(0, 5).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <span className="truncate">{item.titulo}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      item.prioridad === 'alta' || item.prioridad === 'muy_alta' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : item.prioridad === 'media'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    }`}>
                      {item.prioridad}
                    </span>
                  </li>
                ))}
                {extractedMultipleItems.length > 5 && (
                  <li className="text-gray-500">... y {extractedMultipleItems.length - 5} más</li>
                )}
              </ul>
              {selectedSprint && (
                <p className="mt-2 text-xs text-blue-500 dark:text-blue-400">
                  📎 Se asociarán al sprint: {selectedSprint.nombre}
                </p>
              )}
            </div>
            <ConfirmationButtons
              onConfirm={() => {
                setShowConfirmation(true);
                handleSaveMultipleTechnicalItems();
              }}
              onCancel={handleCancelSave}
              confirmText={`✅ Crear ${extractedMultipleItems.length} tareas`}
              cancelText="✏️ No, modificar"
            />
          </div>
        )}

        {/* Confirmation Buttons for Technical Items (Tarea, Bug, Mejora) */}
        {isGeneratedTechnicalItem && !isGeneratedMultipleTechnicalItems && !isGeneratedStory && !isGeneratedSprint && !showConfirmation && !isSaving && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {technicalItemType === 'tarea' && '🔧 ¿Quieres crear esta tarea técnica?'}
              {technicalItemType === 'bug' && '🐛 ¿Quieres reportar este bug?'}
              {technicalItemType === 'mejora' && '✨ ¿Quieres crear esta mejora?'}
              {selectedSprint && (
                <span className="ml-1 text-xs text-blue-500">
                  (se asociará a {selectedSprint.nombre})
                </span>
              )}
            </p>
            <ConfirmationButtons
              onConfirm={() => {
                setShowConfirmation(true);
                handleSaveTechnicalItem();
              }}
              onCancel={handleCancelSave}
              confirmText={
                technicalItemType === 'tarea' ? '✅ Sí, crear tarea' :
                technicalItemType === 'bug' ? '✅ Sí, reportar bug' :
                '✅ Sí, crear mejora'
              }
              cancelText="✏️ No, modificar"
            />
          </div>
        )}

        {/* Saving Indicator */}
        {isSaving && (
          <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span>Guardando...</span>
          </div>
        )}

        {/* Architecture Success Indicator */}
        {message.architectureResult?.saved && (
          <div className="mt-3 pt-3 border-t border-green-100 dark:border-green-800">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Arquitectura guardada exitosamente</span>
            </div>
          </div>
        )}

        {/* Actions */}
        {message.status !== 'error' && (
          <div className="flex items-center gap-1 mt-2 ml-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Copiar respuesta"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            {/* Ver Canvas Button */}
            {message.hasCanvas && onOpenCanvas && (
              <button
                onClick={() => onOpenCanvas(message)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                title="Ver datos en el canvas"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Ver Canvas</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
