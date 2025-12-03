/**
 * useScrumAIChat - Hook principal para chat con SCRUM AI
 * Incluye soporte para Canvas
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { scrumAIService } from '../services/scrumAIService';

// Ya no usamos WELCOME_MESSAGE - Los QuickStartActions muestran el saludo

export const useScrumAIChat = () => {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [canvasData, setCanvasData] = useState(null); // Estado para el canvas
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado
  const [hasArchitecture, setHasArchitecture] = useState(false); // Si el producto tiene arquitectura
  const [showEditSections, setShowEditSections] = useState(false); // Mostrar secciones de edición
  const [activeEditSection, setActiveEditSection] = useState(null); // Sección activa de edición (structure, database, endpoints, modules)

  // Verificar si el producto tiene arquitectura
  const checkArchitecture = useCallback(async (productId) => {
    if (!productId) {
      setHasArchitecture(false);
      return;
    }
    
    try {
      const token = await getToken();
      const response = await scrumAIService.getCanvasData(token, 'architecture', { product_id: productId });
      
      if (response && response.data && response.data.length > 0) {
        setHasArchitecture(true);
      } else {
        setHasArchitecture(false);
      }
    } catch (error) {
      console.error('Error checking architecture:', error);
      setHasArchitecture(false);
    }
  }, [getToken]);

  // Cargar historial del localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('scrum_ai_chat_history');
    const savedConversation = localStorage.getItem('scrum_ai_active_conversation');
    const savedProduct = localStorage.getItem('scrum_ai_selected_product');
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (error) {
        console.error('Error al cargar historial:', error);
      }
    }
    
    if (savedConversation) {
      try {
        const parsed = JSON.parse(savedConversation);
        setActiveConversation(parsed);
      } catch (error) {
        console.error('Error al cargar conversación activa:', error);
      }
    }
    
    if (savedProduct) {
      try {
        const parsed = JSON.parse(savedProduct);
        setSelectedProduct(parsed);
        // Verificar arquitectura al cargar
        if (parsed._id) {
          checkArchitecture(parsed._id);
        }
      } catch (error) {
        console.error('Error al cargar producto seleccionado:', error);
      }
    }
  }, [checkArchitecture]);

  // Guardar historial en localStorage
  useEffect(() => {
    if (messages.length > 1) { // Más que solo el mensaje de bienvenida
      localStorage.setItem('scrum_ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Enviar mensaje
  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    // ════════════════════════════════════════════════════════════════════════
    // ✅ DETECTAR SECCIÓN DE EDICIÓN ACTIVA
    // ════════════════════════════════════════════════════════════════════════
    const editSectionPatterns = {
      structure: /editar\s+(la\s+)?estructura|estructura\s+del\s+proyecto|1️⃣.*estructura|carpetas|folders|^1$/i,
      database: /editar\s+(la\s+)?base\s+de\s+datos|2️⃣.*base\s+de\s+datos|tablas|schema|bd|^2$/i,
      endpoints: /editar\s+(los?\s+)?endpoints?|3️⃣.*api|rutas|api\s+endpoints|^3$/i,
      modules: /editar\s+(los?\s+)?m[oó]dulos?|4️⃣.*m[oó]dulos?|componentes|^4$/i
    };
    
    // Detectar si es mensaje de edición y activar la sección correspondiente
    let sectionDetected = false;
    for (const [section, pattern] of Object.entries(editSectionPatterns)) {
      if (pattern.test(messageText.trim())) {
        setActiveEditSection(section);
        sectionDetected = true;
        break;
      }
    }
    
    // Si no se detectó sección específica pero hay una activa, mantenerla
    // (esto permite que "Agregar" mantenga la sección actual)
    
    // ════════════════════════════════════════════════════════════════════════
    // ✅ VALIDACIÓN: Detectar si solicita crear arquitectura sin producto
    // ════════════════════════════════════════════════════════════════════════
    const isArchitectureRequest = /cre[aá]r?\s+(una?\s+)?(la\s+)?arquitec|defin[ie]r?\s+(la\s+)?arquitec|arquitec.*cre[aá]|nueva\s+arquitec/i.test(messageText);
    
    const savedProductFromStorage = localStorage.getItem('scrum_ai_selected_product');
    const productFromStorage = savedProductFromStorage ? JSON.parse(savedProductFromStorage) : null;
    const hasProduct = productFromStorage?._id || selectedProduct?._id;
    
    if (isArchitectureRequest && !hasProduct) {
      // Mostrar mensaje de advertencia sin enviar al backend
      const warningMessage = {
        id: `warning-${Date.now()}`,
        message: `⚠️ **Producto no seleccionado**

Para crear una arquitectura, primero necesitas seleccionar un producto. 

**¿Cómo hacerlo?**
1. Escribe "muéstrame los productos" para ver la lista
2. Haz clic en un producto para seleccionarlo
3. Luego podrás crear la arquitectura

También puedes seleccionar un producto desde el panel lateral.`,
        isUser: false,
        timestamp: new Date().toISOString(),
        status: 'sent',
        isWarning: true,
        specialty: 'system'
      };
      
      setMessages(prev => [...prev, warningMessage]);
      return; // No enviar al backend
    }
    // ════════════════════════════════════════════════════════════════════════

    // Agregar mensaje del usuario
    const userMessage = {
      id: `user-${Date.now()}`,
      message: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const token = await getToken();
      
      // Llamar al backend con session_id y producto seleccionado
      const enhancedContext = {
        ...(context || {}),
        product_id: productFromStorage?._id || selectedProduct?._id,
        product_name: productFromStorage?.nombre || selectedProduct?.nombre
      };
      
      const response = await scrumAIService.chat(token, {
        message: messageText,
        context: enhancedContext,
        session_id: activeConversation?.id || null // ✅ Enviar session_id para continuar conversación
      });

      // ✅ Si es conversación nueva, actualizar activeConversation
      if (response.is_new_session && response.session_id) {
        const firstMessage = messageText.substring(0, 50) + (messageText.length > 50 ? '...' : '');
        const newConvData = {
          id: response.session_id,
          title: firstMessage,
          loadedAt: new Date().toISOString()
        };
        setActiveConversation(newConvData);
        localStorage.setItem('scrum_ai_active_conversation', JSON.stringify(newConvData));
      }

      // Actualizar mensaje del usuario a 'sent'
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id
            ? { ...msg, status: 'sent' }
            : msg
        )
      );

      // ════════════════════════════════════════════════════════════════════════
      // ✅ Log resultado de arquitectura si existe
      // ════════════════════════════════════════════════════════════════════════
      if (response.architecture) {
        // Resultado de arquitectura procesado silenciosamente
      }

      // Agregar respuesta de SCRUM AI
      const aiMessage = {
        id: `ai-${Date.now()}`,
        message: response.response,
        isUser: false,
        timestamp: new Date().toISOString(),
        status: 'sent',
        specialty: response.agent?.type,
        intent: response.intent,
        confidence: response.confidence,
        needs_more_context: response.needs_more_context,
        hasCanvas: !!response.canvas,
        architectureResult: response.architecture || null // ✅ Incluir resultado de arquitectura
      };

      // Si hay datos de canvas, actualizarlos
      if (response.canvas) {
        setCanvasData(response.canvas);
      }

      // ✅ Si se guardó arquitectura exitosamente, actualizar estado
      if (response.architecture?.saved) {
        setHasArchitecture(true);
        setShowEditSections(false);
      }

      setIsTyping(false);
      
      // Delay simulado para efecto de typing
      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
      }, 300);

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // ════════════════════════════════════════════════════════════════════════
      // ✅ MEJORAR: Manejo de diferentes tipos de errores
      // ════════════════════════════════════════════════════════════════════════
      let errorText = 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente.';
      let errorCode = null;
      
      // Intentar extraer mensaje de error del backend
      if (error.message) {
        // Si el error tiene un mensaje estructurado del backend
        try {
          // A veces el error viene como JSON
          const parsedError = typeof error.message === 'string' && error.message.startsWith('{') 
            ? JSON.parse(error.message) 
            : null;
          
          if (parsedError?.message) {
            errorText = parsedError.message;
            errorCode = parsedError.code;
          } else if (error.message.includes('PRODUCT_REQUIRED') || error.message.includes('seleccionar un producto')) {
            errorText = '⚠️ **Producto requerido**\n\nPara realizar esta acción, primero debes seleccionar un producto. Escribe "muéstrame los productos" para ver la lista.';
            errorCode = 'PRODUCT_REQUIRED';
          } else {
            errorText = `Error: ${error.message}`;
          }
        } catch {
          errorText = error.message || errorText;
        }
      }
      
      // Mensaje de error
      const errorMessage = {
        id: `error-${Date.now()}`,
        message: errorText,
        isUser: false,
        timestamp: new Date().toISOString(),
        status: 'error',
        errorCode: errorCode
      };

      setIsTyping(false);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, context, isLoading, selectedProduct, activeConversation, activeEditSection]);

  // Limpiar historial
  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('scrum_ai_chat_history');
  }, []);

  // Actualizar contexto
  const updateContext = useCallback((newContext) => {
    setContext(newContext);
  }, []);

  // Cargar conversación existente
  const loadConversation = useCallback(async (conversationId) => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const conversation = await scrumAIService.loadConversation(token, conversationId);
      
      // Convertir mensajes del formato backend al formato frontend
      const formattedMessages = conversation.messages.map(msg => ({
        id: `${msg.role}-${msg.timestamp}`,
        message: msg.content,
        isUser: msg.role === 'user',
        timestamp: msg.timestamp,
        status: 'sent',
        specialty: msg.metadata?.specialty,
        intent: msg.metadata?.intent
      }));

      // Actualizar estado
      setMessages(formattedMessages);
      setContext(conversation.context);
      
      // Generar título para la conversación activa
      const firstUserMessage = formattedMessages.find(m => m.isUser);
      const title = firstUserMessage 
        ? firstUserMessage.message.substring(0, 50) + (firstUserMessage.message.length > 50 ? '...' : '')
        : 'Conversación';
      
      const activeConvData = {
        id: conversationId,
        title,
        loadedAt: new Date().toISOString()
      };
      
      setActiveConversation(activeConvData);
      
      // Guardar en localStorage
      localStorage.setItem('scrum_ai_chat_history', JSON.stringify(formattedMessages));
      localStorage.setItem('scrum_ai_active_conversation', JSON.stringify(activeConvData));
      
      return conversation;
    } catch (error) {
      console.error('Error al cargar conversación:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  // Seleccionar producto
  const selectProduct = useCallback((product) => {
    setSelectedProduct(product);
    setShowEditSections(false); // Reset edit sections view
    setActiveEditSection(null); // Reset edit section
    
    if (product) {
      localStorage.setItem('scrum_ai_selected_product', JSON.stringify(product));
      // Verificar si tiene arquitectura
      checkArchitecture(product._id);
    } else {
      localStorage.removeItem('scrum_ai_selected_product');
      setHasArchitecture(false);
    }
  }, [checkArchitecture]);

  // Toggle secciones de edición
  const toggleEditSections = useCallback(() => {
    setShowEditSections(prev => !prev);
  }, []);
  
  // Cambiar sección de edición activa
  const setEditSection = useCallback(async (section) => {
    setActiveEditSection(section);
    
    // Si hay producto seleccionado y no hay canvas abierto, abrir canvas de arquitectura
    const savedProduct = localStorage.getItem('scrum_ai_selected_product');
    const productData = savedProduct ? JSON.parse(savedProduct) : selectedProduct;
    
    if (productData?._id && !canvasData) {
      try {
        const token = await getToken();
        const response = await scrumAIService.getCanvasData(token, 'architecture', {
          product_id: productData._id,
          product_name: productData.nombre
        });
        
        if (response) {
          setCanvasData(response);
          if (response.data?.length > 0) {
            setHasArchitecture(true);
          }
        }
      } catch (error) {
        console.error('❌ [setEditSection] Error opening canvas:', error);
      }
    }
  }, [selectedProduct, canvasData, getToken]);

  // Crear nueva conversación
  const startNewConversation = useCallback(() => {
    setMessages([]);
    setContext(null);
    setActiveConversation(null);
    setCanvasData(null); // Limpiar canvas
    setSelectedProduct(null); // Limpiar producto seleccionado
    localStorage.removeItem('scrum_ai_chat_history');
    localStorage.removeItem('scrum_ai_active_conversation');
    localStorage.removeItem('scrum_ai_selected_product');
  }, []);

  // Cerrar canvas
  const closeCanvas = useCallback(() => {
    setCanvasData(null);
  }, []);

  // Refrescar datos del canvas
  const refreshCanvas = useCallback(async () => {
    if (!canvasData) return;
    
    try {
      const token = await getToken();
      // Re-fetch los datos del canvas
      const response = await scrumAIService.getCanvasData(token, canvasData.type, context);
      if (response) {
        setCanvasData(response);
      }
    } catch (error) {
      console.error('Error refreshing canvas:', error);
    }
  }, [canvasData, context, getToken]);

  // ════════════════════════════════════════════════════════════════════════════
  // ✅ NUEVO: Abrir canvas desde el historial
  // ════════════════════════════════════════════════════════════════════════════
  const openCanvas = useCallback(async (message) => {
    try {
      const token = await getToken();
      
      // Detectar el tipo de canvas basado en el contenido del mensaje
      let canvasType = 'products'; // Default
      
      // Analizar el mensaje para determinar el tipo
      const msgLower = message.message?.toLowerCase() || '';
      if (msgLower.includes('arquitectura') || msgLower.includes('tech_stack') || msgLower.includes('módulos del sistema')) {
        canvasType = 'architecture';
      } else if (msgLower.includes('backlog') || msgLower.includes('historias')) {
        canvasType = 'backlog';
      } else if (msgLower.includes('sprint')) {
        canvasType = 'sprints';
      } else if (msgLower.includes('tareas') || msgLower.includes('tasks')) {
        canvasType = 'tasks';
      } else if (msgLower.includes('equipo') || msgLower.includes('miembros')) {
        canvasType = 'team';
      }
      
      // Obtener producto seleccionado
      const savedProduct = localStorage.getItem('scrum_ai_selected_product');
      const productData = savedProduct ? JSON.parse(savedProduct) : selectedProduct;
      
      const canvasContext = {
        product_id: productData?._id,
        product_name: productData?.nombre
      };
      
      // Fetch canvas data
      const response = await scrumAIService.getCanvasData(token, canvasType, canvasContext);
      
      if (response) {
        setCanvasData(response);
        // Si es arquitectura y tiene datos, actualizar hasArchitecture
        if (canvasType === 'architecture' && response.data?.length > 0) {
          setHasArchitecture(true);
        }
      }
    } catch (error) {
      console.error('❌ [openCanvas] Error:', error);
    }
  }, [getToken, selectedProduct]);

  return {
    messages,
    isLoading,
    isTyping,
    context,
    activeConversation,
    canvasData,
    selectedProduct,
    hasArchitecture,        // ✅ Si tiene arquitectura
    showEditSections,       // ✅ Mostrar secciones de edición
    activeEditSection,      // ✅ Sección activa de edición
    sendMessage,
    clearHistory,
    updateContext,
    loadConversation,
    startNewConversation,
    selectProduct,
    closeCanvas,
    refreshCanvas,
    openCanvas,
    toggleEditSections,     // ✅ Toggle secciones de edición
    setEditSection,         // ✅ Establecer sección de edición
    checkArchitecture       // ✅ Verificar arquitectura
  };
};
