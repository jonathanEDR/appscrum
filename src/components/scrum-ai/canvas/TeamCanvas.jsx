/**
 * TeamCanvas - Canvas para mostrar miembros del equipo
 */

import { useState } from 'react';
import { 
  Users, 
  Search,
  Filter,
  Shield,
  Crown,
  Code,
  TestTube,
  Palette,
  BarChart3,
  Star,
  Zap
} from 'lucide-react';

const ROLE_CONFIG = {
  scrum_master: {
    icon: Shield,
    color: 'text-purple-500',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    label: 'Scrum Master',
    gradient: 'from-purple-500 to-indigo-500'
  },
  product_owner: {
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'Product Owner',
    gradient: 'from-amber-500 to-orange-500'
  },
  developers: {
    icon: Code,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Developer',
    gradient: 'from-blue-500 to-cyan-500'
  },
  tester: {
    icon: TestTube,
    color: 'text-green-500',
    bg: 'bg-green-100 dark:bg-green-900/30',
    label: 'QA Tester',
    gradient: 'from-green-500 to-emerald-500'
  },
  designer: {
    icon: Palette,
    color: 'text-pink-500',
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    label: 'Designer',
    gradient: 'from-pink-500 to-rose-500'
  },
  analyst: {
    icon: BarChart3,
    color: 'text-teal-500',
    bg: 'bg-teal-100 dark:bg-teal-900/30',
    label: 'Analyst',
    gradient: 'from-teal-500 to-cyan-500'
  },
  super_admin: {
    icon: Star,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/30',
    label: 'Super Admin',
    gradient: 'from-red-500 to-pink-500'
  }
};

const STATUS_CONFIG = {
  active: { color: 'bg-green-500', label: 'Activo' },
  inactive: { color: 'bg-gray-400', label: 'Inactivo' },
  on_leave: { color: 'bg-amber-500', label: 'De licencia' },
  busy: { color: 'bg-red-500', label: 'Ocupado' }
};

const SKILL_LEVELS = {
  beginner: { label: 'Principiante', width: '25%' },
  intermediate: { label: 'Intermedio', width: '50%' },
  advanced: { label: 'Avanzado', width: '75%' },
  expert: { label: 'Experto', width: '100%' }
};

export const TeamCanvas = ({ data = [], metadata, isExpanded, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredMembers = data.filter(member => {
    const name = member.nombre || member.user?.nombre || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.rol === filterRole || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleMemberClick = (member) => {
    if (onItemClick) {
      onItemClick({
        ...member,
        type: 'team'
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sin miembros
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No hay miembros registrados en el equipo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-3 border-b border-gray-200/60 dark:border-gray-800/60 space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar miembros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="all">Todos los roles</option>
            <option value="scrum_master">Scrum Master</option>
            <option value="product_owner">Product Owner</option>
            <option value="developers">Developers</option>
            <option value="tester">Testers</option>
            <option value="designer">Designers</option>
          </select>
        </div>

        {/* Role Stats */}
        {metadata?.por_rol && (
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            {metadata.por_rol.scrum_master > 0 && (
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-purple-500" />
                {metadata.por_rol.scrum_master} SM
              </span>
            )}
            {metadata.por_rol.product_owner > 0 && (
              <span className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-500" />
                {metadata.por_rol.product_owner} PO
              </span>
            )}
            {metadata.por_rol.developers > 0 && (
              <span className="flex items-center gap-1">
                <Code className="w-3 h-3 text-blue-500" />
                {metadata.por_rol.developers} Devs
              </span>
            )}
          </div>
        )}
      </div>

      {/* Team Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className={`grid gap-3 ${isExpanded ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {filteredMembers.map((member) => {
            const rol = member.rol || member.role || 'developers';
            const roleConfig = ROLE_CONFIG[rol] || ROLE_CONFIG.developers;
            const status = member.estado || member.status || 'active';
            const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.active;
            const RoleIcon = roleConfig.icon;
            const disponibilidad = member.disponibilidad ?? member.availability ?? 100;

            return (
              <div
                key={member._id}
                onClick={() => handleMemberClick(member)}
                className={`
                  p-3 rounded-xl border transition-all cursor-pointer
                  bg-gray-50 dark:bg-gray-900/50 border-gray-200/60 dark:border-gray-800/60 
                  hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    {member.avatar ? (
                      <img 
                        src={member.avatar} 
                        alt={member.nombre}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                        {getInitials(member.nombre || member.user?.nombre)}
                      </div>
                    )}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${statusConfig.color} rounded-full border-2 border-white dark:border-gray-900`}></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {member.nombre || member.user?.nombre || 'Usuario'}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded ${roleConfig.bg} ${roleConfig.color}`}>
                        <RoleIcon className="w-3 h-3" />
                        {roleConfig.label}
                      </span>
                    </div>

                    {/* Availability bar */}
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-gray-400" />
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            disponibilidad >= 80 ? 'bg-green-500' : 
                            disponibilidad >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${disponibilidad}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-gray-500 w-8">{disponibilidad}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMembers.length === 0 && data.length > 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No se encontraron miembros con los filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  );
};
