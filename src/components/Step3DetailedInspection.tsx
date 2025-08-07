import React, { useState, useRef } from 'react';
import { DetailedInspectionItem } from '../types';
import { StatusButton } from './StatusButton';
import { Camera, X } from 'lucide-react';

interface Step3Props {
  data: { [key: string]: DetailedInspectionItem };
  onUpdate: (data: { [key: string]: DetailedInspectionItem }) => void;
  onNext: () => void;
  onBack: () => void;
}

const detailedInspectionItems = [
  {
    id: 'inspecao_pneus',
    title: 'Inspeção dos Pneus',
    description: 'Verificação visual completa com documentação'
  },
  {
    id: 'inspecao_assoalho',
    title: 'Inspeção do Assoalho',
    description: 'Verificação visual detalhada com mídia'
  },
  {
    id: 'inspecao_lonas',
    title: 'Inspeção das Lonas',
    description: 'Verificação bilateral das lonas'
  },
  {
    id: 'inspecao_teto',
    title: 'Inspeção do Teto',
    description: 'Avaliação completa das condições do teto'
  }
];

export const Step3DetailedInspection: React.FC<Step3Props> = ({ data, onUpdate, onNext, onBack }) => {
  const [inspections, setInspections] = useState<{ [key: string]: DetailedInspectionItem }>(data);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleStatusChange = (itemId: string, status: 'conforme' | 'nao_conforme' | 'na') => {
    const updatedInspections = {
      ...inspections,
      [itemId]: {
        ...inspections[itemId],
        id: itemId,
        status: inspections[itemId]?.status === status ? null : status,
        observacao: inspections[itemId]?.observacao || '',
        fotos: inspections[itemId]?.fotos || []
      }
    };
    setInspections(updatedInspections);
    
    // Clear status error
    if (errors[`${itemId}_status`]) {
      setErrors(prev => ({ ...prev, [`${itemId}_status`]: '' }));
    }
  };

  const handleObservationChange = (itemId: string, observacao: string) => {
    setInspections(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        id: itemId,
        status: prev[itemId]?.status || null,
        observacao,
        fotos: prev[itemId]?.fotos || []
      }
    }));
  };

  const handlePhotoChange = (itemId: string, files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      const currentFiles = inspections[itemId]?.fotos || [];
      const updatedFiles = [...currentFiles, ...newFiles];
      
      setInspections(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          id: itemId,
          status: prev[itemId]?.status || null,
          observacao: prev[itemId]?.observacao || '',
          fotos: updatedFiles
        }
      }));
      
      // Clear photo error
      if (errors[`${itemId}_fotos`]) {
        setErrors(prev => ({ ...prev, [`${itemId}_fotos`]: '' }));
      }
    }
  };

  const removePhoto = (itemId: string, photoIndex: number) => {
    const currentFiles = inspections[itemId]?.fotos || [];
    const updatedFiles = currentFiles.filter((_, index) => index !== photoIndex);
    
    setInspections(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        fotos: updatedFiles
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    detailedInspectionItems.forEach(item => {
      if (!inspections[item.id]?.status) {
        newErrors[`${item.id}_status`] = 'Status é obrigatório';
      }
      
      const inspection = inspections[item.id];
      if (inspection?.status) {
        // Se for N/A, foto não é obrigatória
        if (inspection.status !== 'na') {
          if (!inspection.fotos || inspection.fotos.length === 0) {
            newErrors[`${item.id}_fotos`] = 'Pelo menos uma foto é obrigatória';
          }
        }
        
        // Se for não conforme, observação é obrigatória
        if (inspection.status === 'nao_conforme') {
          if (!inspection.observacao || inspection.observacao.trim() === '') {
            newErrors[`${item.id}_observacao`] = 'Observação é obrigatória para itens não conformes';
          }
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(inspections);
      onNext();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Inspeção Detalhada</h2>
        
        {detailedInspectionItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`pb-6 ${index < detailedInspectionItems.length - 1 ? 'mb-6 border-b border-gray-200' : ''}`}
          >
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            </div>
            
            {/* Status Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <StatusButton
                status="conforme"
                isSelected={inspections[item.id]?.status === 'conforme'}
                onClick={() => handleStatusChange(item.id, 'conforme')}
              />
              <StatusButton
                status="nao_conforme"
                isSelected={inspections[item.id]?.status === 'nao_conforme'}
                onClick={() => handleStatusChange(item.id, 'nao_conforme')}
              />
              <StatusButton
                status="na"
                isSelected={inspections[item.id]?.status === 'na'}
                onClick={() => handleStatusChange(item.id, 'na')}
              />
            </div>
            {errors[`${item.id}_status`] && (
              <p className="text-red-500 text-sm mb-3">{errors[`${item.id}_status`]}</p>
            )}
            
            {/* Photo Upload */}
            <div className={`mb-3 ${inspections[item.id]?.status === 'na' ? 'opacity-50' : ''}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos {inspections[item.id]?.status === 'na' ? '(opcional)' : '(obrigatório - mínimo 1)'}
              </label>
              <input
                ref={el => fileInputRefs.current[item.id] = el}
                type="file"
                accept="image/*"
                multiple
                capture="camera"
                onChange={(e) => handlePhotoChange(item.id, e.target.files)}
                className="hidden"
                disabled={inspections[item.id]?.status === 'na'}
              />
              <button
                onClick={() => fileInputRefs.current[item.id]?.click()}
                className={`flex items-center justify-center space-x-2 w-full p-4 border-2 border-dashed rounded-lg transition-colors ${
                  inspections[item.id]?.status === 'na' 
                    ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                    : 'border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-gray-100'
                }`}
                disabled={inspections[item.id]?.status === 'na'}
              >
                <Camera size={24} />
                <span className="font-medium">Capturar Foto da Câmera</span>
              </button>
              
              {/* Photo Preview */}
              {inspections[item.id]?.fotos && inspections[item.id].fotos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {inspections[item.id].fotos.map((file, photoIndex) => (
                    <div key={photoIndex} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${photoIndex + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(item.id, photoIndex)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {errors[`${item.id}_fotos`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`${item.id}_fotos`]}</p>
              )}
            </div>
            
            {/* Observations */}
            <textarea
              placeholder={inspections[item.id]?.status === 'nao_conforme' ? 'Observações (obrigatório)' : 'Observações (opcional)'}
              value={inspections[item.id]?.observacao || ''}
              onChange={(e) => handleObservationChange(item.id, e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                errors[`${item.id}_observacao`] ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={2}
            />
            {errors[`${item.id}_observacao`] && (
              <p className="text-red-500 text-sm mt-1">{errors[`${item.id}_observacao`]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-500 text-white py-4 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-lg"
        >
          Voltar
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-blue-600 text-white py-4 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};