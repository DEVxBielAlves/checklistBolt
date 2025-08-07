import React from 'react';
import { ChecklistData } from '../types';
import { Check, X, Minus, Camera } from 'lucide-react';

interface Step4Props {
  data: ChecklistData;
  onBack: () => void;
  onFinish: () => void;
}

const inspectionLabels = {
  luzes_sinalizacao: 'Luzes e Sinalização',
  sirene_re: 'Sirene de Ré',
  buzina_pisca: 'Buzina e Pisca-Alerta',
  vazamentos: 'Vazamentos',
  epis: 'EPIs',
  borracha_coluna: 'Borracha na coluna',
  fitas_rabicho: 'Fitas (Rabicho)',
  cintas_catracas: 'Cintas e Catracas',
  faixas_reflexivas: 'Faixas Reflexivas'
};

const detailedInspectionLabels = {
  inspecao_pneus: 'Inspeção dos Pneus',
  inspecao_assoalho: 'Inspeção do Assoalho',
  inspecao_lonas: 'Inspeção das Lonas',
  inspecao_teto: 'Inspeção do Teto'
};

const getStatusIcon = (status: 'conforme' | 'nao_conforme' | 'na' | null) => {
  switch (status) {
    case 'conforme':
      return <Check size={16} className="text-green-600" />;
    case 'nao_conforme':
      return <X size={16} className="text-red-600" />;
    case 'na':
      return <Minus size={16} className="text-yellow-600" />;
    default:
      return null;
  }
};

const getStatusText = (status: 'conforme' | 'nao_conforme' | 'na' | null) => {
  switch (status) {
    case 'conforme':
      return 'Conforme';
    case 'nao_conforme':
      return 'Não Conforme';
    case 'na':
      return 'N/A';
    default:
      return 'Não definido';
  }
};

const getStatusColor = (status: 'conforme' | 'nao_conforme' | 'na' | null) => {
  switch (status) {
    case 'conforme':
      return 'text-green-600';
    case 'nao_conforme':
      return 'text-red-600';
    case 'na':
      return 'text-yellow-600';
    default:
      return 'text-gray-500';
  }
};

export const Step4Summary: React.FC<Step4Props> = ({ data, onBack, onFinish }) => {
  const getTotalPhotos = () => {
    return Object.values(data.inspecoesDetalhadas).reduce(
      (total, inspection) => total + (inspection.fotos?.length || 0),
      0
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Vehicle Info Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Checklist</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Dados do Veículo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div><span className="font-medium">Placa:</span> {data.veiculo.placa}</div>
            <div><span className="font-medium">Motorista:</span> {data.veiculo.motorista}</div>
            <div><span className="font-medium">Inspetor:</span> {data.veiculo.inspetor}</div>
            <div><span className="font-medium">Marca:</span> {data.veiculo.marca}</div>
            <div><span className="font-medium">Modelo:</span> {data.veiculo.modelo}</div>
            <div className="sm:col-span-2"><span className="font-medium">Data:</span> {data.veiculo.data}</div>
          </div>
        </div>

        {/* Basic Inspections Summary */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Inspeção Básica</h3>
          <div className="space-y-2">
            {Object.entries(data.inspecoes).map(([key, item]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{inspectionLabels[key as keyof typeof inspectionLabels]}</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Inspections Summary */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Inspeção Detalhada</h3>
          <div className="space-y-2">
            {Object.entries(data.inspecoesDetalhadas).map(([key, item]) => (
              <div key={key} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{detailedInspectionLabels[key as keyof typeof detailedInspectionLabels]}</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Camera size={12} />
                  <span>{item.fotos?.length || 0} foto(s)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Estatísticas</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Total de Itens:</span>
              <span className="ml-2">{Object.keys(data.inspecoes).length + Object.keys(data.inspecoesDetalhadas).length}</span>
            </div>
            <div>
              <span className="font-medium">Total de Fotos:</span>
              <span className="ml-2">{getTotalPhotos()}</span>
            </div>
            <div>
              <span className="font-medium">Conformes:</span>
              <span className="ml-2 text-green-600">
                {[...Object.values(data.inspecoes), ...Object.values(data.inspecoesDetalhadas)]
                  .filter(item => item.status === 'conforme').length}
              </span>
            </div>
            <div>
              <span className="font-medium">Não Conformes:</span>
              <span className="ml-2 text-red-600">
                {[...Object.values(data.inspecoes), ...Object.values(data.inspecoesDetalhadas)]
                  .filter(item => item.status === 'nao_conforme').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Media Gallery */}
      {getTotalPhotos() > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Galeria de Fotos</h3>
          <div className="space-y-4">
            {Object.entries(data.inspecoesDetalhadas).map(([key, item]) => {
              if (!item.fotos || item.fotos.length === 0) return null;
              
              return (
                <div key={key}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {detailedInspectionLabels[key as keyof typeof detailedInspectionLabels]}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {item.fotos.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`${detailedInspectionLabels[key as keyof typeof detailedInspectionLabels]} ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-500 text-white py-4 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-lg"
        >
          Voltar
        </button>
        <button
          onClick={onFinish}
          className="flex-1 bg-green-600 text-white py-4 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-lg"
        >
          Finalizar Checklist
        </button>
      </div>
    </div>
  );
};