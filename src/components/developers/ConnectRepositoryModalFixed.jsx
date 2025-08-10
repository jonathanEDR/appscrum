// Este archivo ha sido reemplazado por AddRepositoryModal.jsx y AssignRepositoryModal.jsx
// Se mantiene aquí temporalmente para evitar errores de importación

import React from 'react';

const ConnectRepositoryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">Modal Deprecated</h2>
        <p className="mb-4">Este modal ha sido reemplazado por AddRepositoryModal y AssignRepositoryModal</p>
        <button 
          onClick={onClose} 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ConnectRepositoryModal;
