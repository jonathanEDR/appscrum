import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Award,
  Calendar,
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { profileService } from '../../../services/profileService';

const CertificationsSection = ({ profile, onRefresh, onSuccess, onError, viewMode }) => {
  const { getToken } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expirationDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  const certifications = profile.certifications || [];
  const canAddMore = certifications.length < 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.issuer.trim()) {
      onError('Nombre y organización emisora son requeridos');
      return;
    }

    try {
      setSaving(true);
      const data = {
        name: formData.name,
        issuer: formData.issuer,
        issueDate: formData.issueDate || undefined,
        expirationDate: formData.expirationDate || undefined,
        credentialId: formData.credentialId || undefined,
        credentialUrl: formData.credentialUrl || undefined
      };
      
      await profileService.addCertification(data, getToken);
      onSuccess('Certificación agregada correctamente');
      resetForm();
      setIsAdding(false);
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al agregar certificación');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cert) => {
    setEditingId(cert._id);
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate?.split('T')[0] || '',
      expirationDate: cert.expirationDate?.split('T')[0] || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || ''
    });
  };

  const handleUpdate = async (certId) => {
    if (!formData.name.trim() || !formData.issuer.trim()) {
      onError('Nombre y organización emisora son requeridos');
      return;
    }

    try {
      setSaving(true);
      const data = {
        name: formData.name,
        issuer: formData.issuer,
        issueDate: formData.issueDate || undefined,
        expirationDate: formData.expirationDate || undefined,
        credentialId: formData.credentialId || undefined,
        credentialUrl: formData.credentialUrl || undefined
      };
      
      await profileService.updateCertification(certId, data, getToken);
      onSuccess('Certificación actualizada correctamente');
      setEditingId(null);
      resetForm();
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al actualizar certificación');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (certId) => {
    if (!confirm('¿Estás seguro de eliminar esta certificación?')) return;

    try {
      setSaving(true);
      await profileService.deleteCertification(certId, getToken);
      onSuccess('Certificación eliminada correctamente');
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al eliminar certificación');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      credentialUrl: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    resetForm();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    const exp = new Date(expirationDate);
    const now = new Date();
    const threeMonths = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
    return exp > now && (exp - now) < threeMonths;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            Certificaciones
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {certifications.length}/3 certificaciones agregadas
          </p>
        </div>
        
        {viewMode === 'edit' && !isAdding && !editingId && canAddMore && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-800 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Agregar Certificación
          </button>
        )}
      </div>

      {/* Formulario */}
      {(isAdding || editingId) && viewMode === 'edit' && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-4">
            {isAdding ? 'Nueva Certificación' : 'Editar Certificación'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nombre de la Certificación *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="ej: AWS Certified Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Organización Emisora *
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="ej: Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Fecha de Emisión
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Fecha de Expiración
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Dejar vacío si no expira
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  ID de Credencial
                </label>
                <input
                  type="text"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="ej: ABC-123-XYZ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  URL de Verificación
                </label>
                <input
                  type="url"
                  name="credentialUrl"
                  value={formData.credentialUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancelEdit}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={isAdding ? handleAdd : () => handleUpdate(editingId)}
              disabled={saving}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Lista de Certificaciones */}
      {certifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Award className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No has agregado certificaciones aún
          </p>
          {viewMode === 'edit' && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Agregar Primera Certificación
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.sort((a, b) => new Date(b.issueDate || 0) - new Date(a.issueDate || 0)).map((cert) => (
            <div
              key={cert._id}
              className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {cert.name}
                      </h3>
                      <p className="text-orange-600 dark:text-orange-400 font-medium mt-1">
                        {cert.issuer}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                        {cert.issueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Emitida: {formatDate(cert.issueDate)}</span>
                          </div>
                        )}
                        
                        {cert.expirationDate && (
                          <div className="flex items-center gap-1">
                            {isExpired(cert.expirationDate) ? (
                              <>
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                  Expirada: {formatDate(cert.expirationDate)}
                                </span>
                              </>
                            ) : isExpiringSoon(cert.expirationDate) ? (
                              <>
                                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                                  Expira: {formatDate(cert.expirationDate)}
                                </span>
                              </>
                            ) : (
                              <span>Expira: {formatDate(cert.expirationDate)}</span>
                            )}
                          </div>
                        )}
                        
                        {!cert.expirationDate && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                            No expira
                          </span>
                        )}
                      </div>
                      
                      {cert.credentialId && (
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">ID: </span>
                          <span className="font-mono">{cert.credentialId}</span>
                        </div>
                      )}
                      
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Verificar Credencial
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {viewMode === 'edit' && !editingId && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert._id)}
                      disabled={saving}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!canAddMore && viewMode === 'edit' && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            Has alcanzado el límite máximo de 3 certificaciones
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificationsSection;
