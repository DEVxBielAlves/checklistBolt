import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ChecklistViewer } from './components/ChecklistViewer';
import { ChecklistData, VehicleData, InspectionItem, DetailedInspectionItem } from './types';
import { Header } from './components/Header';
import { Step1VehicleInfo } from './components/Step1VehicleInfo';
import { Step2BasicInspection } from './components/Step2BasicInspection';
import { Step3DetailedInspection } from './components/Step3DetailedInspection';
import { Step4Summary } from './components/Step4Summary';
import { CheckCircle } from 'lucide-react';

const initialVehicleData: VehicleData = {
  placa: '',
  motorista: '',
  inspetor: '',
  marca: '',
  modelo: '',
  data: ''
};

const initialChecklistData: ChecklistData = {
  veiculo: initialVehicleData,
  inspecoes: {},
  inspecoesDetalhadas: {},
  id: '',
  createdAt: ''
};

type AppState = 'home' | 'checklist' | 'viewing';

function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [currentStep, setCurrentStep] = useState(1);
  const [checklistData, setChecklistData] = useState<ChecklistData>(initialChecklistData);
  const [isCompleted, setIsCompleted] = useState(false);
  const [savedChecklists, setSavedChecklists] = useState<ChecklistData[]>([]);
  const [viewingChecklist, setViewingChecklist] = useState<ChecklistData | null>(null);

  const updateVehicleData = (data: VehicleData) => {
    setChecklistData(prev => ({ ...prev, veiculo: data }));
  };

  const updateBasicInspections = (data: { [key: string]: InspectionItem }) => {
    setChecklistData(prev => ({ ...prev, inspecoes: data }));
  };

  const updateDetailedInspections = (data: { [key: string]: DetailedInspectionItem }) => {
    setChecklistData(prev => ({ ...prev, inspecoesDetalhadas: data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const finishChecklist = () => {
    // Generate ID and timestamp
    const completedChecklist = {
      ...checklistData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    // Save to history
    setSavedChecklists(prev => [completedChecklist, ...prev]);
    
    setIsCompleted(true);
  };

  const startNewChecklist = () => {
    setAppState('checklist');
    setCurrentStep(1);
    setChecklistData(initialChecklistData);
    setIsCompleted(false);
  };

  const goToHome = () => {
    setAppState('home');
    setCurrentStep(1);
    setChecklistData(initialChecklistData);
    setIsCompleted(false);
    setViewingChecklist(null);
  };

  const viewChecklist = (checklist: ChecklistData) => {
    setViewingChecklist(checklist);
    setAppState('viewing');
  };

  const deleteChecklist = (id: string) => {
    setSavedChecklists(prev => prev.filter(checklist => checklist.id !== id));
  };

  const downloadPDF = (checklist: ChecklistData) => {
    // Placeholder for PDF generation
    alert(`Download PDF para checklist ${checklist.veiculo.placa} - Funcionalidade será implementada`);
  };

  // Home page
  if (appState === 'home') {
    return (
      <HomePage
        checklists={savedChecklists}
        onStartNewChecklist={startNewChecklist}
        onViewChecklist={viewChecklist}
        onDeleteChecklist={deleteChecklist}
        onDownloadPDF={downloadPDF}
      />
    );
  }

  // Viewing checklist details
  if (appState === 'viewing' && viewingChecklist) {
    return (
      <ChecklistViewer
        checklist={viewingChecklist}
        onBack={goToHome}
      />
    );
  }

  // Checklist completion screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Checklist Concluído!</h1>
              <p className="text-gray-600">
                O checklist foi finalizado com sucesso para o veículo {checklistData.veiculo.placa}.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 space-y-1">
                <div><span className="font-medium">Data:</span> {checklistData.veiculo.data}</div>
                <div><span className="font-medium">Motorista:</span> {checklistData.veiculo.motorista}</div>
                <div><span className="font-medium">Inspetor:</span> {checklistData.veiculo.inspetor}</div>
              </div>
            </div>
            
            <button
              onClick={goToHome}
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Checklist creation flow
  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentStep={currentStep} totalSteps={4} />
      
      <div className="pb-4">
        {currentStep === 1 && (
          <Step1VehicleInfo
            data={checklistData.veiculo}
            onUpdate={updateVehicleData}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 2 && (
          <Step2BasicInspection
            data={checklistData.inspecoes}
            onUpdate={updateBasicInspections}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 3 && (
          <Step3DetailedInspection
            data={checklistData.inspecoesDetalhadas}
            onUpdate={updateDetailedInspections}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 4 && (
          <Step4Summary
            data={checklistData}
            onBack={prevStep}
            onFinish={finishChecklist}
          />
        )}
      </div>
    </div>
  );
}

export default App;