import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import apiService from '../../services/apiService';
import { useAuth } from '@clerk/clerk-react';

// Datos de ejemplo para impedimentos
const mockImpediments = [
  {
    id: 1,
    title: 'Dependencia con API externa',
    description: 'El servicio de pagos está experimentando problemas de conectividad que impiden completar las pruebas.',
    responsible: 'Carlos López',
    status: 'open',
    priority: 'high',
    createdDate: '2025-01-03',
    resolvedDate: null,
    category: 'external_dependency'
  },
  {
    id: 2,
    title: 'Conflicto en base de datos',
    description: 'Hay un conflicto en el esquema de la base de datos que está bloqueando el desarrollo del módulo de reportes.',
    responsible: 'Ana García',
    status: 'in_progress',
    priority: 'medium',
    createdDate: '2025-01-02',
    resolvedDate: null,
    category: 'technical'
  },
  {
    id: 3,
    title: 'Falta de claridad en requisitos',
    description: 'El Product Owner no ha definido claramente los criterios de aceptación para la historia US-105.',
    responsible: 'María Rodríguez',
    status: 'resolved',
    priority: 'medium',
    createdDate: '2024-12-28',
    resolvedDate: '2025-01-01',
    category: 'requirements'
  }
];

const ImpedimentCard = ({ impediment, onEdit, onDelete, onStatusChange }) => {
  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-red-100 text-red-800 border-red-200',
      in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      resolved: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusIcon = (status) => {
    const icons = {
      open: AlertTriangle,
      in_progress: Clock,
      resolved: CheckCircle
    };
    const Icon = icons[status] || AlertTriangle;
    return Icon;
  };

  const StatusIcon = getStatusIcon(impediment.status);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <StatusIcon className={`h-5 w-5 ${getPriorityColor(impediment.priority)}`} />
              <h3 className="text-lg font-semibold text-gray-900">{impediment.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(impediment.status)}`}>
                {impediment.status === 'open' && 'Abierto'}
                {impediment.status === 'in_progress' && 'En Progreso'}
                {impediment.status === 'resolved' && 'Resuelto'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 leading-relaxed">{impediment.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{impediment.responsible}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Creado: {new Date(impediment.createdDate).toLocaleDateString()}</span>
              </div>
              {impediment.resolvedDate && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Resuelto: {new Date(impediment.resolvedDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(impediment)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Edit className="h-4 w-4" />
              Editar
            </button>
            {impediment.status !== 'resolved' && (
              <button 
                onClick={() => onStatusChange(impediment.id, 'resolved')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Resolver
              </button>
            )}
          </div>
          <button 
            onClick={() => onDelete(impediment.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};


import ImpedimentModal from "./modalScrumMaster/modalImpediments";

const Impediments = () => {
  const [impediments, setImpediments] = useState(mockImpediments);
  const [filteredImpediments, setFilteredImpediments] = useState(mockImpediments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImpediment, setEditingImpediment] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data = await apiService.getTeamMembersWithFallback(getToken);
        const names = (data.members || data || []).map(member => {
          if (member.user && member.user.firstName && member.user.lastName) {
            return `${member.user.firstName} ${member.user.lastName}`;
          }
          if (member.firstName && member.lastName) {
            return `${member.firstName} ${member.lastName}`;
          }
          return member.user?.email || member.email || member.id || 'Usuario';
        });
        setTeamMembers(names);
      } catch (error) {
        setTeamMembers([
          'Ana García',
          'Carlos López',
          'María Rodríguez',
          'David Chen'
        ]);
      }
    };
    fetchTeamMembers();
  }, [getToken]);

  // Filtrar impedimentos
  useEffect(() => {
    let filtered = impediments;

    if (searchTerm) {
      filtered = filtered.filter(imp => 
        imp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imp.responsible.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(imp => imp.status === statusFilter);
    }

    setFilteredImpediments(filtered);
  }, [impediments, searchTerm, statusFilter]);

  const handleCreateImpediment = () => {
    setEditingImpediment(null);
    setIsModalOpen(true);
  };

  const handleEditImpediment = (impediment) => {
    setEditingImpediment(impediment);
    setIsModalOpen(true);
  };

  const handleDeleteImpediment = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este impedimento?')) {
      setImpediments(prev => prev.filter(imp => imp.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setImpediments(prev => prev.map(imp => 
      imp.id === id 
        ? { 
            ...imp, 
            status: newStatus, 
            resolvedDate: newStatus === 'resolved' ? new Date().toISOString().split('T')[0] : null 
          }
        : imp
    ));
  };

  const handleSaveImpediment = (formData) => {
    if (editingImpediment) {
      // Editar
      setImpediments(prev => prev.map(imp => 
        imp.id === editingImpediment.id 
          ? { ...imp, ...formData }
          : imp
      ));
    } else {
      // Crear
      const newImpediment = {
        ...formData,
        id: Date.now(),
        status: 'open',
        createdDate: new Date().toISOString().split('T')[0],
        resolvedDate: null
      };
      setImpediments(prev => [newImpediment, ...prev]);
    }
    setIsModalOpen(false);
    setEditingImpediment(null);
  };

  const handleExportReport = () => {
    // Aquí implementarías la lógica de exportación
    alert('Función de exportación en desarrollo');
  };

  const getStatusCounts = () => {
    return {
      total: impediments.length,
      open: impediments.filter(imp => imp.status === 'open').length,
      in_progress: impediments.filter(imp => imp.status === 'in_progress').length,
      resolved: impediments.filter(imp => imp.status === 'resolved').length
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Impedimentos</h1>
          <p className="text-gray-600">Registra y da seguimiento a los impedimentos del equipo</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <button
            onClick={handleCreateImpediment}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo Impedimento
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{counts.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{counts.open}</div>
          <div className="text-sm text-gray-600">Abiertos</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{counts.in_progress}</div>
          <div className="text-sm text-gray-600">En Progreso</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{counts.resolved}</div>
          <div className="text-sm text-gray-600">Resueltos</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar impedimentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Todos los estados</option>
              <option value="open">Abiertos</option>
              <option value="in_progress">En Progreso</option>
              <option value="resolved">Resueltos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Impediments List */}
      <div className="space-y-4">
        {filteredImpediments.length > 0 ? (
          filteredImpediments.map((impediment) => (
            <ImpedimentCard
              key={impediment.id}
              impediment={impediment}
              onEdit={handleEditImpediment}
              onDelete={handleDeleteImpediment}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay impedimentos</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron impedimentos con los filtros aplicados.'
                : 'No hay impedimentos registrados en este momento.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={handleCreateImpediment}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Crear primer impedimento
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <ImpedimentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingImpediment(null);
        }}
        impediment={editingImpediment}
        onSave={handleSaveImpediment}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default Impediments;
