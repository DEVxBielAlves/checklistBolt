import React from 'react';
import { ChecklistData } from '../types';
import { ArrowLeft, Check, X, Minus, Camera, User, Calendar, Truck } from 'lucide-react';

interface ChecklistViewerProps {
  checklist: ChecklistData;
  onBack: () => void;
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

export const ChecklistViewer: React.FC<ChecklistViewerProps> = ({ checklist, onBack }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };

  const getTotalPhotos = () => {
    return Object.values(checklist.inspecoesDetalhadas).reduce(
      (total, inspection) => total + (inspection.fotos?.length || 0),
      0
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-1 hover:bg-blue-700 rounded">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold">Detalhes do Checklist</h1>
            <p className="text-blue-100 text-sm">{checklist.veiculo.placa}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Vehicle Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dados do Veículo</h2>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Truck size={16} className="text-blue-600" />
                <span><span className="font-medium">Placa:</span> {checklist.veiculo.placa}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} className="text-blue-600" />
                <span><span className="font-medium">Motorista:</span> {checklist.veiculo.motorista}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} className="text-blue-600" />
                <span><span className="font-medium">Inspetor:</span> {checklist.veiculo.inspetor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck size={16} className="text-blue-600" />
                <span><span className="font-medium">Marca:</span> {checklist.veiculo.marca}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck size={16} className="text-blue-600" />
                <span><span className="font-medium">Modelo:</span> {checklist.veiculo.modelo}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-blue-600" />
                <span><span className="font-medium">Data:</span> {formatDate(checklist.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Inspections */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Inspeção Básica</h2>
          <div className="space-y-3">
            {Object.entries(checklist.inspecoes).map(([key, item]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{inspectionLabels[key as keyof typeof inspectionLabels]}</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
                {item.observacao && (
                  <div className="text-sm text-gray-600 bg-white p-2 rounded border-l-4 border-blue-500">
                    <strong>Observação:</strong> {item.observacao}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Inspections */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Inspeção Detalhada</h2>
          <div className="space-y-4">
            {Object.entries(checklist.inspecoesDetalhadas).map(([key, item]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{detailedInspectionLabels[key as keyof typeof detailedInspectionLabels]}</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
                
                {item.observacao && (
                  <div className="text-sm text-gray-600 bg-white p-2 rounded border-l-4 border-blue-500 mb-3">
                    <strong>Observação:</strong> {item.observacao}
                  </div>
                )}
                
                {item.fotos && item.fotos.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Camera size={14} />
                      <span>{item.fotos.length} foto(s)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {item.fotos.map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`${detailedInspectionLabels[key as keyof typeof detailedInspectionLabels]} ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estatísticas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {Object.keys(checklist.inspecoes).length + Object.keys(checklist.inspecoesDetalhadas).length}
              </div>
              <div className="text-sm text-gray-600">Total de Itens</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {[...Object.values(checklist.inspecoes), ...Object.values(checklist.inspecoesDetalhadas)]
                  .filter(item => item.status === 'conforme').length}
              </div>
              <div className="text-sm text-gray-600">Conformes</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {[...Object.values(checklist.inspecoes), ...Object.values(checklist.inspecoesDetalhadas)]
                  .filter(item => item.status === 'nao_conforme').length}
              </div>
              <div className="text-sm text-gray-600">Não Conformes</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {getTotalPhotos()}
              </div>
              <div className="text-sm text-gray-600">Total de Fotos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};