/**
 * AIAgents Component
 * Página principal para gestionar agentes AI
 */

import React, { useState, useEffect } from 'react';
import { Bot, Shield, MessageSquare, History, BarChart3, Sparkles } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useTheme } from '../../context/ThemeContext';
import { useAgents } from '../../hooks/useAgents';
import { useDelegations } from '../../hooks/useDelegations';
import { aiAgentsService } from '../../services/aiAgentsService';
import AgentsList from '../ai-agents/AgentsList';
import { AgentDetailsModal } from '../ai-agents/AgentDetailsModal';
import { DelegationForm } from '../ai-agents/DelegationForm';
import { DelegationsTable } from '../ai-agents/DelegationsTable';
import { CreateAgentModal } from '../ai-agents/CreateAgentModal';
import { OrchestratorChat } from '../ai-agents/OrchestratorChat';

const AIAgents = () => {
  const { theme } = useTheme();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('agents');
  
  // Hooks para datos
  const { agents, loading: loadingAgents, refetch: refetchAgents } = useAgents();
  const { 
    delegations, 
    loading: loadingDelegations, 
    createDelegation,
    suspendDelegation,
    reactivateDelegation,
    revokeDelegation,
    fetchDelegations
  } = useDelegations();

  // Estado para modales
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedDelegation, setSelectedDelegation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDelegationForm, setShowDelegationForm] = useState(false);
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);

  // Estado para datos del formulario
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [userSprints, setUserSprints] = useState([]);

  // Cargar permisos disponibles al montar
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const response = await aiAgentsService.getAvailablePermissions(getToken);
        setAvailablePermissions(response.permissions || []);
      } catch (error) {
        console.error('Error al cargar permisos:', error);
      }
    };
    loadPermissions();
  }, [getToken]);

  // TODO: Cargar productos y sprints del usuario
  // Por ahora usamos arrays vacíos, en la siguiente fase los cargaremos desde los servicios existentes
  useEffect(() => {
    // Simulación temporal - reemplazar con llamadas reales a servicios
    setUserProducts([]);
    setUserSprints([]);
  }, []);

  // Tabs de navegación
  const tabs = [
    { 
      id: 'agents', 
      label: 'Agentes Disponibles', 
      icon: Bot,
      count: agents.length
    },
    { 
      id: 'delegations', 
      label: 'Mis Delegaciones', 
      icon: Shield,
      count: delegations.length
    },
    { 
      id: 'chat', 
      label: 'Chat con AI', 
      icon: MessageSquare,
      badge: 'Nuevo'
    },
    { 
      id: 'history', 
      label: 'Historial', 
      icon: History
    },
    { 
      id: 'metrics', 
      label: 'Métricas', 
      icon: BarChart3
    }
  ];

  // Handlers para modales
  const handleViewDetails = (agent) => {
    setSelectedAgent(agent);
    setShowDetailsModal(true);
  };

  const handleDelegate = (agent) => {
    setSelectedAgent(agent);
    setShowDelegationForm(true);
  };

  const handleOpenDelegationFromDetails = (agent) => {
    setShowDetailsModal(false);
    setSelectedAgent(agent);
    setShowDelegationForm(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAgent(null);
  };

  const handleCloseDelegationForm = () => {
    setShowDelegationForm(false);
    // No reseteamos selectedAgent por si viene del modal de detalles
  };

  const handleSubmitDelegation = async (delegationData) => {
    try {
      await createDelegation(delegationData);
      setShowDelegationForm(false);
      setSelectedAgent(null);
      // Mostrar mensaje de éxito
      alert('Delegación creada exitosamente');
      // Cambiar a la pestaña de delegaciones
      setActiveTab('delegations');
    } catch (error) {
      console.error('Error al crear delegación:', error);
      throw error; // Re-lanzar para que el formulario lo maneje
    }
  };

  // Handlers para acciones de delegaciones
  const handleSuspendDelegation = async (delegationId) => {
    if (!window.confirm('¿Estás seguro de que quieres suspender esta delegación?')) {
      return;
    }
    try {
      await suspendDelegation(delegationId);
      alert('Delegación suspendida exitosamente');
    } catch (error) {
      console.error('Error al suspender delegación:', error);
      alert('Error al suspender la delegación');
    }
  };

  const handleReactivateDelegation = async (delegationId) => {
    try {
      await reactivateDelegation(delegationId);
      alert('Delegación reactivada exitosamente');
    } catch (error) {
      console.error('Error al reactivar delegación:', error);
      alert('Error al reactivar la delegación');
    }
  };

  const handleRevokeDelegation = async (delegationId) => {
    if (!window.confirm('¿Estás seguro de que quieres revocar esta delegación? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      await revokeDelegation(delegationId);
      alert('Delegación revocada exitosamente');
    } catch (error) {
      console.error('Error al revocar delegación:', error);
      alert('Error al revocar la delegación');
    }
  };

  const handleViewDelegationDetails = (delegation) => {
    setSelectedDelegation(delegation);
    // TODO: Abrir modal de detalles de delegación en fase 4
    console.log('Ver detalles de delegación:', delegation);
    alert(`Detalles de delegación - Por implementar en Fase 4`);
  };

  // Handler para crear nuevo agente
  const handleCreateAgent = async (agentData) => {
    try {
      await aiAgentsService.createAgent(agentData, getToken);
      alert('Agente creado exitosamente');
      setShowCreateAgentModal(false);
      // Recargar lista de agentes
      await refetchAgents();
    } catch (error) {
      console.error('Error al crear agente:', error);
      throw error; // Re-lanzar para que el modal lo maneje
    }
  };

  // Estado de bienvenida (si no hay delegaciones)
  const WelcomeState = () => (
    <div className={`rounded-2xl border-2 overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
        : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
    }`}>
      <div className="p-8 md:p-12 text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-gradient-to-br from-blue-500 to-cyan-500`}>
          <Sparkles className="text-white" size={40} />
        </div>
        
        <h2 className={`text-3xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          ¡Bienvenido a los Agentes AI!
        </h2>
        
        <p className={`text-lg mb-8 max-w-2xl mx-auto ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Los agentes AI pueden ayudarte a automatizar y mejorar tu trabajo en Scrum
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
          {[
            { 
              icon: '✨', 
              title: 'Crear Historias', 
              desc: 'Genera historias de usuario automáticamente'
            },
            { 
              icon: '📝', 
              title: 'Refinar Backlog', 
              desc: 'Mejora y estructura tu backlog'
            },
            { 
              icon: '✅', 
              title: 'Criterios de Aceptación', 
              desc: 'Genera criterios claros y completos'
            },
            { 
              icon: '📊', 
              title: 'Analizar y Priorizar', 
              desc: 'Obtén insights sobre tu trabajo'
            }
          ].map((feature, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className={`font-semibold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <div className={`rounded-xl p-6 mb-8 max-w-2xl mx-auto ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Para empezar necesitas:
          </h3>
          <div className="space-y-3 text-left">
            {[
              '1. Seleccionar un agente que te ayude',
              '2. Delegar los permisos necesarios',
              '3. ¡Empezar a trabajar con AI!'
            ].map((step, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                  {idx + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setActiveTab('agents')}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Ver Agentes Disponibles
        </button>
      </div>
    </div>
  );

  // Placeholder para tabs no implementados
  const ComingSoon = ({ title }) => (
    <div className={`text-center py-16 px-4 rounded-2xl border-2 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="text-6xl mb-4">🚧</div>
      <h3 className={`text-2xl font-semibold mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {title} - Próximamente
      </h3>
      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
        Esta funcionalidad estará disponible pronto
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            🤖 Agentes AI
          </h1>
          <p className={`mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Gestiona tus asistentes inteligentes
          </p>
        </div>
        
        {/* Stats rápidos */}
        {delegations.length > 0 && (
          <div className={`px-6 py-3 rounded-xl border-2 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              <div>
                <div className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {delegations.filter(d => d.status === 'active').length}
                </div>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Delegaciones activas
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs de navegación */}
      <div className={`border-b-2 ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${
                  isActive
                    ? theme === 'dark'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-blue-500 text-blue-600'
                    : theme === 'dark'
                      ? 'border-transparent text-gray-400 hover:text-gray-300'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Botón Crear Agente (solo Super Admin) */}
        {/* TODO: Agregar verificación de rol cuando esté disponible */}
        <button
          onClick={() => setShowCreateAgentModal(true)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
            bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500
            text-white hover:shadow-lg hover:scale-105
          `}
        >
          <Bot size={18} />
          <span>Crear Agente</span>
        </button>
      </div>

      {/* Contenido de los tabs */}
      <div className="pb-8">
        {/* Tab: Agentes Disponibles */}
        {activeTab === 'agents' && (
          <AgentsList
            agents={agents}
            loading={loadingAgents}
            onDelegate={handleDelegate}
            onViewDetails={handleViewDetails}
            onRefresh={refetchAgents}
            delegations={delegations}
          />
        )}

        {/* Tab: Mis Delegaciones */}
        {activeTab === 'delegations' && (
          <DelegationsTable
            delegations={delegations}
            loading={loadingDelegations}
            onSuspend={handleSuspendDelegation}
            onReactivate={handleReactivateDelegation}
            onRevoke={handleRevokeDelegation}
            onViewDetails={handleViewDelegationDetails}
          />
        )}

        {/* Tab: Chat */}
        {activeTab === 'chat' && (
          <div className={`
            rounded-2xl border overflow-hidden
            ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          `} style={{ height: 'calc(100vh - 280px)' }}>
            <OrchestratorChat />
          </div>
        )}

        {/* Tab: Historial */}
        {activeTab === 'history' && (
          <ComingSoon title="Historial de Acciones" />
        )}

        {/* Tab: Métricas */}
        {activeTab === 'metrics' && (
          <ComingSoon title="Métricas de Uso" />
        )}
      </div>

      {/* Modales */}
      <AgentDetailsModal
        agent={selectedAgent}
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        onDelegate={handleOpenDelegationFromDetails}
      />

      <DelegationForm
        agent={selectedAgent}
        isOpen={showDelegationForm}
        onClose={handleCloseDelegationForm}
        onSubmit={handleSubmitDelegation}
        availablePermissions={availablePermissions}
        userProducts={userProducts}
        userSprints={userSprints}
      />

      <CreateAgentModal
        isOpen={showCreateAgentModal}
        onClose={() => setShowCreateAgentModal(false)}
        onSubmit={handleCreateAgent}
      />
    </div>
  );
};

export default AIAgents;
