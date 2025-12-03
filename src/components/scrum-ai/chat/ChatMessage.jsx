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

export const ChatMessage = ({ message, onOpenCanvas, onSendMessage }) => {
  const [copied, setCopied] = useState(false);

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
          <div className={`prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-headings:mt-4 prose-headings:mb-2 ${
            message.status === 'error' ? 'text-red-700 dark:text-red-300' : ''
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
