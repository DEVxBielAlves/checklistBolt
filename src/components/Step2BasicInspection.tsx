import React, { useState } from 'react';
import { InspectionItem } from '../types';
import { StatusButton } from './StatusButton';

interface Step2Props {
  data: { [key: string]: InspectionItem };
  onUpdate: (data: { [key: string]: InspectionItem }) => void;
  onNext: () => void;
  onBack: () => void;
}

const inspectionItems = [
  {
    id: 'luzes_sinalizacao',
    title: 'Luzes e Sinalização',
    description: 'Funcionamento de lanternas de frio, ré, faróis e setas'
  },
  {
    id: 'sirene_re',
    title: 'Sirene de Ré',
    description: 'Verificação do funcionamento da sirene'
  },
  {
    id: 'buzina_pisca',
    title: 'Buzina e Pisca-Alerta',
    description: 'Teste de funcionamento de buzina e pisca-alerta'
  },
  {
    id: 'vazamentos',
    title: 'Vazamentos',
    description: 'Verificação de ausência de vazamento de óleo'
  },
  {
    id: 'epis',
    title: 'EPIs',
    description: 'Confirmação do uso obrigatório dos equipamentos de proteção'
  },
  {
    id: 'borracha_coluna',
    title: 'Borracha na coluna',
    description: 'Avaliação das condições gerais das borrachas nas colunas'
  },
  {
    id: 'fitas_rabicho',
    title: 'Fitas (Rabicho)',
    description: 'Inspeção do estado das fitas de amarração'
  },
  {
    id: 'cintas_catracas',
    title: 'Cintas e Catracas',
    description: 'Verificação de cintas e catracas (fixa e móvel)'
  },
  {
    id: 'faixas_reflexivas',
    title: 'Faixas Reflexivas',
    description: 'Avaliação das condições das faixas reflexivas'
  }
];

export const Step2BasicInspection: React.FC<Step2Props> = ({ data, onUpdate, onNext, onBack }) => {
  const [inspections, setInspections] = useState<{ [key: string]: InspectionItem }>(data);
  const [errors, setErrors] = useState<string[]>([]);

  const handleStatusChange = (itemId: string, status: 'conforme' | 'nao_conforme' | 'na') => {
    const updatedInspections = {
      ...inspections,
      [itemId]: {
        ...inspections[itemId],
        id: itemId,
        status: inspections[itemId]?.status === status ? null : status,
        observacao: inspections[itemId]?.observacao || ''
      }
    };
    setInspections(updatedInspections);
    
    // Clear errors when user makes selection
    if (errors.includes(itemId)) {
      setErrors(errors.filter(id => id !== itemId));
    }
  };

  const handleObservationChange = (itemId: string, observacao: string) => {
    setInspections(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        id: itemId,
        status: prev[itemId]?.status || null,
        observacao
      }
    }));
  };

  const validateForm = (): boolean => {
    const missingItems = inspectionItems
      .filter(item => !inspections[item.id]?.status)
      .map(item => item.id);
    
    setErrors(missingItems);
    return missingItems.length === 0;
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Inspeção Básica</h2>
        
        {inspectionItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`pb-6 ${index < inspectionItems.length - 1 ? 'mb-6 border-b border-gray-200' : ''}`}
          >
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            
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
            
            <textarea
              placeholder="Observações (opcional)"
              value={inspections[item.id]?.observacao || ''}
              onChange={(e) => handleObservationChange(item.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
            />
            
            {errors.includes(item.id) && (
              <p className="text-red-500 text-sm mt-1">Este item é obrigatório</p>
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