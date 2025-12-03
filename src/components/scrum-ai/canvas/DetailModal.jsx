/**
 * DetailModal - Modal para mostrar detalles de items del Canvas
 * Reutilizable para productos, sprints, backlog, tareas, equipo
 */

import { useEffect } from 'react';
import { 
  X, 
  ExternalLink,
  Calendar,
  User,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Tag,
  FileText,
  Zap
} from 'lucide-react';

// Configuración de estados
const STATUS_LABELS = {
  // Sprints
  planificado: { label: 'Planificado', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  activo: { label: 'Activo', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  completado: { label: 'Completado', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  // Productos
  inactivo: { label: 'Inactivo', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  // Tareas
  todo: { label: 'Por hacer', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  in_progress: { label: 'En progreso', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  code_review: { label: 'Code Review', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  testing: { label: 'Testing', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  done: { label: 'Completado', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  // Backlog
  pendiente: { label: 'Pendiente', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  en_progreso: { label: 'En Progreso', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  en_revision: { label: 'En Revisión', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  en_pruebas: { label: 'En Pruebas', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }
};

const PRIORITY_LABELS = {
  critical: { label: 'Crítica', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  muy_alta: { label: 'Muy Alta', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  alta: { label: 'Alta', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  medium: { label: 'Media', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  media: { label: 'Media', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  low: { label: 'Baja', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  baja: { label: 'Baja', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
};

export const DetailModal = ({ isOpen, onClose, item, type }) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const config = STATUS_LABELS[status] || STATUS_LABELS.pendiente;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = PRIORITY_LABELS[priority] || PRIORITY_LABELS.medium;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Renderizar contenido según el tipo
  const renderContent = () => {
    switch (type) {
      case 'sprints':
        return <SprintDetail item={item} formatDate={formatDate} getStatusBadge={getStatusBadge} />;
      case 'products':
        return <ProductDetail item={item} formatDate={formatDate} getStatusBadge={getStatusBadge} />;
      case 'backlog':
        return <BacklogDetail item={item} formatDate={formatDate} getStatusBadge={getStatusBadge} getPriorityBadge={getPriorityBadge} />;
      case 'tasks':
        return <TaskDetail item={item} formatDate={formatDate} getStatusBadge={getStatusBadge} getPriorityBadge={getPriorityBadge} />;
      case 'team':
        return <TeamMemberDetail item={item} />;
      case 'architecture':
        return <ArchitectureDetail item={item} formatDate={formatDate} />;
      default:
        return <GenericDetail item={item} type={type} />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'sprints': return item.nombre || 'Sprint';
      case 'products': return item.nombre || 'Producto';
      case 'backlog': return item.titulo || 'Historia';
      case 'tasks': return item.titulo || item.title || 'Tarea';
      case 'team': return item.nombre || 'Miembro';
      case 'architecture': 
        return item.data?.name || item.name || 'Detalle de Arquitectura';
      default: return 'Detalle';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getTitle()}
              </h2>
              <p className="text-xs text-gray-500 capitalize">{type}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Componentes de detalle específicos
// ═══════════════════════════════════════════════════════════════════════════

const SprintDetail = ({ item, formatDate, getStatusBadge }) => {
  const progreso = item.progreso || 0;
  
  return (
    <div className="space-y-6">
      {/* Estado y fechas */}
      <div className="flex items-center gap-3 flex-wrap">
        {getStatusBadge(item.estado)}
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(item.fecha_inicio)} - {formatDate(item.fecha_fin)}
        </span>
      </div>

      {/* Objetivo */}
      {item.objetivo && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Objetivo del Sprint</span>
          </div>
          <p className="text-sm text-indigo-900 dark:text-indigo-100">{item.objetivo}</p>
        </div>
      )}

      {/* Progreso */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progreso</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{progreso}%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              progreso >= 80 ? 'bg-green-500' : 
              progreso >= 50 ? 'bg-blue-500' : 
              progreso >= 25 ? 'bg-amber-500' : 'bg-gray-400'
            }`}
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-500">Velocidad Planificada</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {item.velocidad_planificada || 0}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500">Velocidad Real</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {item.velocidad_real || 0}
          </p>
        </div>
      </div>

      {/* Producto asociado */}
      {item.producto && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Tag className="w-4 h-4" />
          <span>Producto: <strong>{item.producto}</strong></span>
        </div>
      )}
    </div>
  );
};

const ProductDetail = ({ item, formatDate, getStatusBadge }) => {
  return (
    <div className="space-y-6">
      {/* Estado */}
      <div className="flex items-center gap-3">
        {getStatusBadge(item.estado || 'activo')}
      </div>

      {/* Descripción */}
      {item.descripcion && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {item.descripcion}
          </p>
        </div>
      )}

      {/* Responsable */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
          {(item.responsable_nombre || 'U')[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {item.responsable_nombre || 'Sin asignar'}
          </p>
          {item.responsable_email && (
            <p className="text-xs text-gray-500">{item.responsable_email}</p>
          )}
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-gray-500">Fecha inicio</span>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(item.fecha_inicio)}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Fecha fin</span>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(item.fecha_fin)}</p>
        </div>
      </div>
    </div>
  );
};

const BacklogDetail = ({ item, formatDate, getStatusBadge, getPriorityBadge }) => {
  return (
    <div className="space-y-6">
      {/* Estado y prioridad */}
      <div className="flex items-center gap-3 flex-wrap">
        {getStatusBadge(item.status || item.estado)}
        {getPriorityBadge(item.priority || item.prioridad)}
        {(item.story_points || item.puntos_historia) && (
          <span className="px-2 py-1 text-xs font-medium rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            {item.story_points || item.puntos_historia} puntos
          </span>
        )}
      </div>

      {/* Descripción */}
      {item.descripcion && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
            {item.descripcion}
          </p>
        </div>
      )}

      {/* Criterios de aceptación */}
      {item.acceptance_criteria && item.acceptance_criteria.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Criterios de Aceptación
          </h4>
          <ul className="space-y-2">
            {item.acceptance_criteria.map((criterio, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  criterio.completado ? 'text-green-500' : 'text-gray-400'
                }`} />
                <span className={`text-sm ${
                  criterio.completado ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {criterio.descripcion}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const TaskDetail = ({ item, formatDate, getStatusBadge, getPriorityBadge }) => {
  return (
    <div className="space-y-6">
      {/* Estado y prioridad */}
      <div className="flex items-center gap-3 flex-wrap">
        {getStatusBadge(item.estado || item.status)}
        {getPriorityBadge(item.prioridad || item.priority)}
        {item.puntos && (
          <span className="px-2 py-1 text-xs font-medium rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            {item.puntos} puntos
          </span>
        )}
      </div>

      {/* Descripción */}
      {item.descripcion && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
            {item.descripcion}
          </p>
        </div>
      )}

      {/* Asignado y Sprint */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Asignado a</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {item.asignado || 'Sin asignar'}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Sprint</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {item.sprint || 'Sin sprint'}
          </p>
        </div>
      </div>

      {/* Tipo */}
      {item.tipo && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Tag className="w-4 h-4" />
          <span>Tipo: <strong className="capitalize">{item.tipo}</strong></span>
        </div>
      )}
    </div>
  );
};

const TeamMemberDetail = ({ item }) => {
  const ROLE_LABELS = {
    scrum_master: 'Scrum Master',
    product_owner: 'Product Owner',
    developers: 'Developer',
    tester: 'QA Tester',
    designer: 'Designer',
    analyst: 'Analyst',
    super_admin: 'Super Admin'
  };

  return (
    <div className="space-y-6">
      {/* Header con avatar */}
      <div className="flex items-center gap-4">
        {item.avatar ? (
          <img src={item.avatar} alt={item.nombre} className="w-16 h-16 rounded-2xl object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            {(item.nombre || 'U')[0].toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.nombre}</h3>
          <p className="text-sm text-gray-500">{item.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            {ROLE_LABELS[item.rol] || item.rol}
          </span>
        </div>
      </div>

      {/* Disponibilidad */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Disponibilidad
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{item.disponibilidad || 100}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              (item.disponibilidad || 100) >= 80 ? 'bg-green-500' : 
              (item.disponibilidad || 100) >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${item.disponibilidad || 100}%` }}
          />
        </div>
      </div>

      {/* Skills */}
      {item.skills && item.skills.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {item.skills.map((skill, idx) => (
              <span 
                key={idx}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg"
              >
                {skill.name}
                {skill.level && (
                  <span className="ml-1 text-xs text-gray-500">({skill.level})</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Carga de trabajo */}
      {item.carga_trabajo && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <span className="text-xs text-blue-600 dark:text-blue-400">Story Points</span>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {item.carga_trabajo.currentStoryPoints || 0} / {item.carga_trabajo.maxStoryPoints || 40}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
            <span className="text-xs text-green-600 dark:text-green-400">Horas trabajadas</span>
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              {item.carga_trabajo.hoursWorked || 0} / {item.carga_trabajo.maxHours || 40}
            </p>
          </div>
        </div>
      )}

      {/* Sprint actual */}
      {item.sprint_actual && (
        <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
          <Clock className="w-4 h-4" />
          <span>Sprint actual: <strong>{item.sprint_actual}</strong></span>
        </div>
      )}

      {/* Equipo */}
      {item.team && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Users className="w-4 h-4" />
          <span>Equipo: <strong>{item.team}</strong></span>
        </div>
      )}
    </div>
  );
};

const GenericDetail = ({ item, type }) => {
  // Para items de arquitectura, mostrar de forma más inteligente
  const data = item.data || item;
  
  // Si es un módulo de arquitectura
  if (type === 'architecture' && item.type === 'module') {
    return <ModuleDetail module={data} />;
  }
  
  // Si es tech_stack
  if (type === 'architecture' && item.type === 'tech_stack') {
    return <TechStackDetail techStack={data} />;
  }
  
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => {
        if (key === '_id' || key === '__v') return null;
        
        // Arrays
        if (Array.isArray(value)) {
          if (value.length === 0) return null;
          return (
            <div key={key}>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {key.replace(/_/g, ' ')}
              </span>
              <div className="mt-1 flex flex-wrap gap-2">
                {value.slice(0, 10).map((v, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
                    {typeof v === 'object' ? (v.name || v.title || JSON.stringify(v).slice(0, 30)) : String(v)}
                  </span>
                ))}
                {value.length > 10 && (
                  <span className="text-xs text-gray-400">+{value.length - 10} más</span>
                )}
              </div>
            </div>
          );
        }
        
        // Objetos
        if (typeof value === 'object' && value !== null) {
          return (
            <div key={key} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {key.replace(/_/g, ' ')}
              </span>
              <div className="mt-2 space-y-1">
                {Object.entries(value).map(([k, v]) => (
                  v && k !== '_id' && (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 capitalize">{k.replace(/_/g, ' ')}:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{String(v)}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          );
        }
        
        // Valores simples
        return (
          <div key={key}>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {key.replace(/_/g, ' ')}
            </span>
            <p className="text-sm text-gray-900 dark:text-white mt-1">{String(value)}</p>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Componentes de detalle para Arquitectura
// ═══════════════════════════════════════════════════════════════════════════

const ModuleDetail = ({ module }) => {
  const statusColors = {
    planned: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    in_development: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    deprecated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };
  
  const complexityColors = {
    trivial: 'bg-gray-100 text-gray-600',
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    very_high: 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-4">
      {/* Header con estado */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColors[module.status] || statusColors.planned}`}>
          {module.status === 'planned' ? 'Planificado' : 
           module.status === 'in_development' ? 'En desarrollo' :
           module.status === 'completed' ? 'Completado' : module.status}
        </span>
        {module.type && (
          <span className="px-3 py-1 rounded-lg text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 capitalize">
            {module.type}
          </span>
        )}
        {module.estimated_complexity && (
          <span className={`px-3 py-1 rounded-lg text-sm ${complexityColors[module.estimated_complexity] || complexityColors.medium}`}>
            Complejidad: {module.estimated_complexity}
          </span>
        )}
      </div>

      {/* Descripción */}
      {module.description && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">{module.description}</p>
        </div>
      )}

      {/* Features/Technologies */}
      {(module.features?.length > 0 || module.technologies?.length > 0) && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Tecnologías / Features
          </h4>
          <div className="flex flex-wrap gap-2">
            {(module.features || module.technologies || []).map((item, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dependencias */}
      {module.dependencies?.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Dependencias
          </h4>
          <div className="flex flex-wrap gap-2">
            {module.dependencies.map((dep, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
                {dep}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notas */}
      {module.notes && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">📝 {module.notes}</p>
        </div>
      )}
    </div>
  );
};

const TechStackDetail = ({ techStack }) => {
  const { type, items, count } = techStack;
  
  const typeLabels = {
    frontend: { label: 'Frontend', icon: '🎨', color: 'from-blue-500 to-cyan-500' },
    backend: { label: 'Backend', icon: '⚙️', color: 'from-green-500 to-emerald-500' },
    database: { label: 'Base de Datos', icon: '🗄️', color: 'from-purple-500 to-indigo-500' },
    devops: { label: 'DevOps / Infraestructura', icon: '☁️', color: 'from-orange-500 to-red-500' }
  };
  
  const config = typeLabels[type] || { label: type, icon: '📦', color: 'from-gray-500 to-gray-600' };

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl bg-gradient-to-r ${config.color} text-white`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h3 className="font-bold text-lg">{config.label}</h3>
            <p className="text-white/80 text-sm">{count} tecnología{count !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Tecnologías incluidas
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArchitectureDetail = ({ item, formatDate }) => {
  const data = item.data || item;
  
  return (
    <div className="space-y-4">
      {/* Tipo de item */}
      {item.type && (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium capitalize">
            {item.type === 'module' ? '📦 Módulo' : 
             item.type === 'tech_stack' ? '🛠️ Stack Tecnológico' :
             item.type === 'security' ? '🔒 Seguridad' :
             item.type === 'decision' ? '📋 Decisión' :
             item.type}
          </span>
        </div>
      )}

      {/* Renderizar según el tipo específico de arquitectura */}
      {item.type === 'module' && <ModuleDetail module={data} />}
      {item.type === 'tech_stack' && <TechStackDetail techStack={data} />}
      
      {/* Para otros tipos, mostrar genérico mejorado */}
      {!['module', 'tech_stack'].includes(item.type) && (
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => {
            if (key === '_id' || !value) return null;
            
            if (Array.isArray(value) && value.length > 0) {
              return (
                <div key={key}>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {value.map((v, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
                        {typeof v === 'string' ? v : JSON.stringify(v)}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }
            
            if (typeof value === 'boolean') {
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {value ? '✓' : '✗'}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            }
            
            if (typeof value === 'string' || typeof value === 'number') {
              return (
                <div key={key}>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">{String(value)}</p>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      )}
    </div>
  );
};
