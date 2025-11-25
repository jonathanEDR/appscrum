import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const CeremonyModal = ({ isOpen, onClose, ceremony, onSave }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    type: 'daily_standup',
    title: '',
    date: '',
    time: '09:00',
    duration: 15,
    notes: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !ceremony) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [isOpen, ceremony]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!formData.title.trim()) {
        throw new Error('El título es obligatorio');
      }
      await onSave(formData);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className={`relative rounded-lg shadow-xl max-w-2xl w-full ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Nueva Ceremonia
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Tipo *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className={`w-full p-3 border rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="daily_standup">Daily Standup</option>
                <option value="sprint_planning">Sprint Planning</option>
                <option value="sprint_review">Sprint Review</option>
                <option value="retrospective">Retrospectiva</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full p-3 border rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Fecha *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full p-3 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Hora *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`w-full p-3 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
            </div>

            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700'
              }`}>
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 border rounded-lg ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CeremonyModal;
