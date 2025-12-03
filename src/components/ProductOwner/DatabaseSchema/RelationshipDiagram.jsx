/**
 * RelationshipDiagram Component
 * Diagrama interactivo de relaciones entre entidades usando @xyflow/react
 * 
 * @module components/ProductOwner/DatabaseSchema/RelationshipDiagram
 */

import React, { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from '../../../context/ThemeContext';
import { Database, Layers, GitBranch, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// ============================================
// NODO PERSONALIZADO PARA ENTIDAD
// ============================================

const EntityNode = ({ data, selected }) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className={`px-4 py-3 rounded-xl border-2 shadow-lg transition-all min-w-[180px] ${
        selected 
          ? 'border-indigo-500 ring-2 ring-indigo-300 dark:ring-indigo-700'
          : theme === 'dark' 
            ? 'border-gray-600 bg-gray-800' 
            : 'border-gray-300 bg-white'
      }`}
      style={{
        backgroundColor: selected 
          ? theme === 'dark' ? '#312e81' : '#eef2ff'
          : theme === 'dark' ? '#1f2937' : '#ffffff'
      }}
    >
      {/* Handle de entrada (arriba) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      {/* Contenido del nodo */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${
          theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100'
        }`}>
          <Database size={16} className="text-indigo-500" />
        </div>
        <span className={`font-bold text-sm ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {data.label}
        </span>
      </div>
      
      {/* Stats */}
      <div className="flex items-center gap-3 text-xs">
        <div className={`flex items-center gap-1 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Layers size={12} />
          <span>{data.fieldsCount || 0}</span>
        </div>
        <div className={`flex items-center gap-1 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <GitBranch size={12} />
          <span>{data.relationsCount || 0}</span>
        </div>
      </div>
      
      {/* Descripción corta */}
      {data.description && (
        <div className={`mt-2 text-xs truncate max-w-[160px] ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {data.description}
        </div>
      )}
      
      {/* Handle de salida (abajo) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-gray-800"
      />
    </div>
  );
};

// Tipos de nodos personalizados
const nodeTypes = {
  entity: EntityNode
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const RelationshipDiagram = ({ 
  relationshipMap = { nodes: [], edges: [] },
  onNodeClick,
  loading = false
}) => {
  const { theme } = useTheme();
  
  // Convertir datos del backend al formato de ReactFlow
  const initialNodes = useMemo(() => {
    if (!relationshipMap.nodes?.length) return [];
    
    // Calcular posiciones en grid
    const cols = Math.ceil(Math.sqrt(relationshipMap.nodes.length));
    const spacing = { x: 250, y: 180 };
    
    return relationshipMap.nodes.map((node, index) => ({
      id: node.id || node.label,
      type: 'entity',
      position: {
        x: (index % cols) * spacing.x + 50,
        y: Math.floor(index / cols) * spacing.y + 50
      },
      data: {
        label: node.label || node.id,
        fieldsCount: node.fields || 0,
        relationsCount: node.relations || relationshipMap.edges?.filter(
          e => e.source === (node.id || node.label) || e.target === (node.id || node.label)
        ).length || 0,
        description: node.description || ''
      }
    }));
  }, [relationshipMap]);

  const initialEdges = useMemo(() => {
    if (!relationshipMap.edges?.length) return [];
    
    // Colores según tipo de relación
    const edgeColors = {
      'one-to-one': '#10b981',   // Verde
      'one-to-many': '#3b82f6',  // Azul
      'many-to-many': '#8b5cf6'  // Púrpura
    };
    
    return relationshipMap.edges.map((edge, index) => ({
      id: `e${index}-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: edge.implicit || false,
      label: edge.label || getRelationLabel(edge.type),
      labelStyle: { 
        fill: theme === 'dark' ? '#9ca3af' : '#6b7280', 
        fontSize: 11,
        fontWeight: 500
      },
      labelBgStyle: { 
        fill: theme === 'dark' ? '#1f2937' : '#ffffff',
        fillOpacity: 0.9
      },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 4,
      style: { 
        stroke: edgeColors[edge.type] || '#6b7280',
        strokeWidth: 2
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edgeColors[edge.type] || '#6b7280',
        width: 20,
        height: 20
      }
    }));
  }, [relationshipMap, theme]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Actualizar cuando cambia el mapa
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Manejar click en nodo
  const handleNodeClick = useCallback((event, node) => {
    if (onNodeClick) {
      onNodeClick(node.data.label);
    }
  }, [onNodeClick]);

  // Obtener label de relación
  function getRelationLabel(type) {
    switch (type) {
      case 'one-to-one': return '1:1';
      case 'one-to-many': return '1:N';
      case 'many-to-many': return 'N:M';
      default: return '';
    }
  }

  // Estado vacío
  if (!loading && (!relationshipMap.nodes?.length)) {
    return (
      <div className={`flex flex-col items-center justify-center h-96 rounded-lg border-2 border-dashed ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-50'
      }`}>
        <GitBranch className={`h-16 w-16 mb-4 ${
          theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
        }`} />
        <h3 className={`text-lg font-medium mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Sin Relaciones
        </h3>
        <p className={`text-sm text-center max-w-md ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Importa entidades con relaciones (referencias a otros modelos) para visualizar el diagrama.
        </p>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Cargando diagrama...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[500px] rounded-lg overflow-hidden border ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        {/* Controles de zoom */}
        <Controls 
          className={`${theme === 'dark' ? '!bg-gray-800 !border-gray-700' : '!bg-white !border-gray-200'} !shadow-lg`}
          showInteractive={false}
        />
        
        {/* Minimapa */}
        <MiniMap 
          nodeColor={(node) => theme === 'dark' ? '#4f46e5' : '#818cf8'}
          maskColor={theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
          className={`${theme === 'dark' ? '!bg-gray-900' : '!bg-gray-100'} !border !rounded-lg`}
          style={{ 
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
          }}
        />
        
        {/* Fondo con grid */}
        <Background 
          color={theme === 'dark' ? '#374151' : '#d1d5db'}
          gap={20}
          size={1}
        />
      </ReactFlow>
      
      {/* Leyenda */}
      <div className={`absolute bottom-4 right-4 p-3 rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className={`text-xs font-medium mb-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Tipos de Relación
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>1:1 (One to One)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>1:N (One to Many)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-purple-500"></div>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>N:M (Many to Many)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipDiagram;
