import React, { useState } from 'react';
import { ChecklistData } from '../types';
import { Plus, Eye, Download, Trash2, Calendar, User, Truck } from 'lucide-react';

interface HomePageProps {
  checklists: ChecklistData[];
  onStartNewChecklist: () => void;
  onViewChecklist: (checklist: ChecklistData) => void;
  onDeleteChecklist: (id: string) => void;
  onDownloadPDF: (checklist: ChecklistData) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  checklists,
  onStartNewChecklist,
  onViewChecklist,
  onDeleteChecklist,
  onDownloadPDF
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState('');

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
    setDeleteInput('');
  };

  const confirmDelete = (id: string) => {
    if (deleteInput.toLowerCase() === 'delete') {
      onDeleteChecklist(id);
      setDeleteConfirmId(null);
      setDeleteInput('');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
    setDeleteInput('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusSummary = (checklist: ChecklistData) => {
    const allItems = [...Object.values(checklist.inspecoes), ...Object.values(checklist.inspecoesDetalhadas)];
    const conforme = allItems.filter(item => item.status === 'conforme').length;
    const naoConforme = allItems.filter(item => item.status === 'nao_conforme').length;
    const na = allItems.filter(item => item.status === 'na').length;
    
    return { conforme, naoConforme, na, total: allItems.length };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <Truck size={24} />
          <h1 className="text-lg font-bold">Checklist Basell</h1>
        </div>
        <p className="text-blue-100 text-sm mt-1">Histórico de Inspeções</p>
      </div>

      {/* Content */}
      <div className="p-4">
        {checklists.length === 0 ? (
          <div className="text-center py-12">
            <Truck size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Nenhum checklist encontrado</h2>
            <p className="text-gray-500 mb-6">Comece criando seu primeiro checklist de inspeção</p>
          </div>
        ) : (
          <div className="space-y-4">
            {checklists.map((checklist) => {
              const summary = getStatusSummary(checklist);
              
              return (
                <div key={checklist.id} className="bg-white rounded-lg shadow-sm border p-4">
                  {/* Delete Confirmation Modal */}
                  {deleteConfirmId === checklist.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Exclusão</h3>
                        <p className="text-gray-600 mb-4">
                          Para excluir o checklist da placa <strong>{checklist.veiculo.placa}</strong>, 
                          digite "delete\" abaixo:
                        </p>
                        <input
                          type="text"
                          value={deleteInput}
                          onChange={(e) => setDeleteInput(e.target.value)}
                          placeholder="Digite 'delete'"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={cancelDelete}
                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => confirmDelete(checklist.id)}
                            disabled={deleteInput.toLowerCase() !== 'delete'}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Checklist Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{checklist.veiculo.placa}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <User size={14} />
                          <span>{checklist.veiculo.motorista}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{formatDate(checklist.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{checklist.veiculo.marca} - {checklist.veiculo.modelo}</div>
                    </div>
                  </div>

                  {/* Status Summary */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{summary.total}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{summary.conforme}</div>
                      <div className="text-xs text-gray-500">Conforme</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">{summary.naoConforme}</div>
                      <div className="text-xs text-gray-500">Não Conforme</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-600">{summary.na}</div>
                      <div className="text-xs text-gray-500">N/A</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => onViewChecklist(checklist)}
                      className="flex items-center justify-center space-x-2 flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Eye size={16} />
                      <span>Ver Mais</span>
                    </button>
                    <button
                      onClick={() => onDownloadPDF(checklist)}
                      className="flex items-center justify-center space-x-2 flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <Download size={16} />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(checklist.id)}
                      className="flex items-center justify-center space-x-2 flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onStartNewChecklist}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};