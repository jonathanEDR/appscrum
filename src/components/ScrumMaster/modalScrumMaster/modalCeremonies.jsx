import React, { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';

const CeremonyModal = ({ isOpen, onClose, ceremony, onSave, teamMembers = [] }) => {
  const [formData, setFormData] = useState({
    type: 'daily_standup',
    title: '',
    date: '',
    time: '',
    duration: 15,
    participants: [],
    notes: '',
    goals: [],
    blockers: []
  });

  const [newGoal, setNewGoal] = useState('');
  const [newBlocker, setNewBlocker] = useState('');

  // teamMembers ahora viene por props desde el componente padre

  useEffect(() => {
    if (ceremony) {
      setFormData({
        type: ceremony.type || 'daily_standup',
        title: ceremony.title || '',
        date: ceremony.date || '',
        time: ceremony.time || '',
        duration: ceremony.duration || 15,
        participants: ceremony.participants || [],
        notes: ceremony.notes || '',
        goals: ceremony.goals || [],
        blockers: ceremony.blockers || []
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        type: 'daily_standup',
        title: '',
        date: today,
        time: '09:00',
        duration: 15,
        participants: [],
        notes: '',
        goals: [],
        blockers: []
      });
    }
  }, [ceremony]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleParticipantToggle = (member) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(member)
        ? prev.participants.filter(p => p !== member)
        : [...prev.participants, member]
    }));
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }));
      setNewGoal('');
    }
  };
  const handleRemoveGoal = (index) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const handleAddBlocker = () => {
    if (newBlocker.trim()) {
      setFormData(prev => ({
        ...prev,
        blockers: [...prev.blockers, newBlocker.trim()]
      }));
      setNewBlocker('');
    }
  };

  const handleRemoveBlocker = (index) => {
    setFormData(prev => ({
      ...prev,
      blockers: prev.blockers.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {ceremony ? 'Editar Ceremonia' : 'Nueva Ceremonia'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Ceremonia
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="daily_standup">Daily Standup</option>
                  <option value="sprint_planning">Sprint Planning</option>
                  <option value="sprint_review">Sprint Review</option>
                  <option value="retrospective">Retrospectiva</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  min="5"
                  max="480"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participantes
              </label>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <label key={member} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.participants.includes(member)}
                      onChange={() => handleParticipantToggle(member)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{member}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Notas, acuerdos, decisiones tomadas..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivos
              </label>
              <div className="space-y-2">
                {formData.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-gray-50 rounded-md text-sm">
                      {goal}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Agregar objetivo..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGoal())}
                  />
                  <button
                    type="button"
                    onClick={handleAddGoal}
                    className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bloqueos
              </label>
              <div className="space-y-2">
                {formData.blockers.map((blocker, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-red-50 rounded-md text-sm text-red-700">
                      {blocker}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlocker(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBlocker}
                    onChange={(e) => setNewBlocker(e.target.value)}
                    placeholder="Agregar bloqueo..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBlocker())}
                  />
                  <button
                    type="button"
                    onClick={handleAddBlocker}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <Save className="h-4 w-4 mr-1" />
              {ceremony ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CeremonyModal;
